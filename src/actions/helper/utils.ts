import * as core from '@actions/core';

export function exitProcessSuccessfully() {
    process.exit(core.ExitCode.Success)
}

export async function installationCommandOfCli(version: string) {
    return `npm install -g @thundra/foresight-cli@${version}`;
}