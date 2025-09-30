import type { CategoryId } from '../../features/category/types'

export type ExpenseReadModel = {
  type: 'expense'
  id: string
  amount: number
  date: Date
  categoryId: CategoryId
  memo?: string
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date
}
