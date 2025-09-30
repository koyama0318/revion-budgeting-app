import { beforeEach, describe, expect, test } from 'bun:test'
import { FakeHandler, zeroId } from 'revion'
import { income } from '../features/income/income-aggregate'
import { incomeQuerySource } from '../features/income/income-query-resolver'
import { incomeReactor } from '../features/income/income-reactor'
import type { IncomeCommand } from '../features/income/types'
import { monthlyReportQuerySource } from '../features/monthly-report/monthly-report-query-resolver'
import { yearMonth } from '../shared/value-objects/year-month'

const handler = new FakeHandler({
  aggregates: [income],
  reactors: [incomeReactor],
  querySources: [incomeQuerySource, monthlyReportQuerySource]
})

describe('[integration] income api', () => {
  beforeEach(() => handler.reset())

  test('should create and edit income, then query results', async () => {
    // Arrange
    const categoryId1 = zeroId('category')
    const categoryId2 = zeroId('category')

    const incomeId = zeroId('income')
    const commands: IncomeCommand[] = [
      {
        type: 'addIncome',
        id: incomeId,
        payload: {
          amount: 100,
          date: new Date('2025-10-01'),
          categoryId: categoryId1,
          memo: 'memo'
        }
      },
      {
        type: 'editIncome',
        id: incomeId,
        payload: { categoryId: categoryId2, memo: 'memo2' }
      }
    ]

    // Act
    await handler.commandMany(commands)

    const res1 = await handler.query({
      type: 'incomes',
      sourceType: 'income',
      payload: { range: { limit: 10, offset: 0 } }
    })
    const res2 = await handler.query({
      type: 'income',
      sourceType: 'income',
      payload: { id: incomeId.value }
    })
    const res3 = await handler.query({
      type: 'monthlyReport',
      sourceType: 'monthlyReport',
      payload: { month: yearMonth(new Date('2025-10-01')) }
    })

    // Assert
    expect(res1.ok).toBe(true)
    if (res1.ok) {
      expect(res1.value.data).toEqual({
        type: 'incomes',
        items: [
          {
            type: 'income',
            id: incomeId.value,
            amount: 100,
            date: new Date('2025-10-01'),
            categoryId: categoryId2,
            memo: 'memo2',
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
        type: 'income',
        item: {
          type: 'income',
          id: incomeId.value,
          amount: 100,
          date: new Date('2025-10-01'),
          categoryId: categoryId2,
          memo: 'memo2',
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          deletedAt: undefined
        }
      })
    }

    expect(res3.ok).toBe(true)
    if (res3.ok) {
      expect(res3.value.data).toEqual({
        type: 'monthlyReport',
        item: {
          type: 'monthlyReport',
          id: expect.any(String),
          month: '2025-10',
          totalIncome: 100,
          totalExpense: 0,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date)
        }
      })
    }
  })

  test('should create and delete income, then query results', async () => {
    // Arrange
    const categoryId1 = zeroId('category')

    const incomeId = zeroId('income')
    const commands: IncomeCommand[] = [
      {
        type: 'addIncome',
        id: incomeId,
        payload: {
          amount: 100,
          date: new Date('2025-10-01'),
          categoryId: categoryId1,
          memo: 'memo'
        }
      },
      {
        type: 'deleteIncome',
        id: incomeId
      }
    ]

    // Act
    await handler.commandMany(commands)

    const res1 = await handler.query({
      type: 'incomes',
      sourceType: 'income',
      payload: { range: { limit: 10, offset: 0 } }
    })
    const res2 = await handler.query({
      type: 'income',
      sourceType: 'income',
      payload: { id: incomeId.value }
    })
    const res3 = await handler.query({
      type: 'monthlyReport',
      sourceType: 'monthlyReport',
      payload: { month: yearMonth(new Date('2025-10-01')) }
    })

    // Assert
    expect(res1.ok).toBe(true)
    if (res1.ok) {
      expect(res1.value.data).toEqual({
        type: 'incomes',
        items: [
          {
            type: 'income',
            id: incomeId.value,
            amount: 100,
            date: new Date('2025-10-01'),
            categoryId: categoryId1,
            memo: 'memo',
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
            deletedAt: expect.any(Date)
          }
        ],
        total: 1
      })
    }

    expect(res2.ok).toBe(true)
    if (res2.ok) {
      expect(res2.value.data).toEqual({
        type: 'income',
        item: {
          type: 'income',
          id: incomeId.value,
          amount: 100,
          date: new Date('2025-10-01'),
          categoryId: categoryId1,
          memo: 'memo',
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          deletedAt: expect.any(Date)
        }
      })
    }

    expect(res3.ok).toBe(true)
    if (res3.ok) {
      expect(res3.value.data).toEqual({
        type: 'monthlyReport',
        item: {
          type: 'monthlyReport',
          id: expect.any(String),
          month: '2025-10',
          totalIncome: 0,
          totalExpense: 0,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date)
        }
      })
    }
  })
})
