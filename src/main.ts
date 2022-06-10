import * as core from '@actions/core';
import { getJobInfo, setJobInfoEnvVar } from './actions/helper/job_info';
import * as logger from './actions/helper/logger';
import * as utils from './actions/helper/utils';
import { validateInputs } from './actions/helper/inputs';
import * as runCli from './actions/helper/run_cli';
import { FRAMEWORK_TYPES } from './constants';
import * as github from '@actions/github';


const apiKey: string = core.getInput('api_key', { required: true });
const githubToken: string = core.getInput('github_token', {required: false});
const testFramework: string = core.getInput('test_framework', { required: false });
const testPath: string[] = core.getMultilineInput('test_path', { required: false });
const coverageFramework: string = core.getInput('coverage_framework', { required: false });
const coveragePath: string[] = core.getMultilineInput('coverage_path', { required: false });
const actionDisabled: boolean = core.getBooleanInput('disable_action', { required: false });
const cliVersion: string = core.getInput('cli_version', {required: false});

validateInputs(testFramework, testPath, coverageFramework, coveragePath, actionDisabled);
const octokit = github.getOctokit(githubToken)

async function run(): Promise<void> {
  try {
    logger.info("Start gettin job info...");
    const jobInfo = await getJobInfo(octokit);
    logger.info(`jobInfo: ${jobInfo.id}, ${jobInfo.name}`);
    if (!jobInfo.id || !jobInfo.name) {
      logger.notice("Workflow job information couldn't retrieved! Foresight test kit exit!")
      utils.exitProcessSuccessfully();
    }
    await setJobInfoEnvVar(jobInfo);
    logger.info(`Env vars set!`);
    utils.installationCommandOfCli(cliVersion);
    if(testFramework && testPath.length > 0) {
      try {
        let command = await runCli.generateCommand(apiKey, FRAMEWORK_TYPES.TEST, testFramework, testPath);
        await runCli.runCommand(command);
      } catch(error) {
        logger.error("Test results couldn't retrieved!");
        if (error instanceof Error) core.setFailed(error.message)
      }
    }
    if (coverageFramework && coveragePath.length > 0) {
      try {
        let command = await runCli.generateCommand(apiKey, FRAMEWORK_TYPES.COVERAGE, coverageFramework, coveragePath);
        await runCli.runCommand(command);
      } catch(error) {
        logger.error("Coverage results couldn't retrieved!");
        if (error instanceof Error) core.setFailed(error.message)
      }
    }
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()