import {expect, jest} from '@jest/globals'
import * as run from '../src/actions/run'
import * as exec from '@actions/exec'
import {FRAMEWORK_TYPES} from '../src/constants'

describe('Generate Cli Commands', () => {
    it('tests for generating upload test command', async () => {
        const command = await run.generateCliCommand(
            'api_key',
            FRAMEWORK_TYPES.TEST,
            ['./reports', './target'],
            'pytest',
            'junit'
        )
        expect(command).toEqual(
            `foresight-cli upload-${FRAMEWORK_TYPES.TEST} -a api_key --framework=PYTEST --format=JUNIT --uploadDir=./reports --uploadDir=./target`
        )
    })

    it('tests for generating upload coverage command', async () => {
        const command = await run.generateCliCommand(
            'api_key',
            FRAMEWORK_TYPES.COVERAGE,
            ['./reports', './targets/**'],
            '',
            'JACOCO/XML'
        )
        expect(command).toEqual(
            `foresight-cli upload-${FRAMEWORK_TYPES.COVERAGE} -a api_key --format=JACOCO/XML --uploadDir=./reports --uploadDir=./targets/**`
        )
    })

    it('test run command', async () => {
        const mockExec = jest
            .spyOn(exec, 'exec')
            .mockImplementation(
                (
                    commandLine: string,
                    args?: string[] | undefined,
                    options?: exec.ExecOptions | undefined
                ): any => {
                    return {commandLine, args, options}
                }
            )
        const data: any = await run.runCommand('test_command')
        expect(data.commandLine).toEqual('test_command')
        expect(data.options.cwd).toEqual(undefined)
        expect(data.options).not.toBeNull()
    })

    it('test run command with working_directory', async () => {
        const mockExec = jest
            .spyOn(exec, 'exec')
            .mockImplementation(
                (
                    commandLine: string,
                    args?: string[] | undefined,
                    options?: exec.ExecOptions | undefined
                ): any => {
                    return {commandLine, args, options}
                }
            )
        const options: run.RunCommandOptions = {
            workingDirectory: '.'
        }
        const data: any = await run.runCommand('test_command', options)
        expect(data.commandLine).toEqual('test_command')
        expect(data.options.cwd).toEqual('.')
        expect(data.options).not.toBeNull()
    })
})
