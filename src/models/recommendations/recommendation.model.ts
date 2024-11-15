export type Recommendation = {
  _id: string
  quote: string
  mealName: string
  rating: number
  blogger: string
  restaurant: string
  mealDescription: string
  mealImages: string[]
  categories: string[]
  date: Date
  url: string
}
