import { describe, expect, test } from 'bun:test'
import { aggregateFixture, zeroId } from 'revion'
import { category } from './category-aggregate'

describe('[features] category aggregate', () => {
  const categoryId = zeroId('category')

  describe('add category command', () => {
    test('handles add command and creates category', () => {
      aggregateFixture(category)
        .when({
          type: 'addCategory',
          id: categoryId,
          name: 'category1'
        })
        .then(fixture => {
          fixture.assert(ctx => {
            expect(ctx.error).toBeNull()

            expect(ctx.state.before.type).toBeUndefined()
            expect(ctx.state.after.type).toBe('active')
            if (ctx.state.after.type === 'active') {
              expect(ctx.state.after.name).toBe('category1')
              expect(ctx.state.after.version).toBe(1)
            }

            expect(ctx.events.all.length).toBe(1)
            expect(ctx.events.all[0]?.type).toBe('categoryAdded')

            expect(ctx.version.diff).toBe(1)
            expect(ctx.version.latest).toBe(1)
          })
        })
    })
  })

  describe('edit category command', () => {
    test('handles edit command and edit category', () => {
      aggregateFixture(category)
        .given({
          type: 'categoryAdded',
          id: categoryId,
          payload: {
            name: 'category1'
          }
        })
        .when({
          type: 'editCategory',
          id: categoryId,
          name: 'category2'
        })
        .then(fixture => {
          fixture.assert(ctx => {
            expect(ctx.error).toBeNull()

            expect(ctx.state.before.type).toBe('active')
            expect(ctx.state.after.type).toBe('active')
            if (ctx.state.after.type === 'active') {
              expect(ctx.state.after.name).toBe('category2')
            }

            expect(ctx.events.all.length).toBe(2)
            expect(ctx.events.all[0]?.type).toBe('categoryAdded')
            expect(ctx.events.all[1]?.type).toBe('categoryEdited')

            expect(ctx.version.diff).toBe(1)
            expect(ctx.version.latest).toBe(2)
          })
        })
    })
  })

  describe('delete category command', () => {
    test('handles delete command and delete category', () => {
      aggregateFixture(category)
        .given({
          type: 'categoryAdded',
          id: categoryId,
          payload: { name: 'category' }
        })
        .whenMany([
          {
            type: 'deleteCategory',
            id: categoryId
          }
        ])
        .then(fixture => {
          fixture.assert(ctx => {
            expect(ctx.error).toBeNull()

            expect(ctx.state.before.type).toBe('active')
            expect(ctx.state.after.type).toBe('inactive')

            expect(ctx.events.all.length).toBe(2)
            expect(ctx.events.all[0]?.type).toBe('categoryAdded')
            expect(ctx.events.all[1]?.type).toBe('categoryDeleted')

            expect(ctx.version.diff).toBe(1)
            expect(ctx.version.latest).toBe(2)
          })
        })
    })
  })
})
