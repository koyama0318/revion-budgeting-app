export type IncomeReadModel = {
  type: 'income'
  id: string
  amount: number
  date: string
  categoryId: string
  memo?: string
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date
}
