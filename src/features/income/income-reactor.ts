import type { Policy, Projection } from 'revion'
import { createEventReactor } from 'revion'
import type { IncomeReadModel } from '../../shared/read-models'
import type { IncomeCommand, IncomeEvent } from './types/command'
import type { IncomeProjectionMap } from './types/map'
import { projectionMap } from './types/map'

const policy: Policy<IncomeEvent, IncomeCommand> = {
  incomeAdded: () => null,
  incomeEdited: () => null,
  incomeDeleted: () => null
}

const projection: Projection<IncomeEvent, IncomeReadModel, IncomeProjectionMap> = {
  incomeAdded: {
    income: ({ ctx, event }) => ({
      type: 'income',
      id: event.id.value,
      amount: event.payload.amount,
      date: event.payload.date,
      categoryId: event.payload.categoryId,
      memo: event.payload.memo,
      createdAt: ctx.timestamp,
      updatedAt: ctx.timestamp
    })
  },
  incomeEdited: {
    income: ({ ctx, event, readModel }) => {
      readModel.categoryId = event.payload.categoryId ?? readModel.categoryId
      readModel.memo = event.payload.memo ?? readModel.memo
      readModel.updatedAt = ctx.timestamp
    }
  },
  incomeDeleted: {
    income: ({ ctx, readModel }) => {
      readModel.updatedAt = ctx.timestamp
      readModel.deletedAt = ctx.timestamp
    }
  }
}

export const incomeReactor = createEventReactor<IncomeEvent, IncomeCommand, IncomeReadModel>()
  .type('income')
  .policy(policy)
  .projectionWithMap(projection, projectionMap)
  .build()
