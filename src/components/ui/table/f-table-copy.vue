<script setup lang="ts">
import { useCustomQuery } from '@/lib/foodrec/hooks/use-custom-query'
import type { Recommendation } from '@/models/recommendations/recommendation.model'
import { getAllRecommendations } from '@/services/recommendations/get-all-recommendations.service'
import { refDebounced, useUrlSearchParams } from '@vueuse/core'
import Button from 'primevue/button'
import Column, { type ColumnProps } from 'primevue/column'
import DataTable, {
  type DataTablePageEvent,
  type DataTableSelectAllChangeEvent,
  type DataTableSortEvent,
  type DataTableStateEvent,
} from 'primevue/datatable'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import InputText from 'primevue/inputtext'
import type { PropType } from 'vue'

defineProps({
  data: {
    required: true,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    type: Array as PropType<any[]>,
  },
  columns: {
    required: true,
    type: Array as PropType<ColumnProps[]>,
  },
})

import { computed, ref, toRef, watch } from 'vue'
import {
  FIRST_DEFAULT,
  PAGE_DEFAULT,
  PER_PAGE_DEFAULT,
  SORT_ORDER_DEFAULT,
  SORT_ORDER_DEFAULT_AS_NUMBER,
} from './consts/table.const'
import { getSortOrder, getSortOrderAsNumber } from './utils/get-sort-order'
import type { SortOrder } from './models/sort-order.enum'

// onMounted(() => {

//   lazyParams.value = {
//     first: 0,
//     rows: 2,
//     sortField: '',
//     sortOrder: null,
//     filters: filters.value,
//   }

//   loadLazyData()
// })

// const dt = ref()
const totalRecords = ref(0)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const entities = ref<any[]>([])
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const selectedEntities = ref<any[]>([])
const selectAll = ref(false)
const params = toRef(
  useUrlSearchParams('history', {
    initialValue: {
      page: PAGE_DEFAULT,
      perPage: PER_PAGE_DEFAULT,
      first: FIRST_DEFAULT,
      filterValue: '',
      sortBy: '',
      sortOrder: SORT_ORDER_DEFAULT,
    },
    removeFalsyValues: true,
  }),
)
const filterValue = ref(params.value.filterValue || '')
const debouncedFilterValue = refDebounced(filterValue, 1000)
const lazyParams = ref<Partial<DataTableLazyEvent>>({
  first: FIRST_DEFAULT,
  rows: PER_PAGE_DEFAULT,
  page: PAGE_DEFAULT,
  sortField: params.value.sortBy,
  sortOrder:
    getSortOrderAsNumber(params.value.sortOrder) ||
    SORT_ORDER_DEFAULT_AS_NUMBER,
})

const clearFilter = () => (filterValue.value = '')

// WATCH (page / perPage / first)
watch(lazyParams, () => {
  if (lazyParams.value.page !== undefined) {
    params.value.page = lazyParams.value.page
  }
  if (lazyParams.value.rows !== undefined) {
    params.value.perPage = lazyParams.value.rows
  }
  if (lazyParams.value.first !== undefined) {
    params.value.first = lazyParams.value.first
  }
  if (lazyParams.value.sortField) {
    params.value.sortBy = lazyParams.value.sortField
  }
  if (
    lazyParams.value.sortOrder !== null &&
    lazyParams.value.sortOrder !== undefined
  ) {
    params.value.sortOrder = getSortOrder(lazyParams.value.sortOrder)
  }
})

// WATCH filterValue
watch(filterValue, () => {
  params.value.filterValue = filterValue.value
})

const page = computed(() => +params.value.page)
const perPage = computed(() => +params.value.perPage)
const first = computed(() => +params.value.first || FIRST_DEFAULT)
const sortBy = computed(() => params.value.sortBy)
const sortOrder = computed(() => params.value.sortOrder || SORT_ORDER_DEFAULT)

const { isLoading, data: recommendationsData } = useCustomQuery<
  Recommendation[]
