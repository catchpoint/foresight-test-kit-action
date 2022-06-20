import * as logger from './logger'
import {exitProcessSuccessfully} from './utils'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function validateInputs(
    testFramework: string,
    testPath: string[],
    coverageFormat: string,
    coveragePath: string[],
    actionDisabled: boolean
) {
    if (actionDisabled) {
        logger.notice(
            'Action is disabled! Please enable to see ultimate test and coverage analyze results :)'
        )
        exitProcessSuccessfully()
    }
    if (
        !testFramework &&
        testPath.length === 0 &&
        !coverageFormat &&
        coveragePath.length === 0
    ) {
        logger.warning('Neither test nor coverage information entered')
        exitProcessSuccessfully()
    }
    if (
        (!testFramework && testPath.length > 0) ||
        (testFramework && testPath.length === 0)
    ) {
        logger.warning(
            'Please check action inputs for test framework and path!'
        )
        exitProcessSuccessfully()
    }
    if (
        (!coverageFormat && coveragePath.length > 0) ||
        (coverageFormat && coveragePath.length === 0)
    ) {
        logger.warning(
            'Please check action inputs for coverage framework and path!'
        )
        exitProcessSuccessfully()
    }
}
