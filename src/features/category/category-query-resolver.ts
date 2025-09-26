import type { QueryResolver } from 'revion'
import { createQuerySource } from 'revion'
import type { CategoryQuery, CategoryQueryResult } from './types'

const resolver: QueryResolver<CategoryQuery, CategoryQueryResult> = {
  categories: async ({ query, store }) => {
    const list = await store.findMany('category', { range: query.payload.range })
    const total = await store.findMany('category', {})

    return { type: 'categories', items: list, total: total.length }
  },
  category: async ({ query, store }) => {
    const category = await store.findById('category', query.payload.id)
    if (!category) {
      throw new Error(`Category with id ${query.payload.id} not found`)
    }

    return { type: 'category', item: category }
  }
}

export const categoryQuerySource = createQuerySource<CategoryQuery, CategoryQueryResult>()
  .type('category')
  .resolver(resolver)
  .build()
