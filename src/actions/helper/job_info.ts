// @ts-nocheck
import { FORESIGHT_WORKFLOW_ENV_VARS } from '../../constants';
import * as github from '@actions/github';
import { JobInfo } from '../../interfaces';
import * as core from '@actions/core';
import * as logger from './logger';

const PAGE_SIZE = 100
const { repo, runId } = github.context
logger.info(`repo: ${repo.owner}, runId: ${runId}`)

export async function getJobInfo(octokit: any): Promise<JobInfo> {
    const _getJobInfo = async (): Promise<JobInfo> => {
      for (let page = 0; true; page++) {
        const result = await octokit.rest.actions.listJobsForWorkflowRun({
          owner: repo.owner,
          repo: repo.repo,
          run_id: runId,
          per_page: PAGE_SIZE,
          page
        })
        const jobs = result.data.jobs
        // If there are no jobs, stop here
        if (!jobs || !jobs.length) {
          break
        }
        const currentJobs = jobs.filter(
          it =>
            it.status === 'in_progress' &&
            it.runner_name === process.env.RUNNER_NAME
        )
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

export async function setJobInfoEnvVar(jobInfo: JobInfo) {
    core.exportVariable(FORESIGHT_WORKFLOW_ENV_VARS.FORESIGHT_WORKFLOW_JOB_ID, jobInfo.id);
    core.exportVariable(FORESIGHT_WORKFLOW_ENV_VARS.FORESIGHT_WORKFLOW_JOB_NAME, jobInfo.name);
}