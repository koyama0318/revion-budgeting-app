export type ExpenseReadModel = {
  type: 'expense'
  id: string
  amount: number
  date: Date
  categoryId: string
  memo?: string
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date
}
