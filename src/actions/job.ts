import * as core from '@actions/core'
import * as github from '@actions/github'
import * as logger from './logger'
import {FORESIGHT_WORKFLOW_ENV_VARS} from '../constants'
import {JobInfo} from '../interfaces'
import {Octokit} from '@octokit/action'
import {RequestError} from '@octokit/request-error'

const PAGE_SIZE = 100
const {repo, runId} = github.context
logger.debug(`repo: ${repo.owner}, runId: ${runId}`)

export async function getJobInfo(octokit: Octokit): Promise<JobInfo> {
    const condition = true
    const _getJobInfo = async (): Promise<JobInfo> => {
        for (let page = 0; condition; page++) {
            logger.debug(`Get job info start: ${page}`)
            let result
            try {
                result = await octokit.rest.actions.listJobsForWorkflowRun({
                    owner: repo.owner,
                    repo: repo.repo,
                    run_id: runId,
                    per_page: PAGE_SIZE,
                    page
                })
            } catch (error: any) {
                result = undefined
                if (error instanceof RequestError) {
                    logger.info(`Exception occured while fetch job info from github: ${  error.message}`)
                    /**
                     * check whether error is Resource not accessible by integration or not
                     * if error status equals to 403 it might be 2 different error RateLimitError or ResourceNotAccessible
                     * if error status=403 and x-ratelimit-remaining = 0 error must be RateLimitError other
                     * else if status=403 and x-ratelimit-remaining != 0 we assume that error is ResourceNotAccessible
                     */
                    if (
                        error.response?.headers['x-ratelimit-remaining'] !==
                            '0' &&
                        error.status === 403
                    ) {
                        return {
                            id: undefined,
                            name: undefined,
                            notAccessible: true
                        }
                    }
                }
            }
            if (!result) {
                break
            }
            logger.debug(`Results : ${JSON.stringify(result)}`)
            const jobs = result.data.jobs
            logger.debug(`Results : ${JSON.stringify(jobs)}`)
            // If there are no jobs, stop here
            if (!jobs || !jobs.length) {
                break
            }
            const currentJobs = jobs.filter(
                it =>
                    it.status === 'in_progress' &&
                    it.runner_name === process.env.RUNNER_NAME
            )
            logger.debug(`currentJobs : ${JSON.stringify(currentJobs)}`)
            if (currentJobs && currentJobs.length) {
                return {
                    id: currentJobs[0].id,
                    name: currentJobs[0].name
                }
            }
            // Since returning job count is less than page size, this means that there are no other jobs.
            // So no need to make another request for the next page.
            if (jobs.length < PAGE_SIZE) {
                break
            }
        }
        return {}
    }
    for (let i = 0; i < 10; i++) {
        const currentJobInfo = await _getJobInfo()
        if (
            currentJobInfo &&
            (currentJobInfo.id || currentJobInfo.notAccessible === true)
        ) {
            return currentJobInfo
        }
        await new Promise(r => setTimeout(r, 1000))
    }
    return {}
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export async function setJobInfoEnvVar(jobInfo: JobInfo) {
    if (jobInfo.id !== undefined) {
        core.exportVariable(
            FORESIGHT_WORKFLOW_ENV_VARS.FORESIGHT_WORKFLOW_JOB_ID,
            jobInfo.id
        )
    }
    if (jobInfo.id !== undefined) {
        core.exportVariable(
            FORESIGHT_WORKFLOW_ENV_VARS.FORESIGHT_WORKFLOW_JOB_NAME,
            jobInfo.name
        )
    }
}
