import type {
  DataTablePageEvent,
  DataTableSortEvent,
  DataTableStateEvent,
} from 'primevue/datatable'

export type DataTableLazyEvent = DataTableStateEvent &
  Partial<DataTablePageEvent> &
  Partial<DataTableSortEvent>
