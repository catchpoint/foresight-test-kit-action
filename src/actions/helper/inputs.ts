import { COVERAGE_FRAMEWORKS, TEST_FRAMEWORKS } from '../../constants';
import * as logger from './logger';
import { exitProcessSuccessfully } from './utils';

export function validateInputs(testFramework: string, testPath: string[], 
    coverageFramework: string, coveragePath: string[], actionDisabled: boolean) {
    if(!actionDisabled) {
        logger.notice("Action is disabled! Please enable to see ultimate test and coverage analyze results :)");
        exitProcessSuccessfully();
    }
    if(!testFramework && testPath.length === 0 && !coverageFramework && coveragePath.length === 0) {
        logger.warning("Neither test nor coverage information entered");
        exitProcessSuccessfully();
    }
    if((!testFramework && testPath.length > 0) || 
        (testFramework && testPath.length === 0)
    ) {
        logger.warning("Please check action inputs for test framework and path!");
        exitProcessSuccessfully();
    }
    if((!coverageFramework && coveragePath.length > 0) ||
        (coverageFramework && coveragePath.length === 0)
    ) {
        logger.warning("Please check action inputs for coverage framework and path!");
        exitProcessSuccessfully();
    }
    if (testFramework && TEST_FRAMEWORKS[testFramework.toUpperCase() as keyof typeof TEST_FRAMEWORKS] === undefined) {
        logger.warning("Given test framework is not supported for now :(");
        exitProcessSuccessfully();
    }
    if (coverageFramework && COVERAGE_FRAMEWORKS[coverageFramework.toUpperCase() as keyof typeof COVERAGE_FRAMEWORKS] === undefined) {
        logger.warning("Given coverage framework is not supported for now :(");
        exitProcessSuccessfully();
    }
}