import { describe, expect, test } from 'bun:test'
import { aggregateFixture, zeroId } from 'revion'
import { expense } from './expense-aggregate'
import type { ExpenseCommand, ExpenseEvent, ExpenseState } from './types/command'

describe('[features] expense aggregate', () => {
  const expenseId = zeroId('expense')
  const date = new Date('2021-01-01')

  describe('add expense command', () => {
    test('handles add command and creates expense', () => {
      const categoryId = zeroId('category')

      aggregateFixture<ExpenseState, ExpenseCommand, ExpenseEvent>(expense)
        .when({
          type: 'addExpense',
          id: expenseId,
          payload: {
            amount: 100,
            date: date,
            categoryId,
            memo: 'memo'
          }
        })
        .then(fixture => {
          fixture.assert(ctx => {
            expect(ctx.error).toBeNull()

            expect(ctx.state.before.type).toBeUndefined()
            expect(ctx.state.after.type).toBe('recorded')
            if (ctx.state.after.type === 'recorded') {
              expect(ctx.state.after.amount).toBe(100)
              expect(ctx.state.after.date).toEqual(date)
              expect(ctx.state.after.categoryId).toEqual(categoryId)
              expect(ctx.state.after.memo).toBe('memo')
              expect(ctx.state.after.version).toBe(1)
            }

            expect(ctx.events.all.length).toBe(1)
            expect(ctx.events.all[0]?.type).toBe('expenseAdded')

            expect(ctx.version.diff).toBe(1)
            expect(ctx.version.latest).toBe(1)
          })
        })
    })
  })

  describe('edit expense command', () => {
    test('handles edit command and edit expense', () => {
      const categoryId1 = zeroId('category')
      const categoryId2 = zeroId('category')

      aggregateFixture<ExpenseState, ExpenseCommand, ExpenseEvent>(expense)
        .given({
          type: 'expenseAdded',
          id: expenseId,
          payload: {
            amount: 100,
            date: date,
            categoryId: categoryId1,
            memo: 'memo'
          }
        })
        .when({
          type: 'editExpense',
          id: expenseId,
          payload: {
            categoryId: categoryId2,
            memo: 'memo2'
          }
        })
        .then(fixture => {
          fixture.assert(ctx => {
            expect(ctx.error).toBeNull()

            expect(ctx.state.before.type).toBe('recorded')
            expect(ctx.state.after.type).toBe('recorded')
            if (ctx.state.after.type === 'recorded') {
              expect(ctx.state.after.categoryId).toEqual(categoryId2)
              expect(ctx.state.after.memo).toBe('memo2')
            }

            expect(ctx.events.all.length).toBe(2)
            expect(ctx.events.all[0]?.type).toBe('expenseAdded')
            expect(ctx.events.all[1]?.type).toBe('expenseEdited')

            expect(ctx.version.diff).toBe(1)
            expect(ctx.version.latest).toBe(2)
          })
        })
    })
  })

  describe('delete expense command', () => {
    test('handles delete command and delete expense', () => {
      const categoryId = zeroId('category')

      aggregateFixture<ExpenseState, ExpenseCommand, ExpenseEvent>(expense)
        .given({
          type: 'expenseAdded',
          id: expenseId,
          payload: {
            amount: 100,
            date: new Date(),
            categoryId,
            memo: 'memo'
          }
        })
        .when({
          type: 'deleteExpense',
          id: expenseId
        })
        .then(fixture => {
          fixture.assert(ctx => {
            expect(ctx.error).toBeNull()

            expect(ctx.state.before.type).toBe('recorded')
            expect(ctx.state.after.type).toBe('deleted')

            expect(ctx.events.all.length).toBe(2)
            expect(ctx.events.all[0]?.type).toBe('expenseAdded')
            expect(ctx.events.all[1]?.type).toBe('expenseDeleted')

            expect(ctx.version.diff).toBe(1)
            expect(ctx.version.latest).toBe(2)
          })
        })
    })
  })
})
