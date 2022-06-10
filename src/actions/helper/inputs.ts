import { COVERAGE_FRAMEWORKS, TEST_FRAMEWORKS } from '../../constants';
import * as logger from './logger';
import { exitProcessSuccessfully } from './utils';

export function validateInputs(test_framework: string, test_path: string[], 
    coverage_framework: string, coverage_path: string[], action_disabled: boolean) {
    if(!action_disabled) {
        logger.notice("Action is disabled! Please enable to see ultimate test and coverage analyze results :)");
        exitProcessSuccessfully();
    }
    if(!test_framework && test_path.length === 0 && !coverage_framework && coverage_path.length === 0) {
        logger.warning("Neither test nor coverage information entered");
        exitProcessSuccessfully();
    }
    if((!test_framework && test_path.length > 0) || 
        (test_framework && test_path.length === 0)
    ) {
        logger.warning("Please check action inputs for test framework and path!");
        exitProcessSuccessfully();
    }
    if((!coverage_framework && coverage_path.length > 0) ||
        (coverage_framework && coverage_path.length === 0)
    ) {
        logger.warning("Please check action inputs for coverage framework and path!");
        exitProcessSuccessfully();
    }
    if (test_framework && TEST_FRAMEWORKS[test_framework.toUpperCase() as keyof typeof TEST_FRAMEWORKS] === undefined) {
        logger.warning("Given test framework is not supported for now :(");
        exitProcessSuccessfully();
    }
    if (coverage_framework && COVERAGE_FRAMEWORKS[coverage_framework.toUpperCase() as keyof typeof COVERAGE_FRAMEWORKS] === undefined) {
        logger.warning("Given coverage framework is not supported for now :(");
        exitProcessSuccessfully();
    }
}