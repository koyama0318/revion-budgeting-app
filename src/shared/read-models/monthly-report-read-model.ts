export type MonthlyReportReadModel = {
  type: 'monthlyReport'
  id: string
  month: string
  totalIncome: number
  totalExpense: number
  createdAt: Date
  updatedAt: Date
}
