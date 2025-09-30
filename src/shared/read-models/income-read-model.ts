import type { CategoryId } from '../../features/category/types'

export type IncomeReadModel = {
  type: 'income'
  id: string
  amount: number
  date: Date
  categoryId: CategoryId
  memo?: string
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date
}
