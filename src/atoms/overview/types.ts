import { Overview } from '@/apis/client/trading/types'

export type OverviewState = {
  data?: Overview
  /** The backend itself stopped answering (not just the exchange). */
  offline?: boolean
}
