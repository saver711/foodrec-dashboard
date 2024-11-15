import {
  FIRST_DEFAULT,
  PAGE_DEFAULT,
  PER_PAGE_DEFAULT,
  SORT_ORDER_DEFAULT,
} from '@/components/ui/table/consts/table.const'
import type { TableUrlParams } from '@/components/ui/table/models/table-url-params.model'
import { useUrlSearchParams } from '@vueuse/core'
import { defineStore } from 'pinia'
import { computed } from 'vue'

export const useTable = defineStore('table-store', () => {
  const tableUrlParams = useUrlSearchParams<TableUrlParams>('history', {
    initialValue: {
      page: PAGE_DEFAULT,
      perPage: PER_PAGE_DEFAULT,
      first: FIRST_DEFAULT,
      filterValue: '',
      sortBy: '',
      sortOrder: SORT_ORDER_DEFAULT,
    },
    removeFalsyValues: true,
  })

  const setParamValue = (
    param: keyof TableUrlParams,
    value: TableUrlParams[keyof TableUrlParams],
  ) => {
    // @ts-expect-error it is okay
    tableUrlParams[param] = value
  }

  const filterValue = computed(() => tableUrlParams.filterValue || '')
  const page = computed(() => +tableUrlParams.page || PAGE_DEFAULT)
  const perPage = computed(() => +tableUrlParams.perPage || PER_PAGE_DEFAULT)
  const first = computed(() => +tableUrlParams.first || FIRST_DEFAULT)
  const sortBy = computed(() => tableUrlParams.sortBy)
  const sortOrder = computed(
    () => tableUrlParams.sortOrder || SORT_ORDER_DEFAULT,
  )

  return {
    setParamValue,
    filterValue,
    page,
    perPage,
    first,
    sortBy,
    sortOrder,
  }
})
