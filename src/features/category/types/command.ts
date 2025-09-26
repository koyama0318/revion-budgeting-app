import type { AggregateId } from 'revion'

export type CategoryId = AggregateId<'category'>

export type CategoryState =
  | {
      type: 'active'
      id: CategoryId
      name: string
    }
  | { type: 'inactive'; id: CategoryId }

export type CategoryCommand =
  | {
      type: 'addCategory'
      id: CategoryId
      name: string
    }
  | { type: 'editCategory'; id: CategoryId; name?: string }
  | { type: 'deleteCategory'; id: CategoryId }

export type CategoryEvent =
  | {
      type: 'categoryAdded'
      id: CategoryId
      payload: {
        name: string
      }
    }
  | {
      type: 'categoryEdited'
      id: CategoryId
      payload: {
        name?: string
      }
    }
  | { type: 'categoryDeleted'; id: CategoryId }
