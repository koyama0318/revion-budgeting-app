import { describe, expect, test } from 'bun:test'
import { reactorFixture, zeroId } from 'revion'
import type { CategoryReadModel } from '../../shared/read-models/category-read-model'
import { categoryReactor } from './category-reactor'

describe('[features] category reactor', () => {
  const categoryId = zeroId('category')

  describe('add category event received', () => {
    test('handles add event and creates categoryReadModel', () => {
      const now = new Date()

      reactorFixture(categoryReactor)
        .when({
          type: 'categoryAdded',
          id: categoryId,
          payload: { name: 'category1' },
          version: 1,
          timestamp: now
        })
        .then(fixture => {
          fixture.assert(ctx => {
            expect(ctx.readModel.after.category).toBeDefined()

            if (ctx.readModel.after.category) {
              const category = ctx.readModel.after.category[categoryId.value] as CategoryReadModel
              expect(category).toBeDefined()
              expect(category.name).toBe('category1')
              expect(category.createdAt).toBe(now)
              expect(category.updatedAt).toBe(now)
            }
          })
        })
    })
  })

  describe('edit category event received', () => {
    test('handles edit event and updates categoryReadModel', () => {
      const now = new Date()
      const updatedAt = new Date()

      reactorFixture(categoryReactor)
        .given({
          type: 'category',
          id: categoryId.value,
          name: 'category1',
          createdAt: now,
          updatedAt: now,
          deletedAt: undefined
        })
        .when({
          type: 'categoryEdited',
          id: categoryId,
          payload: { name: 'category2' },
          version: 2,
          timestamp: updatedAt
        })
        .then(fixture => {
          fixture.assert(ctx => {
            expect(ctx.readModel.after.category).toBeDefined()

            if (ctx.readModel.after.category) {
              const category = ctx.readModel.after.category[categoryId.value] as CategoryReadModel
              expect(category).toBeDefined()
              expect(category.name).toBe('category2')
              expect(category.updatedAt).toBe(updatedAt)
            }
          })
        })
    })
  })

  describe('delete category event received', () => {
    test('handles delete event and updates categoryReadModel', () => {
      const now = new Date()
      const deletedAt = new Date()

      reactorFixture(categoryReactor)
        .given({
          type: 'category',
          id: categoryId.value,
          name: 'category1',
          createdAt: now,
          updatedAt: now,
          deletedAt: undefined
        })
        .when({
          type: 'categoryDeleted',
          id: categoryId,
          version: 2,
          timestamp: deletedAt
        })
        .then(fixture => {
          fixture.assert(ctx => {
            expect(ctx.readModel.after.category).toBeDefined()

            if (ctx.readModel.after.category) {
              const category = ctx.readModel.after.category[categoryId.value] as CategoryReadModel
              expect(category).toBeDefined()
              expect(category.name).toBe('category1')
              expect(category.updatedAt).toBe(deletedAt)
              expect(category.deletedAt).toBe(deletedAt)
            }
          })
        })
    })
  })
})
