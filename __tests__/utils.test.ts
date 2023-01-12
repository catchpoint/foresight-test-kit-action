import {expect, jest} from '@jest/globals'
import * as utils from '../src/actions/utils'
import * as fs from 'fs'

describe('Utils', () => {
    it('tests for generating cli installation command with latest', async () => {
        const command = await utils.installationCommandOfCli('latest')
        const prefix: string = utils.getForesightCliPrefix()
        expect(command).toEqual(
            `npm install @runforesight/foresight-cli@latest --prefix ${prefix} ${prefix} --no-save`
        )
    })

    it('tests for generating cli installation command with version', async () => {
        const prefix: string = utils.getForesightCliPrefix()
        const command = await utils.installationCommandOfCli('0.0.5')
        expect(command).toEqual(
            `npm install @runforesight/foresight-cli@0.0.5 --prefix ${prefix} ${prefix} --no-save`
        )
    })

    it('tests for generating foresight cli folder command', async () => {
        const prefix: string = utils.getForesightCliPrefix()
        utils.createForesightCliFolder()
        expect(true).toEqual(fs.existsSync(prefix))
    })
})
