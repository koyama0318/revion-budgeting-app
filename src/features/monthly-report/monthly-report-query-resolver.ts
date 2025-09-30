import type { QueryOption, QueryResolver } from 'revion'
import { createQuerySource } from 'revion'
import type { MonthlyReportReadModel } from '../../shared/read-models'
import type { MonthlyReportQuery, MonthlyReportQueryResult } from './types'

const resolver: QueryResolver<MonthlyReportQuery, MonthlyReportQueryResult> = {
  monthlyReports: async ({ query, store }) => {
    const list = await store.findMany('monthlyReports', { range: query.payload.range })
    const total = await store.findMany('monthlyReports', {})

    return { type: 'monthlyReports', items: list, total: total.length }
  },
  monthlyReport: async ({ query, store }) => {
    const options: QueryOption<MonthlyReportReadModel> = {
      filter: [{ by: 'month', operator: 'eq', value: query.payload.month }]
    }
    const items = await store.findMany('monthlyReport', options as any)
    if (items.length !== 1) {
      throw new Error(`MonthlyReport with month ${query.payload.month} not found`)
    }

    return { type: 'monthlyReport', item: items[0] as unknown as MonthlyReportReadModel }
  }
}

export const monthlyReportQuerySource = createQuerySource<
  MonthlyReportQuery,
  MonthlyReportQueryResult
>()
  .type('monthlyReport')
  .resolver(resolver)
  .build()
