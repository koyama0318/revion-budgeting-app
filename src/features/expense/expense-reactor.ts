import type { Policy, Projection } from 'revion'
import { createEventReactor } from 'revion'
import type { ExpenseReadModel } from '../../shared/read-models'
import type { ExpenseCommand, ExpenseEvent } from './types/command'
import type { ExpenseProjectionMap } from './types/map'
import { projectionMap } from './types/map'

const policy: Policy<ExpenseEvent, ExpenseCommand> = {
  expenseAdded: () => null,
  expenseEdited: () => null,
  expenseDeleted: () => null
}

const projection: Projection<ExpenseEvent, ExpenseReadModel, ExpenseProjectionMap> = {
  expenseAdded: {
    expense: ({ ctx, event }) => ({
      type: 'expense',
      id: event.id.value,
      amount: event.payload.amount,
      date: event.payload.date,
      categoryId: event.payload.categoryId,
      memo: event.payload.memo,
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
    }
  }
}

export const expenseReactor = createEventReactor<ExpenseEvent, ExpenseCommand, ExpenseReadModel>()
  .type('expense')
  .policy(policy)
  .projectionWithMap(projection, projectionMap)
  .build()
