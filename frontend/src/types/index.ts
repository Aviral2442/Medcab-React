import React from 'react'
import type { ChartConfiguration } from 'chart.js'

export type ChildrenType = Readonly<{ children: React.ReactNode }>

export type ChartJSOptionsType = { data: ChartConfiguration['data']; options?: ChartConfiguration['options'] }

export type TableType<T> = {
  headers: string[]
  body: T[]
}

export type FileType = File & {
  path?: string
  preview?: string
  formattedSize?: string
}
