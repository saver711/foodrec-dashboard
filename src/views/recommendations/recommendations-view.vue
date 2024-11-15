<script setup lang="ts">
import FTable from '@/components/ui/table/f-table.vue'
import { useRecommendationsStore } from '@/stores/recommendations-store/recommendations.store'
import { recommendationsTableColumns } from './consts/recommendations-table-columns.const'

const recommendationsStore = useRecommendationsStore()
import Toast from 'primevue/toast'
//
//
</script>

<template>
  Recommendations

  <FTable
    :is-loading="recommendationsStore.isLoadingTableRecommendations"
    :columns="recommendationsTableColumns"
    :entities="recommendationsStore.tableRecommendations?.data || []"
    :total-records="
      recommendationsStore.tableRecommendations?.pagination?.total || 0
    "
  />

  <Toast />
</template>
