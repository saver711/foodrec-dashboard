import type { SortOrder } from '@/components/ui/table/models/sort-order.enum'
import { useTable } from '@/composables/use-table.composable'
import { useCustomQuery } from '@/lib/foodrec/hooks/use-custom-query'
import type { Recommendation } from '@/models/recommendations/recommendation.model'
import { getAllRecommendations } from '@/services/recommendations/get-all-recommendations.service'

import { defineStore, storeToRefs } from 'pinia'

export const useRecommendationsStore = defineStore(
  'recommendations-store',
  () => {
    /* TABLE */
    const table = storeToRefs(useTable())

    const {
      isLoading: isLoadingTableRecommendations,
      data: tableRecommendations,
    } = useCustomQuery<Recommendation[]>({
      queryKey: [
        'recommendations',
        table.page,
        table.perPage,
        table.filterValue,
        table.sortBy,
        table.sortOrder,
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
    /* ./ TABLE */

    /////
    return {
      /* TABLE */
      tableRecommendations,
      isLoadingTableRecommendations,
      /* ./ TABLE */
    }
  },
)
