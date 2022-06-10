import * as exec from '@actions/exec'

export async function runCommand(command: string, args: string[] = [], envVariables = {}): Promise<number> {
    return exec.exec(command, args, {
        env: {
            ...process.env,
            ...envVariables
        }
    })
}

export async function generateCommand(apiKey: string, frameworkType: string, framework: string, paths: string[]) {
    let command = `thundra-foresight-cli upload-${frameworkType} -a ${apiKey} -f ${framework}`;
    for(const path of paths) {
        command += ` -ud ${path}`
    }
    return command;
}