import type { MonthlyReportReadModel } from '../../../shared/read-models'

export type MonthlyReportQuery =
  | {
      type: 'monthlyReports'
      sourceType: 'monthlyReport'
      payload: { range: { limit: number; offset: number } }
    }
  | {
      type: 'monthlyReport'
      sourceType: 'monthlyReport'
      payload: { month: string }
    }

export type MonthlyReportQueryResult =
  | {
      type: 'monthlyReports'
      items: MonthlyReportReadModel[]
      total: number
    }
  | {
      type: 'monthlyReport'
      item: MonthlyReportReadModel
    }
