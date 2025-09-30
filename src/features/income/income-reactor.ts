import type { Policy, Projection } from 'revion'
import { createEventReactor, zeroId } from 'revion'
import { yearMonth } from '../../shared/value-objects/year-month'
import type { IncomeCommand, IncomeEvent } from './types/command'
import type { IncomeProjectionMap, IncomeProjections } from './types/map'
import { projectionMap } from './types/map'

const policy: Policy<IncomeEvent, IncomeCommand> = {
  incomeAdded: () => null,
  incomeEdited: () => null,
  incomeDeleted: () => null
}

const projection: Projection<IncomeEvent, IncomeProjections, IncomeProjectionMap> = {
  incomeAdded: {
    income: ({ ctx, event }) => ({
      type: 'income',
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
      totalIncome: event.payload.amount,
      totalExpense: 0,
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
    },
    monthlyReport: ({ ctx, readModel, event }) => {
      readModel.totalIncome = readModel.totalIncome - event.payload.amount
      readModel.updatedAt = ctx.timestamp
    }
  }
}

export const incomeReactor = createEventReactor<IncomeEvent, IncomeCommand, IncomeProjections>()
  .type('income')
  .policy(policy)
  .projectionWithMap(projection, projectionMap)
  .build()
