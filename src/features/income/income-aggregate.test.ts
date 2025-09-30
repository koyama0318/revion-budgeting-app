import { describe, expect, test } from 'bun:test'
import { aggregateFixture, zeroId } from 'revion'
import { income } from './income-aggregate'
import type { IncomeCommand, IncomeEvent, IncomeState } from './types/command'

describe('[features] income aggregate', () => {
  const incomeId = zeroId('income')
  const date = new Date('2021-01-01')

  describe('add income command', () => {
    test('handles add command and creates income', () => {
      aggregateFixture<IncomeState, IncomeCommand, IncomeEvent>(income)
        .when({
          type: 'addIncome',
          id: incomeId,
          payload: {
            amount: 100,
            date: date,
            categoryId: '1',
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
              expect(ctx.state.after.categoryId).toBe('1')
              expect(ctx.state.after.memo).toBe('memo')
              expect(ctx.state.after.version).toBe(1)
            }

            expect(ctx.events.all.length).toBe(1)
            expect(ctx.events.all[0]?.type).toBe('incomeAdded')

            expect(ctx.version.diff).toBe(1)
            expect(ctx.version.latest).toBe(1)
          })
        })
    })
  })

  describe('edit income command', () => {
    test('handles edit command and edit income', () => {
      aggregateFixture<IncomeState, IncomeCommand, IncomeEvent>(income)
        .given({
          type: 'incomeAdded',
          id: incomeId,
          payload: {
            amount: 100,
            date: date,
            categoryId: '1',
            memo: 'memo'
          }
        })
        .when({
          type: 'editIncome',
          id: incomeId,
          payload: {
            categoryId: '2',
            memo: 'memo2'
          }
        })
        .then(fixture => {
          fixture.assert(ctx => {
            expect(ctx.error).toBeNull()

            expect(ctx.state.before.type).toBe('recorded')
            expect(ctx.state.after.type).toBe('recorded')
            if (ctx.state.after.type === 'recorded') {
              expect(ctx.state.after.categoryId).toBe('2')
              expect(ctx.state.after.memo).toBe('memo2')
            }

            expect(ctx.events.all.length).toBe(2)
            expect(ctx.events.all[0]?.type).toBe('incomeAdded')
            expect(ctx.events.all[1]?.type).toBe('incomeEdited')

            expect(ctx.version.diff).toBe(1)
            expect(ctx.version.latest).toBe(2)
          })
        })
    })
  })

  describe('delete income command', () => {
    test('handles delete command and delete income', () => {
      aggregateFixture<IncomeState, IncomeCommand, IncomeEvent>(income)
        .given({
          type: 'incomeAdded',
          id: incomeId,
          payload: {
            amount: 100,
            date: new Date(),
            categoryId: '1',
            memo: 'memo'
          }
        })
        .when({
          type: 'deleteIncome',
          id: incomeId
        })
        .then(fixture => {
          fixture.assert(ctx => {
            expect(ctx.error).toBeNull()

            expect(ctx.state.before.type).toBe('recorded')
            expect(ctx.state.after.type).toBe('deleted')

            expect(ctx.events.all.length).toBe(2)
            expect(ctx.events.all[0]?.type).toBe('incomeAdded')
            expect(ctx.events.all[1]?.type).toBe('incomeDeleted')

            expect(ctx.version.diff).toBe(1)
            expect(ctx.version.latest).toBe(2)
          })
        })
    })
  })
})
