import { ColumnType } from '@/enums/table'

export type TableColumnProps = {
  label?: string
  keyData: string
  fixed?: 'left' | 'right'
  align?: 'left' | 'center' | 'right'
  type?: ColumnType
  width?: number
  sorter?: boolean
  /** ColumnType.badge: value -> color */
  colors?: Record<string, string>
  defaultValue?: any
  /** ColumnType.badge: label = t(`${prefixTranslate}${value}`) */
  prefixTranslate?: string
  renderer?: (values: any, index: number) => React.ReactNode
  header?: () => React.ReactNode
}

export type TableProps = {
  allowBulk?: boolean
  data?: any[]
  /** Row key used by bulk select (default `code`) */
  keyData?: string
  selected?: any[]
  sort?: string
  loading?: boolean
  columns: TableColumnProps[]
  rowFormat?: (row: any, index: number) => React.CSSProperties
  rowCondition?: (row: any) => string
  onRowClick?: (row: any) => void
  onSort?: (value: string) => void
  onSelect?: (value: string, all?: boolean) => void
}

export type PaginateProps = {
  page: number
  total: number
  onChange: (value: number) => void
}

export type TablePageInfo = {
  current: number
  pageSize: number
  total: number
  totalPage: number
}

export type TableFooterProps = {
  pageInfo?: TablePageInfo
  onChangePage?: (page: number) => void
  onChangePageSize?: (size: number) => void
}
