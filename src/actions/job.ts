import * as core from '@actions/core'
import * as github from '@actions/github'
import * as logger from './logger'
import {FORESIGHT_WORKFLOW_ENV_VARS} from '../constants'
import {JobInfo} from '../interfaces'
import {Octokit} from '@octokit/action'

const PAGE_SIZE = 100
const {repo, runId} = github.context
logger.info(`repo: ${repo.owner}, runId: ${runId}`)

export async function getJobInfo(octokit: Octokit): Promise<JobInfo> {
    const condition = true
    const _getJobInfo = async (): Promise<JobInfo> => {
        for (let page = 0; condition; page++) {
            logger.info(`Get job info start: ${page}`)
            let result
            try {
                result = await octokit.rest.actions.listJobsForWorkflowRun({
                    owner: repo.owner,
                    repo: repo.repo,
                    run_id: runId,
                    per_page: PAGE_SIZE,
                    page
                })
            } catch (error) {
                result = undefined
            }
            if (!result) {
                break
            }
            logger.info(`Results : ${JSON.stringify(result)}`)
            const jobs = result.data.jobs
            logger.info(`Results : ${JSON.stringify(jobs)}`)
            // If there are no jobs, stop here
            if (!jobs || !jobs.length) {
                break
            }
            const currentJobs = jobs.filter(
                it =>
                    it.status === 'in_progress' &&
                    it.runner_name === process.env.RUNNER_NAME
            )
            logger.info(`currentJobs : ${JSON.stringify(currentJobs)}`)
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
        if (currentJobInfo && currentJobInfo.id) {
            return currentJobInfo
        }
        await new Promise(r => setTimeout(r, 1000))
    }
    return {}
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export async function setJobInfoEnvVar(jobInfo: JobInfo) {
    core.exportVariable(
        FORESIGHT_WORKFLOW_ENV_VARS.FORESIGHT_WORKFLOW_JOB_ID,
        jobInfo.id
    )
    core.exportVariable(
        FORESIGHT_WORKFLOW_ENV_VARS.FORESIGHT_WORKFLOW_JOB_NAME,
        jobInfo.name
    )
}
