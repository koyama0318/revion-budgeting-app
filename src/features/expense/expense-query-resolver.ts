import type { QueryResolver } from 'revion'
import { createQuerySource } from 'revion'
import type { ExpenseQuery, ExpenseQueryResult } from './types'

const resolver: QueryResolver<ExpenseQuery, ExpenseQueryResult> = {
  expenses: async ({ query, store }) => {
    const list = await store.findMany('expense', { range: query.payload.range })
    const total = await store.findMany('expense', {})

    return { type: 'expenses', items: list, total: total.length }
  },
  expense: async ({ query, store }) => {
    const expense = await store.findById('expense', query.payload.id)
    if (!expense) {
      throw new Error(`Category with id ${query.payload.id} not found`)
    }

    return { type: 'expense', item: expense }
  }
}

export const expenseQuerySource = createQuerySource<ExpenseQuery, ExpenseQueryResult>()
  .type('expense')
  .resolver(resolver)
  .build()
