import { describe, expect, test } from 'bun:test'
import { reactorFixture, zeroId } from 'revion'
import type { IncomeReadModel } from '../../shared/read-models'
import { incomeReactor } from './income-reactor'

describe('[features] income reactor', () => {
  const incomeId = zeroId('income')

  describe('add income event received', () => {
    test('handles add event and creates incomeReadModel', () => {
      const now = new Date()

      reactorFixture(incomeReactor)
        .when({
          type: 'incomeAdded',
          id: incomeId,
          payload: { amount: 100, date: '2021-01-01', categoryId: '1', memo: 'memo' },
          version: 1,
          timestamp: now
        })
        .then(fixture => {
          fixture.assert(ctx => {
            expect(ctx.readModel.after.income).toBeDefined()

            if (ctx.readModel.after.income) {
              const income = ctx.readModel.after.income[incomeId.value] as IncomeReadModel
              expect(income).toBeDefined()
              expect(income.amount).toBe(100)
              expect(income.date).toBe('2021-01-01')
              expect(income.categoryId).toBe('1')
              expect(income.memo).toBe('memo')
              expect(income.createdAt).toBe(now)
              expect(income.updatedAt).toBe(now)
            }
          })
        })
    })
  })

  describe('edit income event received', () => {
    test('handles edit event and updates incomeReadModel', () => {
      const now = new Date()
      const updatedAt = new Date()

      reactorFixture(incomeReactor)
        .given({
          type: 'income',
          id: incomeId.value,
          amount: 100,
          date: '2021-01-01',
          categoryId: '1',
          memo: 'memo',
          createdAt: now,
          updatedAt: now,
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
              expect(income.updatedAt).toBe(updatedAt)
            }
          })
        })
    })
  })

  describe('delete income event received', () => {
    test('handles delete event and updates incomeReadModel', () => {
      const now = new Date()
      const deletedAt = new Date()

      reactorFixture(incomeReactor)
        .given({
          type: 'income',
          id: incomeId.value,
          amount: 100,
          date: '2021-01-01',
          categoryId: '1',
          memo: 'memo',
          createdAt: now,
          updatedAt: now,
          deletedAt: undefined
        })
        .when({
          type: 'incomeDeleted',
          id: incomeId,
          version: 2,
          timestamp: deletedAt
        })
        .then(fixture => {
          fixture.assert(ctx => {
            expect(ctx.readModel.after.income).toBeDefined()

            if (ctx.readModel.after.income) {
              const income = ctx.readModel.after.income[incomeId.value] as IncomeReadModel
              expect(income).toBeDefined()
              expect(income.amount).toBe(100)
              expect(income.date).toBe('2021-01-01')
              expect(income.categoryId).toBe('1')
              expect(income.memo).toBe('memo')
              expect(income.updatedAt).toBe(deletedAt)
              expect(income.deletedAt).toBe(deletedAt)
            }
          })
        })
    })
  })
})
