export interface JobInfo {
    readonly id?: number
    readonly name?: string
    readonly notAccesible?: boolean | false
}

export interface ApiKeyInfo {
    readonly apiKey?: string | undefined
}

export interface OnDemandAPIKeyParam {
    readonly repoFullName: string | undefined
    readonly workflowRunId: number | undefined
}
