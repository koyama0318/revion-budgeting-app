import { describe, expect, test } from 'bun:test'
import { reactorFixture, zeroId } from 'revion'
import type { ExpenseReadModel, MonthlyReportReadModel } from '../../shared/read-models'
import { expenseReactor } from './expense-reactor'

describe('[features] expense reactor', () => {
  const expenseId = zeroId('expense')

  describe('add expense event received', () => {
    test('handles add event and creates expenseReadModel', () => {
      const date = new Date('2021-01-01')
      const createdAt = new Date()

      reactorFixture(expenseReactor)
        .when({
          type: 'expenseAdded',
          id: expenseId,
          payload: { amount: 100, date: date, categoryId: '1', memo: 'memo' },
          version: 1,
          timestamp: createdAt
        })
        .then(fixture => {
          fixture.assert(ctx => {
            expect(ctx.readModel.after.expense).toBeDefined()
            expect(ctx.readModel.after.monthlyReport).toBeDefined()

            if (ctx.readModel.after.expense) {
              const expense = ctx.readModel.after.expense[expenseId.value] as ExpenseReadModel
              expect(expense.amount).toBe(100)
              expect(expense.date).toEqual(date)
              expect(expense.categoryId).toBe('1')
              expect(expense.memo).toBe('memo')
              expect(expense.createdAt).toEqual(createdAt)
              expect(expense.updatedAt).toEqual(createdAt)
            }

            if (ctx.readModel.after.monthlyReport) {
              const key = Object.keys(ctx.readModel.after.monthlyReport)[0] ?? ''
              const report = ctx.readModel.after.monthlyReport[key] as MonthlyReportReadModel
              expect(report.month).toBe('2021-1')
              expect(report.totalIncome).toBe(0)
              expect(report.totalExpense).toBe(100)
              expect(report.createdAt).toEqual(createdAt)
              expect(report.updatedAt).toEqual(createdAt)
            }
          })
        })
    })
  })

  describe('edit expense event received', () => {
    test('handles edit event and updates expenseReadModel', () => {
      const date = new Date('2021-01-01')
      const createdAt = new Date('2021-02-01')
      const updatedAt = new Date('2021-03-01')

      reactorFixture(expenseReactor)
        .given({
          type: 'expense',
          id: expenseId.value,
          amount: 100,
          date: date,
          categoryId: '1',
          memo: 'memo',
          createdAt: createdAt,
          updatedAt: updatedAt,
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
              expect(expense.createdAt).toEqual(createdAt)
              expect(expense.updatedAt).toEqual(updatedAt)
            }
          })
        })
    })
  })

  describe('delete expense event received', () => {
    test('handles delete event and updates expenseReadModel', () => {
      const date = new Date('2021-01-01')
      const createdAt = new Date('2021-02-01')
      const deletedAt = new Date('2021-03-01')

      reactorFixture(expenseReactor)
        .given({
          type: 'expense',
          id: expenseId.value,
          amount: 100,
          date: date,
          categoryId: '1',
          memo: 'memo',
          createdAt: createdAt,
          updatedAt: createdAt,
          deletedAt: undefined
        })
        .given({
          type: 'monthlyReport',
          id: zeroId('monthlyReport').value,
          month: '2021-1',
          totalIncome: 0,
          totalExpense: 100,
          createdAt: createdAt,
          updatedAt: createdAt
        })
        .when({
          type: 'expenseDeleted',
          id: expenseId,
          payload: { date: date, categoryId: '1', amount: 100 },
          version: 2,
          timestamp: deletedAt
        })
        .then(fixture => {
          fixture.assert(ctx => {
            expect(ctx.readModel.after.expense).toBeDefined()
            expect(ctx.readModel.after.monthlyReport).toBeDefined()

            if (ctx.readModel.after.expense) {
              const expense = ctx.readModel.after.expense[expenseId.value] as ExpenseReadModel
              expect(expense).toBeDefined()
              expect(expense.amount).toBe(100)
              expect(expense.date).toEqual(date)
              expect(expense.categoryId).toBe('1')
              expect(expense.memo).toBe('memo')
              expect(expense.updatedAt).toEqual(deletedAt)
              expect(expense.deletedAt).toEqual(deletedAt)
            }

            if (ctx.readModel.after.monthlyReport) {
              const key = Object.keys(ctx.readModel.after.monthlyReport)[0] ?? ''
              const report = ctx.readModel.after.monthlyReport[key] as MonthlyReportReadModel
              expect(report.month).toBe('2021-1')
              expect(report.totalExpense).toBe(0)
              expect(report.totalExpense).toBe(0)
              expect(report.updatedAt).toEqual(deletedAt)
            }
          })
        })
    })
  })
})
