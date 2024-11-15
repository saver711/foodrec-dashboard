import type { SortOrder } from './sort-order.enum'

export type TableUrlParams = {
  page: number
  perPage: number
  first: number
  filterValue: string
  sortBy: string
  sortOrder: SortOrder
}