>({
  queryKey: [
    'recommendations',
    page,
    perPage,
    debouncedFilterValue,
    sortBy,
    sortOrder,
  ],
  queryFn: ({ queryKey }) =>
    getAllRecommendations(
      queryKey[1] as number,
      queryKey[2] as number,
      queryKey[3] as string,
      queryKey[4] as string,
      queryKey[5] as SortOrder,
    ),
})

watch(recommendationsData, () => {
  if (
    recommendationsData &&
    recommendationsData.value &&
    recommendationsData.value.pagination
  ) {
    entities.value = recommendationsData.value.data
    totalRecords.value = recommendationsData.value.pagination?.total
  }
})

type DataTableLazyEvent = DataTableStateEvent &
  // Partial<DataTableFilterEvent> &
  Partial<DataTablePageEvent> &
  Partial<DataTableSortEvent>

const loadLazyData = (event?: Partial<DataTableLazyEvent>) => {
  // loading.value = true
  lazyParams.value = { ...lazyParams.value, first: event?.first || first.value }
  // const page = lazyParams.value.page
  // const perPage = lazyParams.value.rows
  // refetch() // CALL API and
  /*
  customers.value = props.data.customers

  */
  //  totalRecords.value = props.data.totalRecords
  // totalRecords.value = 5
  // loading.value = false
}
const onPage = (ev: DataTablePageEvent) => {
  const event = ev as Partial<DataTableLazyEvent>
  lazyParams.value = event
  loadLazyData(event)

  // RESET SELECT ALL
  selectAll.value = false
  selectedEntities.value = []
}
const onSort = (ev: DataTableSortEvent) => {
  console.log(`🚀 ~ onSort ~ ev:`, ev.sortOrder)
  const event = ev as Partial<DataTableLazyEvent>
  lazyParams.value = event
  loadLazyData(event)
}
// const onFilter = (ev: DataTableFilterEvent) => {
//   const event = ev as Partial<DataTableLazyEvent>
//   lazyParams.value.filters = filters.value
//   loadLazyData(event)
// }
const onSelectAllChange = (ev: DataTableSelectAllChangeEvent) => {
  selectAll.value = ev.checked

  if (selectAll.value && recommendationsData.value) {
    selectAll.value = true
    selectedEntities.value = recommendationsData.value.data
  } else {
    selectAll.value = false
    selectedEntities.value = []
  }
}
const onRowSelect = () => {
  // selectAll.value = selectedEntities.value.length === totalRecords.value
  selectAll.value =
    selectedEntities.value.length === recommendationsData.value?.data.length
}
const onRowUnselect = () => {
  selectAll.value = false
}
</script>

<template>
  <div class="card">
    <DataTable
      :value="entities || []"
      :rowsPerPageOptions="[2, 5, 10, 20, 50]"
      lazy
      paginator
      :first="first"
      :rows="perPage"
      ref="dt"
      dataKey="_id"
      :totalRecords="totalRecords"
      :loading="isLoading"
      @page="onPage($event)"
      @sort="onSort($event)"
      v-model:selection="selectedEntities"
      :selectAll="selectAll"
      @select-all-change="onSelectAllChange"
      @row-select="onRowSelect"
      @row-unselect="onRowUnselect"
      tableStyle="min-width: 50rem"
      :alwaysShowPaginator="!!entities.length"
      :sortOrder="lazyParams.sortOrder!"
      :sortField="lazyParams.sortField"
    >
      <template #header>
        <div class="flex justify-between">
          <Button
            type="button"
            icon="pi pi-filter-slash"
            label="Clear"
            outlined
            @click="clearFilter()"
          />
          <IconField>
            <InputIcon>
              <i class="pi pi-search" />
            </InputIcon>
            <InputText v-model="filterValue" placeholder="Keyword Search" />
          </IconField>
        </div>
      </template>
      <template v-if="!isLoading" #empty> No Data. </template>

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
