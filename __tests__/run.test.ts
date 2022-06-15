import {expect, jest} from '@jest/globals';
import * as run from '../src/actions/run';
import * as exec from '@actions/exec'

describe("Generate Cli Commands", () => {
    
    it('tests for generating upload test command', async () => {
        const command = await  run.generateCliCommand("api_key", "TEST", "pytest", ["./reports", "./target"]);
        expect(command).toEqual(`thundra-foresight-cli upload-test -a api_key -f PYTEST -ud ./reports -ud ./target`);
    });

    it('tests for generating upload coverage command', async () => {
        const command = await  run.generateCliCommand("api_key", "COVERAGE", "jacoco", ["./reports", "./targets/**"]);
        expect(command).toEqual(`thundra-foresight-cli upload-coverage -a api_key -f JACOCO -ud ./reports -ud ./targets/**`);
    });

    it('test run command', async () => {
        const mockExec = jest.spyOn(exec, 'exec')
        .mockImplementation((commandLine: string, args?: string[] | undefined, options?: exec.ExecOptions | undefined): any => { 
            return {commandLine, args, options};
        });
        const data: any = await run.runCommand("test_command");
        expect(data.commandLine).toEqual("test_command");
        expect(data.args.length).toEqual(0);
        expect(data.options).not.toBeNull();
    });
    
})