import * as logger from './actions/logger'
import {ApiKeyInfo, OnDemandAPIKeyParam} from './interfaces'
import * as core from '@actions/core'
import axios from 'axios'
import * as path from 'path'

const ON_DEMAND_API_KEY_BASE_URL = `${
    process.env['ON_DEMAND_API_KEY_BASE_URL'] ||
    'https://api-public.service.runforesight.com'
}`
export const ON_DEMAND_API_KEY_ENDPOINT = new URL(
    path.join('api', 'v1/apikey/ondemand'),
    ON_DEMAND_API_KEY_BASE_URL
).toString()

export async function getApiKey(
    owner: string,
    repoName: string,
    workflowRunId: number
): Promise<ApiKeyInfo | null> {
    const apiKey: string = core.getInput('api_key')
    if (apiKey) {
        logger.debug(`ApiKey: ${apiKey}`)
        return {apiKey: apiKey}
    } else {
        logger.debug(`ApiKey is not defined! Requesting on demand ApiKey`)
        const onDemandAPIKeyParam: OnDemandAPIKeyParam = {
            repoFullName: owner + '/' + repoName,
            workflowRunId: workflowRunId
        }
        const onDemandApiKey = await getOnDemandApiKey(onDemandAPIKeyParam)
        return onDemandApiKey != null ? onDemandApiKey : null
    }
}

async function getOnDemandApiKey(
    onDemandAPIKey: OnDemandAPIKeyParam
): Promise<ApiKeyInfo | null> {
    logger.debug(
        `Getting on demand api key from: ${ON_DEMAND_API_KEY_ENDPOINT}`
    )
    try {
        const {data} = await axios.post(
            ON_DEMAND_API_KEY_ENDPOINT,
            onDemandAPIKey,
            {
                headers: {
                    'Content-type': 'application/json; charset=utf-8'
                }
            }
        )
        logger.debug(`Data: ${data}`)
        return data
    } catch (error) {
        if (axios.isAxiosError(error)) {
            logger.error(error.message)
        } else {
            logger.error(`unexpected error: ${error}`)
        }
        return null
    }
}
