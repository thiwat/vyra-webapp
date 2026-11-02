import { Entity } from '@/enums/entity'

export type ListServiceProps = {
  entity: Entity | string
  /** Always AND-ed with the user filter, e.g. { status: 'active' } */
  baseFilter?: any
  /** Sort when the URL has no `s`, e.g. `-created_at` */
  defaultSort?: string
  /** Default page size when the URL has no `ps` (default 10) */
  defaultPageSize?: number
  /** Row key used for bulk selection (default `code`) */
  keyData?: string
  /** Do not fetch on mount; call onRefresh() yourself */
  manual?: boolean
}
