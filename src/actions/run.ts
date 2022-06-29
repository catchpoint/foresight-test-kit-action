import * as exec from '@actions/exec'
import {FRAMEWORK_TYPES} from '../constants'

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
    format: string,
    framework?: string | undefined
) {
    let command = `thundra-foresight-cli upload-${frameworkType.toLowerCase()} -a ${apiKey} --format ${format.toUpperCase()}`
    if (framework && frameworkType.toLowerCase() === FRAMEWORK_TYPES.TEST) {
        command += ` --framework ${framework.toUpperCase()}`
    }
    for (const path of paths) {
        command += ` --uploadDir=${path}`
    }
    return command
}
