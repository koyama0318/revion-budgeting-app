import { beforeEach, describe, expect, test } from 'bun:test'
import { FakeHandler, zeroId } from 'revion'
import { category } from '../features/category/category-aggregate'
import { categoryQuerySource } from '../features/category/category-query-resolver'
import { categoryReactor } from '../features/category/category-reactor'
import type { CategoryCommand } from '../features/category/types'

const handler = new FakeHandler({
  aggregates: [category],
  reactors: [categoryReactor],
  querySources: [categoryQuerySource]
})

describe('[integration] category api', () => {
  beforeEach(() => handler.reset())

  test('should create and edit category, then query results', async () => {
    // Arrange
    const categoryId = zeroId('category')
    const commands: CategoryCommand[] = [
      { type: 'addCategory', id: categoryId, payload: { name: 'category1' } },
      { type: 'editCategory', id: categoryId, payload: { name: 'category2' } }
    ]

    // Act
    await handler.commandMany(commands)

    const res1 = await handler.query({
      type: 'categories',
      sourceType: 'category',
      payload: { range: { limit: 10, offset: 0 } }
    })
    const res2 = await handler.query({
      type: 'category',
      sourceType: 'category',
      payload: { id: categoryId.value }
    })

    // Assert
    expect(res1.ok).toBe(true)
    if (res1.ok) {
      expect(res1.value.data).toEqual({
        type: 'categories',
        items: [
          {
            type: 'category',
            id: categoryId.value,
            name: 'category2',
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
            deletedAt: undefined
          }
        ],
        total: 1
      })
    }

    expect(res2.ok).toBe(true)
    if (res2.ok) {
      expect(res2.value.data).toEqual({
        type: 'category',
        item: {
          type: 'category',
          id: categoryId.value,
          name: 'category2',
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          deletedAt: undefined
        }
      })
    }
  })
})
