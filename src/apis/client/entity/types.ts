export type RequestListInput = {
  entity: string
  page: number
  page_size: number
  keywords?: string
  filter?: any
  sort?: string
}

export type RequestGetInput = {
  entity: string
  key: string
}

export type RequestCreateInput = {
  entity: string
  data: any
}

export type RequestUpdateInput = {
  entity: string
  key: string
  data: any
}

export type RequestDeleteInput = {
  entity: string
  key: string
}
