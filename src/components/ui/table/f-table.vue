<script setup lang="ts">
import Column, { type ColumnProps } from 'primevue/column'
import DataTable, {
  type DataTablePageEvent,
  type DataTableSelectAllChangeEvent,
  type DataTableSortEvent,
} from 'primevue/datatable'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import InputText from 'primevue/inputtext'
import type { PropType } from 'vue'

const props = defineProps({
  entities: {
    required: true,
    type: Array as PropType<unknown[]>,
  },
  totalRecords: {
    required: true,
    type: Number,
  },
  dataKey: {
    type: String,
    default: '_id',
  },
  isLoading: {
    required: true,
    type: Boolean,
  },

  columns: {
    required: true,
    type: Array as PropType<ColumnProps[]>,
  },
})

import { useTable } from '@/composables/use-table.composable'
import { DEBOUNCE_VALUE } from '@/consts/debounce-value'
import { useDebounceFn } from '@vueuse/core'
import { ref, watch } from 'vue'
import {
  FIRST_DEFAULT,
  PAGE_DEFAULT,
  PER_PAGE_DEFAULT,
  ROWS_PER_PAGE_OPTIONS,
  SORT_ORDER_DEFAULT_AS_NUMBER,
} from './consts/table.const'
import type { DataTableLazyEvent } from './models/data-table-lazy-event.model'
import { getSortOrder, getSortOrderAsNumber } from './utils/get-sort-order'

const selectedEntities = ref<typeof props.entities>([])
const isAllRowsSelected = ref(false)
const table = useTable()

const filterValue = ref(table.filterValue || '')
const lazyParams = ref<Partial<DataTableLazyEvent>>({
  first: FIRST_DEFAULT,
  rows: PER_PAGE_DEFAULT,
  page: PAGE_DEFAULT,
  sortField: table.sortBy,
  sortOrder:
    getSortOrderAsNumber(table.sortOrder) || SORT_ORDER_DEFAULT_AS_NUMBER,
})

const clearFilter = () => (filterValue.value = '')

// WATCH lazyParams
watch(lazyParams, () => {
  if (lazyParams.value.page !== undefined) {
    table.setParamValue('page', lazyParams.value.page)
  }
  if (lazyParams.value.rows !== undefined) {
    table.setParamValue('perPage', lazyParams.value.rows)
  }
  if (lazyParams.value.first !== undefined) {
    table.setParamValue('first', lazyParams.value.first)
  }
  if (lazyParams.value.sortField) {
    table.setParamValue('sortBy', lazyParams.value.sortField)
  }
  if (
    lazyParams.value.sortOrder !== null &&
    lazyParams.value.sortOrder !== undefined
  ) {
    table.setParamValue('sortOrder', getSortOrder(lazyParams.value.sortOrder))
  }
})

// WATCH (perPage)
watch(
  () => lazyParams.value.rows,
  value => {
    if (value !== undefined) {
      resetToFirstPage()
    }
  },
)

watch(filterValue, () => debounceFilterInput())

const loadLazyData = (event?: Partial<DataTableLazyEvent>) => {
  lazyParams.value = {
    ...lazyParams.value,
    first: event?.first || table.first,
  }
}
const onPage = (ev: DataTablePageEvent) => {
  const event = ev as Partial<DataTableLazyEvent>
  lazyParams.value = event
  loadLazyData(event)

  // RESET SELECT ALL
  isAllRowsSelected.value = false
  selectedEntities.value = []
}
const onSort = (ev: DataTableSortEvent) => {
  const event = ev as Partial<DataTableLazyEvent>
  lazyParams.value = event
  loadLazyData(event)
}

const onSelectAllChange = (ev: DataTableSelectAllChangeEvent) => {
  isAllRowsSelected.value = ev.checked

  if (isAllRowsSelected.value && props.entities) {
    isAllRowsSelected.value = true
    selectedEntities.value = props.entities
  } else {
    isAllRowsSelected.value = false
    selectedEntities.value = []
  }
}
const onRowSelect = () => {
  isAllRowsSelected.value =
    selectedEntities.value.length === props.entities.length
}

const onRowUnselect = () => {
  isAllRowsSelected.value = false
}

const debounceFilterInput = useDebounceFn(() => {
  table.setParamValue('filterValue', filterValue.value)
  resetToFirstPage()
}, DEBOUNCE_VALUE)

const resetToFirstPage = () => {
  table.setParamValue('first', FIRST_DEFAULT)
  table.setParamValue('page', PAGE_DEFAULT)
}
</script>

<template>
  <div class="card">
    <DataTable
      :value="entities || []"
      :rowsPerPageOptions="ROWS_PER_PAGE_OPTIONS"
      lazy
      paginator
      :first="table.first"
      :rows="table.perPage"
      :dataKey="dataKey"
      :totalRecords="totalRecords"
      :loading="isLoading"
      @page="onPage($event)"
      @sort="onSort($event)"
      v-model:selection="selectedEntities"
      :selectAll="isAllRowsSelected"
      @select-all-change="onSelectAllChange"
      @row-select="onRowSelect"
      @row-unselect="onRowUnselect"
      :alwaysShowPaginator="!!entities.length"
      :sortOrder="lazyParams.sortOrder!"
      :sortField="lazyParams.sortField"
    >
      <template #header>
        <div class="flex justify-between">
          <IconField>
            <InputIcon>
              <i class="pi pi-search" />
            </InputIcon>
            <InputText
              v-model="filterValue as string"
              placeholder="Keyword Search"
            />
            <InputIcon class="cursor-pointer" @click="clearFilter">
              <i class="pi pi-times" />
            </InputIcon>
          </IconField>
        </div>
      </template>
      <template #empty> No Data. </template>

      <Column selectionMode="multiple" headerStyle="width: 8rem"></Column>
      <Column
        v-for="col of columns"
        :key="col.field as PropertyKey"
        :field="col.field"
        :header="col.header"
        :sortable="col.sortable"
      >
      </Column>
    </DataTable>
  </div>
</template>
