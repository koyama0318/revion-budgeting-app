import { beforeEach, describe, expect, test } from 'bun:test'
import { FakeHandler, zeroId } from 'revion'
import { expense } from '../features/expense/expense-aggregate'
import { expenseQuerySource } from '../features/expense/expense-query-resolver'
import { expenseReactor } from '../features/expense/expense-reactor'
import type { ExpenseCommand } from '../features/expense/types'

const handler = new FakeHandler({
  aggregates: [expense],
  reactors: [expenseReactor],
  querySources: [expenseQuerySource]
})

describe('[integration] expense api', () => {
  beforeEach(() => handler.reset())

  test('should create and edit expense, then query results', async () => {
    // Arrange
    const expenseId = zeroId('expense')
    const commands: ExpenseCommand[] = [
      {
        type: 'addExpense',
        id: expenseId,
        payload: { amount: 100, date: '2025-10-01', categoryId: '1', memo: 'memo' }
      },
      {
        type: 'editExpense',
        id: expenseId,
        payload: { categoryId: '2', memo: 'memo2' }
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
            date: '2025-10-01',
            categoryId: '2',
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
          date: '2025-10-01',
          categoryId: '2',
          memo: 'memo2',
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          deletedAt: undefined
        }
      })
    }
  })
})
