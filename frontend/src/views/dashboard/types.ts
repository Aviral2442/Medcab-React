export type SessionType = {
    id: string
    user: {
        name: string
        avatar: string
    }
    aiModel: string
    date: string
    tokens: number
    status: 'completed' | 'pending' | 'failed'
}

export type ModelUsageType = {
    model: string
    requests: number
    totalTokens: number
    averageTokens: number
    lastUsed: string
}

export type APIPerformanceMetricsType = {
    endpoint: string
    latency: string
    requests: string
    errorRate: number
    cost: number
}
