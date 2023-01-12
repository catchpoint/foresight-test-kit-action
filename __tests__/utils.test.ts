import {expect, jest} from '@jest/globals'
import * as utils from '../src/actions/utils'

describe('Utils', () => {
    it('tests for generating cli installation command with latest', async () => {
        const command = await utils.installationCommandOfCli('latest')
        expect(command).toEqual(
            `mkdir ${process.cwd}/foresight-cli && npm install @runforesight/foresight-cli@latest --prefix ${process.cwd}/foresight-cli --no-save`
        )
    })

    it('tests for generating cli installation command with version', async () => {
        const command = await utils.installationCommandOfCli('0.0.5')
        expect(command).toEqual(
            `mkdir ${process.cwd}/foresight-cli && npm install @runforesight/foresight-cli@0.0.5 --prefix ${process.cwd}/foresight-cli --no-save`
        )
    })
})
