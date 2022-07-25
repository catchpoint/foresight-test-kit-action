/* eslint-disable @typescript-eslint/explicit-function-return-type */
import * as core from '@actions/core'

export function exitProcessSuccessfully() {
    process.exit(core.ExitCode.Success)
}

export function installationCommandOfCli(version: string) {
    return `npm install -g @runforesight/foresight-cli@${version}`
}
