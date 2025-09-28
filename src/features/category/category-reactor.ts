import type { Policy, Projection } from 'revion'
import { createEventReactor } from 'revion'
import type { CategoryReadModel } from '../../shared/read-models'
import type { CategoryCommand, CategoryEvent, CategoryProjectionMap } from './types'
import { projectionMap } from './types'

const policy: Policy<CategoryEvent, CategoryCommand> = {
  categoryAdded: () => null,
  categoryEdited: () => null,
  categoryDeleted: () => null
}

const projection: Projection<CategoryEvent, CategoryReadModel, CategoryProjectionMap> = {
  categoryAdded: {
    category: ({ ctx, event }) => ({
      type: 'category',
      id: event.id.value,
      name: event.payload.name,
      createdAt: ctx.timestamp,
      updatedAt: ctx.timestamp
    })
  },
  categoryEdited: {
    category: ({ ctx, event, readModel }) => {
      readModel.name = event.payload.name ?? readModel.name
      readModel.updatedAt = ctx.timestamp
    }
  },
  categoryDeleted: {
    category: ({ ctx, readModel }) => {
      readModel.updatedAt = ctx.timestamp
      readModel.deletedAt = ctx.timestamp
    }
  }
}

export const categoryReactor = createEventReactor<
  CategoryEvent,
  CategoryCommand,
  CategoryReadModel
>()
  .type('category')
  .policy(policy)
  .projectionWithMap(projection, projectionMap)
  .build()
