import { beforeEach, describe, expect, test } from 'bun:test'
import { FakeHandler, zeroId } from 'revion'
import { expense } from '../features/expense/expense-aggregate'
import { expenseQuerySource } from '../features/expense/expense-query-resolver'
import { expenseReactor } from '../features/expense/expense-reactor'
import type { ExpenseCommand } from '../features/expense/types'
import { monthlyReportQuerySource } from '../features/monthly-report/monthly-report-query-resolver'
import { yearMonth } from '../shared/value-objects/year-month'

const handler = new FakeHandler({
  aggregates: [expense],
  reactors: [expenseReactor],
  querySources: [expenseQuerySource, monthlyReportQuerySource]
})

describe('[integration] expense api', () => {
  beforeEach(() => handler.reset())

  test('should create and edit expense, then query results', async () => {
    // Arrange
    const category1 = zeroId('category')
    const category2 = zeroId('category')

    const expenseId = zeroId('expense')
    const commands: ExpenseCommand[] = [
      {
        type: 'addExpense',
        id: expenseId,
        payload: { amount: 100, date: new Date('2025-10-01'), categoryId: category1, memo: 'memo' }
      },
      {
        type: 'editExpense',
        id: expenseId,
        payload: { categoryId: category2, memo: 'memo2' }
      }
    ]

    // Act
    await handler.commandMany(commands)

    const res1 = await handler.query({
      type: 'expenses',
      sourceType: 'expense',
      payload: { range: { limit: 10, offset: 0 } }
    })
    const res2 = await handler.query({
      type: 'expense',
      sourceType: 'expense',
      payload: { id: expenseId.value }
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
        type: 'expenses',
        items: [
          {
            type: 'expense',
            id: expenseId.value,
            amount: 100,
            date: new Date('2025-10-01'),
            categoryId: category2,
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
        type: 'expense',
        item: {
          type: 'expense',
          id: expenseId.value,
          amount: 100,
          date: new Date('2025-10-01'),
          categoryId: category2,
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
          totalIncome: 0,
          totalExpense: 100,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date)
        }
      })
    }
  })

  test('should create and delete expense, then query results', async () => {
    // Arrange
    const categoryId = zeroId('category')

    const expenseId = zeroId('expense')
    const commands: ExpenseCommand[] = [
      {
        type: 'addExpense',
        id: expenseId,
        payload: { amount: 100, date: new Date('2025-10-01'), categoryId, memo: 'memo' }
      },
      {
        type: 'deleteExpense',
        id: expenseId
      }
    ]

    // Act
    await handler.commandMany(commands)

    const res1 = await handler.query({
      type: 'expenses',
      sourceType: 'expense',
      payload: { range: { limit: 10, offset: 0 } }
    })
    const res2 = await handler.query({
      type: 'expense',
      sourceType: 'expense',
      payload: { id: expenseId.value }
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
        type: 'expenses',
        items: [
          {
            type: 'expense',
            id: expenseId.value,
            amount: 100,
            date: new Date('2025-10-01'),
            categoryId: categoryId,
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
        type: 'expense',
        item: {
          type: 'expense',
          id: expenseId.value,
          amount: 100,
          date: new Date('2025-10-01'),
          categoryId: categoryId,
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
