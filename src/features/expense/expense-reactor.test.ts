import { describe, expect, test } from 'bun:test'
import { reactorFixture, zeroId } from 'revion'
import type { ExpenseReadModel } from '../../shared/read-models'
import { expenseReactor } from './expense-reactor'

describe('[features] expense reactor', () => {
  const expenseId = zeroId('expense')

  describe('add expense event received', () => {
    test('handles add event and creates expenseReadModel', () => {
      const now = new Date()

      reactorFixture(expenseReactor)
        .when({
          type: 'expenseAdded',
          id: expenseId,
          payload: { amount: 100, date: '2021-01-01', categoryId: '1', memo: 'memo' },
          version: 1,
          timestamp: now
        })
        .then(fixture => {
          fixture.assert(ctx => {
            expect(ctx.readModel.after.expense).toBeDefined()

            if (ctx.readModel.after.expense) {
              const expense = ctx.readModel.after.expense[expenseId.value] as ExpenseReadModel
              expect(expense).toBeDefined()
              expect(expense.amount).toBe(100)
              expect(expense.date).toBe('2021-01-01')
              expect(expense.categoryId).toBe('1')
              expect(expense.memo).toBe('memo')
              expect(expense.createdAt).toBe(now)
              expect(expense.updatedAt).toBe(now)
            }
          })
        })
    })
  })

  describe('edit expense event received', () => {
    test('handles edit event and updates expenseReadModel', () => {
      const now = new Date()
      const updatedAt = new Date()

      reactorFixture(expenseReactor)
        .given({
          type: 'expense',
          id: expenseId.value,
          amount: 100,
          date: '2021-01-01',
          categoryId: '1',
          memo: 'memo',
          createdAt: now,
          updatedAt: now,
          deletedAt: undefined
        })
        .when({
          type: 'expenseEdited',
          id: expenseId,
          payload: { categoryId: '2', memo: 'memo2' },
          version: 2,
          timestamp: updatedAt
        })
        .then(fixture => {
          fixture.assert(ctx => {
            expect(ctx.readModel.after.expense).toBeDefined()

            if (ctx.readModel.after.expense) {
              const expense = ctx.readModel.after.expense[expenseId.value] as ExpenseReadModel
              expect(expense).toBeDefined()
              expect(expense.categoryId).toBe('2')
              expect(expense.memo).toBe('memo2')
              expect(expense.updatedAt).toBe(updatedAt)
            }
          })
        })
    })
  })

  describe('delete expense event received', () => {
    test('handles delete event and updates expenseReadModel', () => {
      const now = new Date()
      const deletedAt = new Date()

      reactorFixture(expenseReactor)
        .given({
          type: 'expense',
          id: expenseId.value,
          amount: 100,
          date: '2021-01-01',
          categoryId: '1',
          memo: 'memo',
          createdAt: now,
          updatedAt: now,
          deletedAt: undefined
        })
        .when({
          type: 'expenseDeleted',
          id: expenseId,
          version: 2,
          timestamp: deletedAt
        })
        .then(fixture => {
          fixture.assert(ctx => {
            expect(ctx.readModel.after.expense).toBeDefined()

            if (ctx.readModel.after.expense) {
              const expense = ctx.readModel.after.expense[expenseId.value] as ExpenseReadModel
              expect(expense).toBeDefined()
              expect(expense.amount).toBe(100)
              expect(expense.date).toBe('2021-01-01')
              expect(expense.categoryId).toBe('1')
              expect(expense.memo).toBe('memo')
              expect(expense.updatedAt).toBe(deletedAt)
              expect(expense.deletedAt).toBe(deletedAt)
            }
          })
        })
    })
  })
})
