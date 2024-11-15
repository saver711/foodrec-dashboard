import type { FColumnProps } from '@/components/ui/table/models/f-column-props'
import type { Recommendation } from '@/models/recommendations/recommendation.model'

export const recommendationsTableColumns: FColumnProps<keyof Recommendation>[] =
  [
    { field: '_id', header: 'ID' },
    { field: 'mealName', header: 'Meal Name', sortable: true },
    { field: 'quote', header: 'Quote' },
  ]
