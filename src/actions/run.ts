import * as exec from '@actions/exec'
import * as logger from './logger'
import {exitProcessSuccessfully, getForesightCliPrefix} from './utils'
import {FRAMEWORK_TYPES} from '../constants'

export interface RunCommandOptions {
    args?: string[]
    envVariables?: {}
    workingDirectory?: string
}

export async function runCommand(
    command: string,
    options?: RunCommandOptions
): Promise<number> {
    return exec.exec(command, options?.args, {
        cwd: options?.workingDirectory,
        env: {
            ...process.env,
            ...options?.envVariables
        }
    })
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export async function generateCliCommand(
    apiKey: string,
    frameworkType: string,
    paths: string[],
    framework: string,
    format: string | undefined,
    tags?: string[]
) {
    const prefix: string = getForesightCliPrefix()
    let command = `${prefix}/node_modules/@runforesight/foresight-cli/dist/index.js upload-${frameworkType.toLowerCase()} -a ${apiKey}`
    switch (frameworkType.toLowerCase()) {
        case FRAMEWORK_TYPES.TEST:
            command += ` --framework=${framework.toUpperCase()}`
            if (format) {
                command += ` --format=${format.toUpperCase()}`
            }
            break
        case FRAMEWORK_TYPES.COVERAGE:
            if (format) {
                command += ` --format=${format.toUpperCase()}`
            } else {
                logger.warning('Coverage format should be given!!!')
                exitProcessSuccessfully()
            }
            break
        default:
            break
    }
    for (const path of paths) {
        command += ` --uploadDir=${path}`
    }
    for (const tag of tags || []) {
        command += ` --tag=${tag}`
    }
    return command
}
