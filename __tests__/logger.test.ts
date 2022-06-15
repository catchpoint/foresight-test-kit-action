import * as core from '@actions/core'
import * as logger from '../src/actions/logger'
import {expect, jest} from '@jest/globals'

const LOG_HEADER: string = '[Foresight Test Kit]'
describe('Logger', () => {
    it('tests for logger debug', async () => {
        const mockCoreDebug = jest
            .spyOn(core, 'debug')
            .mockImplementation((data: any) => {
                return data
            })
        logger.debug('test_debug')
        expect(mockCoreDebug).toHaveBeenCalledWith(
            LOG_HEADER + ' ' + 'test_debug'
        )
        mockCoreDebug.mockRestore()
    })

    it('tests for logger info', async () => {
        const mockCoreInfo = jest
            .spyOn(core, 'info')
            .mockImplementation((data: any) => {
                return data
            })
        logger.info('test_info')
        expect(mockCoreInfo).toHaveBeenCalledWith(
            LOG_HEADER + ' ' + 'test_info'
        )
        mockCoreInfo.mockRestore()
    })

    it('tests for logger warning', async () => {
        const mockCoreWarning = jest
            .spyOn(core, 'warning')
            .mockImplementation((data: any) => {
                return data
            })
        logger.warning('test_warning')
        expect(mockCoreWarning).toHaveBeenCalledWith(
            LOG_HEADER + ' ' + 'test_warning'
        )
        mockCoreWarning.mockRestore()
    })

    it('tests for logger notice', async () => {
        const mockCoreNotice = jest
            .spyOn(core, 'notice')
            .mockImplementation((data: any) => {
                return data
            })
        logger.notice('test_notice')
        expect(mockCoreNotice).toHaveBeenCalledWith(
            LOG_HEADER + ' ' + 'test_notice'
        )
        mockCoreNotice.mockRestore()
    })

    it('tests for logger error with string', async () => {
        const mockCoreError = jest
            .spyOn(core, 'error')
            .mockImplementation((data: any) => {
                return data
            })
        logger.error('test_error')
        expect(mockCoreError).toHaveBeenCalledWith(
            LOG_HEADER + ' ' + 'test_error'
        )
        mockCoreError.mockRestore()
    })

    it('tests for logger error with error object', async () => {
        const error = new Error('test_error')
        const mockCoreError = jest
            .spyOn(core, 'error')
            .mockImplementation((data: any) => {
                return data
            })
        logger.error(error)
        expect(mockCoreError).toHaveBeenCalledWith(
            LOG_HEADER + ' ' + 'test_error'
        )
        mockCoreError.mockRestore()
    })
})
