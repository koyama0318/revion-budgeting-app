export type ExpenseReadModel = {
  type: 'expense'
  id: string
  amount: number
  date: string
  categoryId: string
  memo?: string
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date
}
