import * as core from '@actions/core'
import * as logger from './actions/logger'
import * as runCli from './actions/run'
import * as utils from './actions/utils'
import {getJobInfo, setJobInfoEnvVar} from './actions/job'
import {FRAMEWORK_TYPES} from './constants'
import {Octokit} from '@octokit/action'
import {validateInputs} from './actions/inputs'

const apiKey: string = core.getInput('api_key', {required: true})
const testFramework: string = core.getInput('test_framework', {
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

validateInputs(
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
        logger.info(`jobInfo: ${jobInfo.id}, ${jobInfo.name}`)
        if (!jobInfo.id || !jobInfo.name) {
            logger.notice("Workflow job information couldn't retrieved!")
        }
        await setJobInfoEnvVar(jobInfo)
        logger.info(`Env vars set!`)
        logger.info(
            `FORESIGHT_WORKFLOW_JOB_ID: ${process.env.FORESIGHT_WORKFLOW_JOB_ID}`
        )
        logger.info(
            `FORESIGHT_WORKFLOW_JOB_NAME: ${process.env.FORESIGHT_WORKFLOW_JOB_NAME}`
        )
        await runCli.runCommand(
            await utils.installationCommandOfCli(cliVersion)
        )
        if (testFramework && testPath.length > 0) {
            try {
                const command = await runCli.generateCliCommand(
                    apiKey,
                    FRAMEWORK_TYPES.TEST,
                    testFramework,
                    testPath
                )
                await runCli.runCommand(command)
            } catch (error) {
                logger.error("Test results couldn't retrieved!")
                if (error instanceof Error) core.setFailed(error.message)
            }
        }
        if (coverageFormat && coveragePath.length > 0) {
            try {
                const command = await runCli.generateCliCommand(
                    apiKey,
                    FRAMEWORK_TYPES.COVERAGE,
                    coverageFormat,
                    coveragePath
                )
                await runCli.runCommand(command)
            } catch (error) {
                logger.error("Coverage results couldn't retrieved!")
                if (error instanceof Error) core.setFailed(error.message)
            }
        }
    } catch (error) {
        if (error instanceof Error) core.setFailed(error.message)
    }
}

run()
