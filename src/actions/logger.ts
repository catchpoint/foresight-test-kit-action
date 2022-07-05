/* eslint-disable @typescript-eslint/explicit-function-return-type */
import * as core from '@actions/core'

const LOG_HEADER = '[Foresight Test Kit]'

export function debug(msg: string) {
    core.debug(`${LOG_HEADER} ${msg}`)
}

export function info(msg: string) {
    core.info(`${LOG_HEADER} ${msg}`)
}

export function warning(msg: string) {
    core.warning(`${LOG_HEADER} ${msg}`)
}

export function notice(msg: string) {
    core.notice(`${LOG_HEADER} ${msg}`)
}

export function error(msg: string | Error) {
    if (typeof msg === 'string' || msg instanceof String) {
        core.error(`${LOG_HEADER} ${msg}`)
    } else {
        core.error(`${LOG_HEADER} ${msg.message}`)
    }
}
