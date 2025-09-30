import { describe, expect, test } from 'bun:test'
import { reactorFixture, zeroId } from 'revion'
import type { IncomeReadModel, MonthlyReportReadModel } from '../../shared/read-models'
import { incomeReactor } from './income-reactor'

describe('[features] income reactor', () => {
  const incomeId = zeroId('income')

  describe('add income event received', () => {
    test('handles add event and creates incomeReadModel', () => {
      const date = new Date('2021-01-01')
      const createdAt = new Date()

      reactorFixture(incomeReactor)
        .when({
          type: 'incomeAdded',
          id: incomeId,
          payload: { amount: 100, date: date, categoryId: '1', memo: 'memo' },
          version: 1,
          timestamp: createdAt
        })
        .then(fixture => {
          fixture.assert(ctx => {
            expect(ctx.readModel.after.income).toBeDefined()
            expect(ctx.readModel.after.monthlyReport).toBeDefined()

            if (ctx.readModel.after.income) {
              const income = ctx.readModel.after.income[incomeId.value] as IncomeReadModel
              expect(income.amount).toBe(100)
              expect(income.date).toEqual(date)
              expect(income.categoryId).toBe('1')
              expect(income.memo).toBe('memo')
              expect(income.createdAt).toEqual(createdAt)
              expect(income.updatedAt).toEqual(createdAt)
            }

            if (ctx.readModel.after.monthlyReport) {
              const key = Object.keys(ctx.readModel.after.monthlyReport)[0] ?? ''
              const report = ctx.readModel.after.monthlyReport[key] as MonthlyReportReadModel
              expect(report.month).toBe('2021-1')
              expect(report.totalIncome).toBe(100)
              expect(report.totalExpense).toBe(0)
              expect(report.createdAt).toEqual(createdAt)
              expect(report.updatedAt).toEqual(createdAt)
            }
          })
        })
    })
  })

  describe('edit income event received', () => {
    test('handles edit event and updates incomeReadModel', () => {
      const date = new Date('2021-01-01')
      const createdAt = new Date('2021-02-01')
      const updatedAt = new Date('2021-03-01')

      reactorFixture(incomeReactor)
        .given({
          type: 'income',
          id: incomeId.value,
          amount: 100,
          date: date,
          categoryId: '1',
          memo: 'memo',
          createdAt: createdAt,
          updatedAt: updatedAt,
          deletedAt: undefined
        })
        .when({
          type: 'incomeEdited',
          id: incomeId,
          payload: { categoryId: '2', memo: 'memo2' },
          version: 2,
          timestamp: updatedAt
        })
        .then(fixture => {
          fixture.assert(ctx => {
            expect(ctx.readModel.after.income).toBeDefined()

            if (ctx.readModel.after.income) {
              const income = ctx.readModel.after.income[incomeId.value] as IncomeReadModel
              expect(income).toBeDefined()
              expect(income.categoryId).toBe('2')
              expect(income.memo).toBe('memo2')
              expect(income.createdAt).toEqual(createdAt)
              expect(income.updatedAt).toEqual(updatedAt)
            }
          })
        })
    })
  })

  describe('delete income event received', () => {
    test('handles delete event and updates incomeReadModel', () => {
      const date = new Date('2021-01-01')
      const createdAt = new Date('2021-02-01')
      const deletedAt = new Date('2021-03-01')

      reactorFixture(incomeReactor)
        .given({
          type: 'income',
          id: incomeId.value,
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
          totalIncome: 100,
          totalExpense: 0,
          createdAt: createdAt,
          updatedAt: createdAt
        })
        .when({
          type: 'incomeDeleted',
          id: incomeId,
          payload: { date: date, categoryId: '1', amount: 100 },
          version: 2,
          timestamp: deletedAt
        })
        .then(fixture => {
          fixture.assert(ctx => {
            expect(ctx.readModel.after.income).toBeDefined()
            expect(ctx.readModel.after.monthlyReport).toBeDefined()

            if (ctx.readModel.after.income) {
              const income = ctx.readModel.after.income[incomeId.value] as IncomeReadModel
              expect(income).toBeDefined()
              expect(income.amount).toBe(100)
              expect(income.date).toEqual(date)
              expect(income.categoryId).toBe('1')
              expect(income.memo).toBe('memo')
              expect(income.updatedAt).toEqual(deletedAt)
              expect(income.deletedAt).toEqual(deletedAt)
            }

            if (ctx.readModel.after.monthlyReport) {
              const key = Object.keys(ctx.readModel.after.monthlyReport)[0] ?? ''
              const report = ctx.readModel.after.monthlyReport[key] as MonthlyReportReadModel
              expect(report.month).toBe('2021-1')
              expect(report.totalIncome).toBe(0)
              expect(report.totalExpense).toBe(0)
              expect(report.updatedAt).toEqual(deletedAt)
            }
          })
        })
    })
  })
})
