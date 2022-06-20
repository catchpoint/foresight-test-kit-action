import * as exec from '@actions/exec'

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
    framework: string,
    paths: string[]
) {
    let command = `thundra-foresight-cli upload-${frameworkType.toLowerCase()} -a ${apiKey} -f ${framework.toUpperCase()}`
    for (const path of paths) {
        command += ` --uploadDir=${path}`
    }
    return command
}
