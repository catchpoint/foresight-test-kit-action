import {expect, jest} from '@jest/globals'
import * as utils from '../src/actions/utils'

describe('Utils', () => {
    it('tests for generating cli installation command with latest', async () => {
        const command = await utils.installationCommandOfCli('latest')
        expect(command).toEqual(`npm install -g @thundra/foresight-cli@latest`)
    })

    it('tests for generating cli installation command with version', async () => {
        const command = await utils.installationCommandOfCli('0.0.5')
        expect(command).toEqual(`npm install -g @thundra/foresight-cli@0.0.5`)
    })
})
