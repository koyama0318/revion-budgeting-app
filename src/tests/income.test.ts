import { beforeEach, describe, expect, test } from 'bun:test'
import { FakeHandler, zeroId } from 'revion'
import { income } from '../features/income/income-aggregate'
import { incomeQuerySource } from '../features/income/income-query-resolver'
import { incomeReactor } from '../features/income/income-reactor'
import type { IncomeCommand } from '../features/income/types'

const handler = new FakeHandler({
  aggregates: [income],
  reactors: [incomeReactor],
  querySources: [incomeQuerySource]
})

describe('[integration] income api', () => {
  beforeEach(() => handler.reset())

  test('should create and edit income, then query results', async () => {
    // Arrange
    const incomeId = zeroId('income')
    const commands: IncomeCommand[] = [
      {
        type: 'addIncome',
        id: incomeId,
        payload: { amount: 100, date: '2025-10-01', categoryId: '1', memo: 'memo' }
      },
      {
        type: 'editIncome',
        id: incomeId,
        payload: { categoryId: '2', memo: 'memo2' }
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
        type: 'income',
        item: {
          type: 'income',
          id: incomeId.value,
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
