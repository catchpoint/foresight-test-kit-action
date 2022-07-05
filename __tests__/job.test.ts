import * as path from 'path'
import {Octokit} from '@octokit/action'
import {expect, jest} from '@jest/globals'

describe('JOB INFO', () => {
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
})
