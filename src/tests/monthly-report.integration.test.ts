import { beforeEach, describe, expect, test } from 'bun:test'
import { FakeHandler, zeroId } from 'revion'
import { expense } from '../features/expense/expense-aggregate'
import { expenseQuerySource } from '../features/expense/expense-query-resolver'
import { expenseReactor } from '../features/expense/expense-reactor'
import type { ExpenseCommand } from '../features/expense/types'
import { income } from '../features/income/income-aggregate'
import { incomeQuerySource } from '../features/income/income-query-resolver'
import { incomeReactor } from '../features/income/income-reactor'
import type { IncomeCommand } from '../features/income/types'
import { monthlyReportQuerySource } from '../features/monthly-report/monthly-report-query-resolver'
import { yearMonth } from '../shared/value-objects/year-month'

const handler = new FakeHandler({
  aggregates: [income, expense],
  reactors: [incomeReactor, expenseReactor],
  querySources: [incomeQuerySource, expenseQuerySource, monthlyReportQuerySource]
})

describe('[integration] monthly report api', () => {
  beforeEach(() => handler.reset())

  test('should create income and expense, then query results', async () => {
    // Arrange
    const incomeId1 = zeroId('income')
    const incomeId2 = zeroId('income')
    const expenseId1 = zeroId('expense')
    const expenseId2 = zeroId('expense')
    const categoryId = zeroId('category')

    const commands = [
      {
        type: 'addIncome',
        id: incomeId1,
        payload: { amount: 2000, date: new Date('2025-10-01'), categoryId, memo: 'memo' }
      } as IncomeCommand,
      {
        type: 'addExpense',
        id: expenseId1,
        payload: { amount: 500, date: new Date('2025-10-01'), categoryId, memo: 'memo' }
      } as ExpenseCommand,
      {
        type: 'addIncome',
        id: incomeId2,
        payload: { amount: 1000, date: new Date('2025-10-01'), categoryId, memo: 'memo' }
      } as IncomeCommand,
      {
        type: 'addExpense',
        id: expenseId2,
        payload: { amount: 2000, date: new Date('2025-10-01'), categoryId, memo: 'memo' }
      } as ExpenseCommand
    ]

    // Act
    await handler.commandMany(commands)

    const res1 = await handler.query({
      type: 'incomes',
      sourceType: 'income',
      payload: { range: { limit: 10, offset: 0 } }
    })
    const res2 = await handler.query({
      type: 'expenses',
      sourceType: 'expense',
      payload: { range: { limit: 10, offset: 0 } }
    })
    const res3 = await handler.query({
      type: 'monthlyReport',
      sourceType: 'monthlyReport',
      payload: { month: yearMonth(new Date('2025-10-01')) }
    })

    // Assert
    expect(res1.ok).toBe(true)
    if (res1.ok) {
      expect(res1.value.data.total).toBe(2)
    }

    expect(res2.ok).toBe(true)
    if (res2.ok) {
      expect(res2.value.data.total).toBe(2)
    }

    expect(res3.ok).toBe(true)
    if (res3.ok) {
      expect(res3.value.data).toEqual({
        type: 'monthlyReport',
        item: {
          type: 'monthlyReport',
          id: expect.any(String),
          month: '2025-10',
          totalIncome: 3000,
          totalExpense: 2500,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date)
        }
      })
    }
  })
})
