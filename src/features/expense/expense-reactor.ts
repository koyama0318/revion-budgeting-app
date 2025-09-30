import type { Policy, Projection } from 'revion'
import { createEventReactor, zeroId } from 'revion'
import { yearMonth } from '../../shared/value-objects/year-month'
import type { ExpenseCommand, ExpenseEvent } from './types/command'
import type { ExpenseProjectionMap, ExpenseProjections } from './types/map'
import { projectionMap } from './types/map'

const policy: Policy<ExpenseEvent, ExpenseCommand> = {
  expenseAdded: () => null,
  expenseEdited: () => null,
  expenseDeleted: () => null
}

const projection: Projection<ExpenseEvent, ExpenseProjections, ExpenseProjectionMap> = {
  expenseAdded: {
    expense: ({ ctx, event }) => ({
      type: 'expense',
      id: event.id.value,
      amount: event.payload.amount,
      date: event.payload.date,
      categoryId: event.payload.categoryId,
      memo: event.payload.memo,
      createdAt: ctx.timestamp,
      updatedAt: ctx.timestamp,
      deletedAt: undefined
    }),
    monthlyReport: ({ ctx, event }) => ({
      id: zeroId('monthlyReport').value,
      type: 'monthlyReport',
      month: yearMonth(event.payload.date) ?? '',
      totalIncome: 0,
      totalExpense: event.payload.amount,
      createdAt: ctx.timestamp,
      updatedAt: ctx.timestamp
    })
  },
  expenseEdited: {
    expense: ({ ctx, event, readModel }) => {
      readModel.categoryId = event.payload.categoryId ?? readModel.categoryId
      readModel.memo = event.payload.memo ?? readModel.memo
      readModel.updatedAt = ctx.timestamp
    }
  },
  expenseDeleted: {
    expense: ({ ctx, readModel }) => {
      readModel.updatedAt = ctx.timestamp
      readModel.deletedAt = ctx.timestamp
    },
    monthlyReport: ({ ctx, readModel, event }) => {
      readModel.totalExpense = readModel.totalExpense - event.payload.amount
      readModel.updatedAt = ctx.timestamp
    }
  }
}

export const expenseReactor = createEventReactor<ExpenseEvent, ExpenseCommand, ExpenseProjections>()
  .type('expense')
  .policy(policy)
  .projectionWithMap(projection, projectionMap)
  .build()
