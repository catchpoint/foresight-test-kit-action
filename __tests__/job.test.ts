import {RequestError} from "@octokit/request-error";
import * as path from 'path'
import {Octokit} from '@octokit/action'
import {expect, jest} from '@jest/globals'
describe('JOB INFO', () => {
    afterEach(() => {
        process.env['FORESIGHT_WORKFLOW_JOB_ID'] = ''
        process.env['FORESIGHT_WORKFLOW_JOB_NAME'] = ''
        jest.clearAllMocks();
    });
    beforeAll(() => {
        process.env['GITHUB_EVENT_PATH'] = 'test_path'
        process.env['GITHUB_EVENT_NAME'] = 'test_event'
        process.env['GITHUB_SHA'] = 'test_sha'
        process.env['GITHUB_REF'] = 'test_ref'
        process.env['GITHUB_WORKFLOW'] = 'test_workflow'
        process.env['GITHUB_ACTION'] = 'test_action'
        process.env['GITHUB_ACTOR'] = 'test_actor'
        process.env['GITHUB_REPOSITORY'] = 'test_owner/test_repo'
        process.env['GITHUB_RUN_ID'] = '1234'
        process.env['GITHUB_TOKEN'] = 'test_token'
        process.env['RUNNER_NAME'] = 'Hosted Agent'
    })

    it('tests job info', async () => {
        const octokit = new Octokit()
        const jobInfo = require('../src/actions/job')
        const fs = require('fs')
        let rawdata = fs.readFileSync(
            path.join(__dirname, '/data/job_info_result.json')
        )
        let result = JSON.parse(rawdata)
        const mockListWorkflow = jest
            .spyOn(octokit.rest.actions, 'listJobsForWorkflowRun')
            .mockImplementation((data: any) => {
                return new Promise((resolve, reject) => {
                    resolve(result)
                })
            })
        const job = await jobInfo.getJobInfo(octokit)
        expect(job.id).toEqual(6855980738)
        expect(job.name).toEqual('build')
        jobInfo.setJobInfoEnvVar(job)
        expect(process.env.FORESIGHT_WORKFLOW_JOB_ID).toEqual('6855980738')
        expect(process.env.FORESIGHT_WORKFLOW_JOB_NAME).toEqual('build')
        mockListWorkflow.mockRestore()
    })

    it('test job info on github error 403', async () => {
        const octokit = new Octokit()
        const jobInfo = require('../src/actions/job')
        const fs = require('fs')
        let rawdata = fs.readFileSync(
            path.join(__dirname, '/data/job_info_result.json')
        )
        let result = JSON.parse(rawdata)
        const mockListWorkflow = jest
            .spyOn(octokit.rest.actions, 'listJobsForWorkflowRun')
            .mockImplementation((data: any) => {
                const error = new RequestError('', 403, {
                    request: { url: '', headers: {}, method: 'PATCH' },
                    response: { data: null, headers: {}, status: 403, url: '' }
                });
                throw error;
            })
        const job = await jobInfo.getJobInfo(octokit)
        expect(job.id).toEqual(undefined)
        expect(job.name).toEqual(undefined)
        jobInfo.setJobInfoEnvVar(job)
        expect(process.env.FORESIGHT_WORKFLOW_JOB_ID).toEqual('')
        expect(process.env.FORESIGHT_WORKFLOW_JOB_NAME).toEqual('')
        mockListWorkflow.mockRestore()
    })

    it('test job info on github error not 403', async () => {
        const octokit = new Octokit()
        const jobInfo = require('../src/actions/job')
        const fs = require('fs')
        let rawdata = fs.readFileSync(
            path.join(__dirname, '/data/job_info_result.json')
        )
        let result = JSON.parse(rawdata)
        const mockListWorkflow = jest
            .spyOn(octokit.rest.actions, 'listJobsForWorkflowRun')
            .mockImplementation((data: any) => {
                const error = new RequestError('', 404, {
                    request: { url: '', headers: {}, method: 'PATCH' },
                    response: { data: null, headers: {}, status: 404, url: '' }
                });
                throw error;
            })
        const job = await jobInfo.getJobInfo(octokit)
        expect(job).toEqual(undefined)
        mockListWorkflow.mockRestore()
    },15000)


})

