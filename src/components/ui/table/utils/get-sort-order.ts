import { SORT_ORDER_DEFAULT } from '../consts/table.const'
import { SortOrder } from '../models/sort-order.enum'

export const getSortOrder = (order: 1 | -1 | 0) => {
  return { '1': SortOrder.asc, '-1': SortOrder.desc, '0': SORT_ORDER_DEFAULT }[
    order
  ]
}
export const getSortOrderAsNumber = (order: SortOrder): 1 | -1 => {
  return { [SortOrder.asc]: 1, [SortOrder.desc]: -1 }[order] as 1 | -1
}
