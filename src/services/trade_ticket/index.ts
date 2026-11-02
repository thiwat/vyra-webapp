import { useRequest } from 'ahooks'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { requestPlaceTrade, requestTradePreview } from '@/apis/client/trading'
import { Trade, TradeInput, TradePlan } from '@/apis/client/trading/types'
import { useOverviewStateValue } from '@/atoms/overview'
import { useForm, useWatch } from '@/components/form/Form'
import { TicketValues } from './types'

const PREVIEW_DEBOUNCE_MS = 120

export const INITIAL_TICKET: TicketValues = {
  symbol: 'ETHUSDT',
  side: 'long',
  entry_type: 'market',
  stop_mode: 'pct',
  stop_value: 0.9,
  risk_reward: 2,
  leverage: 5
}

export const toTradeInput = (values: Partial<TicketValues>): TradeInput | null => {
  const stop = +values.stop_value
  const reward = +values.risk_reward
  const leverage = +values.leverage
  if (!values.symbol || !(stop > 0) || !(reward > 0) || !(leverage >= 1)) return null
  const entry = +values.entry_price
  if (values.entry_type == 'limit' && !(entry > 0)) return null
  return {
    symbol: values.symbol,
    side: values.side,
    entry_type: values.entry_type,
    entry_price: values.entry_type == 'limit' ? entry : undefined,
    stop_loss_pct: values.stop_mode == 'pct' ? stop : undefined,
    stop_loss_price: values.stop_mode == 'price' ? stop : undefined,
    risk_reward: reward,
    leverage
  }
}

const newClientOrderId = () => `vyra-${crypto.randomUUID().replace(/-/g, '').slice(0, 24)}`

/** Terminal controller. The server sizes every trade; the browser only displays its answer. */
const useTradeTicket = () => {
  const router = useRouter()
  const [form] = useForm<TicketValues>()
  const watched = useWatch([], form) as TicketValues
  const values = { ...INITIAL_TICKET, ...watched }
  const { data: overview } = useOverviewStateValue()
  const [review, setReview] = useState<{ plan: TradePlan; input: TradeInput; id: string } | null>(
    null
  )
  const [result, setResult] = useState<Trade | null>(null)

  const previewRequest = useRequest(requestTradePreview, {
    manual: true,
    debounceWait: PREVIEW_DEBOUNCE_MS
  })
  const placeRequest = useRequest(requestPlaceTrade, { manual: true, onSuccess: setResult })

  const input = toTradeInput(values)
  const inputKey = JSON.stringify(input)
  const markPrice = overview?.mark_prices?.[values.symbol]
  const hasPreview = !!input

  useEffect(() => {
    if (input) previewRequest.run(input)
  }, [
    inputKey,
    markPrice,
    overview?.discipline?.can_open,
    overview?.discipline?.next_trade_risk_budget
  ])

  const onPreview = () => {
    if (!previewRequest.data?.ok || !input) return
    setResult(null)
    setReview({ plan: previewRequest.data, input, id: newClientOrderId() })
  }

  const onConfirm = () =>
    placeRequest.run({ ...review.input, client_order_id: review.id, confirm: true })

  const onCloseReview = () => {
    setReview(null)
    setResult(null)
  }

  const onViewPosition = () => {
    onCloseReview()
    router.push('/positions')
  }

  return {
    form,
    values,
    plan: hasPreview ? previewRequest.data : undefined,
    markPrice,
    review,
    result,
    placing: placeRequest.loading,
    onPreview,
    onConfirm,
    onCloseReview,
    onViewPosition
  }
}

export default useTradeTicket
