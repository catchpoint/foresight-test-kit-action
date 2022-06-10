import * as core from '@actions/core';

export function exitProcessSuccessfully() {
    process.exit(core.ExitCode.Success)
}