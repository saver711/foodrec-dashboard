import type { ColumnProps } from 'primevue/column'

export interface FColumnProps<T>
  extends Omit<ColumnProps, 'field' | 'sortField' | 'filterField'> {
  field?: T | ((item: any) => T) | undefined
  sortField?: T | ((item: any) => T) | undefined
  filterField?: T | ((item: any) => T) | undefined
}
