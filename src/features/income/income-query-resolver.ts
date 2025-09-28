import type { QueryResolver } from 'revion'
import { createQuerySource } from 'revion'
import type { IncomeQuery, IncomeQueryResult } from './types'

const resolver: QueryResolver<IncomeQuery, IncomeQueryResult> = {
  incomes: async ({ query, store }) => {
    const list = await store.findMany('income', { range: query.payload.range })
    const total = await store.findMany('income', {})

    return { type: 'incomes', items: list, total: total.length }
  },
  income: async ({ query, store }) => {
    const income = await store.findById('income', query.payload.id)
    if (!income) {
      throw new Error(`Category with id ${query.payload.id} not found`)
    }

    return { type: 'income', item: income }
  }
}

export const incomeQuerySource = createQuerySource<IncomeQuery, IncomeQueryResult>()
  .type('income')
  .resolver(resolver)
  .build()
