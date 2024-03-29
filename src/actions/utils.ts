/* eslint-disable @typescript-eslint/explicit-function-return-type */
import * as core from '@actions/core'
import * as fs from 'fs'
import * as path from 'path'

export function exitProcessSuccessfully() {
    process.exit(core.ExitCode.Success)
}

export function installationCommandOfCli(version: string, tag?: string) {
    const prefix: string = getForesightCliPrefix()
    if (tag) {
        // We use `npm install <package-name> --tag <tag>` style instead of `npm install <package-name>@<tag>`.
        // Because, tag name may contain characters which are not supported
        // in the `npm install <package-name>@<tag>` style.
        return `npm install @runforesight/foresight-cli --tag ${tag} --prefix ${prefix} --no-save`
    } else {
        return `npm install @runforesight/foresight-cli@${version} --prefix ${prefix} --no-save`
    }
}

export function createForesightCliFolder() {
    const prefix: string = getForesightCliPrefix()
    if (!fs.existsSync(prefix)) {
        fs.mkdirSync(prefix)
    }
}

export function getForesightCliPrefix() {
    return path.join(process.cwd(), 'foresight-cli')
}

export function getScriptFullPath() {
    return path.join(
        process.cwd(),
        'foresight-cli',
        'node_modules',
        '@runforesight',
        'foresight-cli',
        'dist',
        'index.js'
    )
}
