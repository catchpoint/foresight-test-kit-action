/* eslint-disable @typescript-eslint/explicit-function-return-type */
import * as core from '@actions/core'

export function exitProcessSuccessfully() {
    process.exit(core.ExitCode.Success)
}

export function installationCommandOfCli(version: string) {
    return `mkdir ${process.cwd}/foresight-cli && npm install @runforesight/foresight-cli@${version} --prefix ${process.cwd}/foresight-cli --no-save`
}
