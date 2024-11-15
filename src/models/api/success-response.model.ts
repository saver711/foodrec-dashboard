export type SuccessResponse<D> = {
  message: string
  data: D
  pagination?: {
    total: number
    currentPage: number
    pageSize: number
  }
}
