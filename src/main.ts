import * as core from '@actions/core';
import { getJobInfo, setJobInfoEnvVar } from './actions/helper/job_info';
import * as logger from './actions/helper/logger';
import { Octokit } from '@octokit/action';
import { exitProcessSuccessfully } from './actions/helper/utils';
import { validateInputs } from './actions/helper/inputs';

const octokit: Octokit = new Octokit()


const apikey: string = core.getInput('apikey', { required: true });
const test_framework: string = core.getInput('test_framework', { required: false });
const test_path: string[] = core.getMultilineInput('test_path', { required: false });
const coverage_framework: string = core.getInput('coverage_framework', { required: false });
const coverage_path: string[] = core.getMultilineInput('coverage_path', { required: false });
const action_disabled: boolean = core.getBooleanInput('action_disabled', { required: false });

validateInputs(test_framework, test_path, coverage_framework, coverage_path, action_disabled);

async function run(): Promise<void> {
  try {
    const jobInfo = await getJobInfo(octokit);
    if (!jobInfo.id || !jobInfo.name) {
      logger.notice("Workflow job information couldn't retrieved! Foresight test kit exit!")
      exitProcessSuccessfully();
    }
    await setJobInfoEnvVar(jobInfo);
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()