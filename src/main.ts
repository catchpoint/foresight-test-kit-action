import * as core from '@actions/core'
import * as github from '@actions/github'
import * as logger from './actions/logger'
import * as runCli from './actions/run'
import * as utils from './actions/utils'
import {getJobInfo, setJobInfoEnvVar} from './actions/job'
import {FRAMEWORK_TYPES} from './constants'
import {Octokit} from '@octokit/action'
import {validateInputs} from './actions/inputs'
import {RunCommandOptions} from './actions/run'
import {getApiKey} from './utils'

const testFramework: string = core.getInput('test_framework', {
    required: false
})
const testFormat: string = core.getInput('test_format', {
    required: false
})
const testPath: string[] = core.getMultilineInput('test_path', {
    required: false
})
const coverageFormat: string = core.getInput('coverage_format', {
    required: false
})
const coveragePath: string[] = core.getMultilineInput('coverage_path', {
    required: false
})
const actionDisabled: boolean = core.getBooleanInput('disable_action', {
    required: false
})
const cliVersion: string = core.getInput('cli_version', {required: false})

const workingDirectory: string = core.getInput('working_directory', {
    required: false
})

validateInputs(
    testFormat,
    testFramework,
    testPath,
    coverageFormat,
    coveragePath,
    actionDisabled
)
const octokit: Octokit = new Octokit()

async function run(): Promise<void> {
    try {
        logger.info('Start getting job info...')
        const jobInfo = await getJobInfo(octokit)
        if (!jobInfo) {
            logger.error(`Job info could not be obtained from github!`)
            return
        }
        logger.debug(`jobInfo: ${jobInfo.id}, ${jobInfo.name}`)
        const {repo, runId} = github.context
        const apiKeyInfo = await getApiKey(repo.owner, repo.repo, runId)
        if (apiKeyInfo == null || apiKeyInfo.apiKey == null) {
            logger.error(`ApiKey is not exists! Data can not be send.`)
            return
        }
        const apiKey: string = apiKeyInfo.apiKey
        await setJobInfoEnvVar(jobInfo)
        logger.info(`Env vars set!`)
        logger.debug(
            `FORESIGHT_WORKFLOW_JOB_ID: ${process.env.FORESIGHT_WORKFLOW_JOB_ID}`
        )
        logger.debug(
            `FORESIGHT_WORKFLOW_JOB_NAME: ${process.env.FORESIGHT_WORKFLOW_JOB_NAME}`
        )
        await runCli.runCommand(utils.installationCommandOfCli(cliVersion))
        const options: RunCommandOptions = {
            workingDirectory
        }
        if (testFramework && testPath.length > 0) {
            try {
                const command = await runCli.generateCliCommand(
                    apiKey,
                    FRAMEWORK_TYPES.TEST,
                    testPath,
                    testFramework,
                    testFormat
                )
                await runCli.runCommand(command, options)
            } catch (error) {
                logger.error("Test results couldn't retrieved!")
            }
        }
        if (coverageFormat && coveragePath.length > 0) {
            try {
                const command = await runCli.generateCliCommand(
                    apiKey,
                    FRAMEWORK_TYPES.COVERAGE,
                    coveragePath,
                    '',
                    coverageFormat
                )
                await runCli.runCommand(command, options)
            } catch (error) {
                logger.error("Coverage results couldn't retrieved!")
            }
        }
    } catch (error: any) {
        logger.error('Unexpected error occured: ' + error.message)
        logger.warning(
            `If error is related to permissions, please be sure that your workflow have actions:read permission!`
        )
    }
}

run()
