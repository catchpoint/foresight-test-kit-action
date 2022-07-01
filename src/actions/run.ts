import * as exec from '@actions/exec'
import * as logger from './logger'
import {FRAMEWORK_TYPES} from '../constants'
import {exitProcessSuccessfully} from './utils'

export async function runCommand(
    command: string,
    args: string[] = [],
    envVariables = {}
): Promise<number> {
    return exec.exec(command, args, {
        env: {
            ...process.env,
            ...envVariables
        }
    })
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export async function generateCliCommand(
    apiKey: string,
    frameworkType: string,
    paths: string[],
    framework: string,
    format: string | undefined
) {
    let command = `thundra-foresight-cli upload-${frameworkType.toLowerCase()} -a ${apiKey}`
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
    return command
}
