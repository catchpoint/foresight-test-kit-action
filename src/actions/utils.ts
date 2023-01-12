/* eslint-disable @typescript-eslint/explicit-function-return-type */
import * as core from '@actions/core'
import * as path from 'path'

export function exitProcessSuccessfully() {
    process.exit(core.ExitCode.Success)
}

export function installationCommandOfCli(version: string) {
    const prefix: string = getForesightCliPrefix()
    return `mkdir ${prefix} && npm install @runforesight/foresight-cli@${version} --prefix ${prefix} --no-save`
}

export function getForesightCliPrefix() {
    return path.join(process.cwd(), 'foresight-cli')
}
