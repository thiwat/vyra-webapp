import { useRequest } from 'ahooks'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import {
  requestCreate,
  requestDelete,
  requestGet,
  requestList,
  requestUpdate
} from '@/apis/client/entity'
import { Bot } from '@/apis/client/bot/types'
import { useOverviewStateValue } from '@/atoms/overview'
import { useForm, useWatch } from '@/components/form/Form'
import Modal from '@/components/ui/Modal'
import { Entity } from '@/enums/entity'
import { t } from '@/utils/translate'

const LIST_PATH = '/bots'

const NUMBER_FIELDS = ['capital_usdt', 'risk_pct', 'max_daily_loss_pct']

/** Create or edit a bot, plus its trade history. A running bot is read-only until stopped. */
const useBotDetail = (key?: string) => {
  const router = useRouter()
  const [form] = useForm()
  const isCreate = key == 'create'
  const { data: overview } = useOverviewStateValue()
  const strategy = useWatch('strategy', form)
  const symbols = overview?.bot_symbols?.[strategy] || []

  // Each strategy trades its own symbols, so a switch may need a new one.
  useEffect(() => {
    const symbol = form.getFieldValue('symbol')
    if (symbols.length && !symbols.includes(symbol)) form.setFieldsValue({ symbol: symbols[0] })
  }, [form, symbols])

  const detailRequest = useRequest<Bot, []>(() => requestGet({ entity: Entity.bot, key }), {
    ready: !!key && !isCreate,
    refreshDeps: [key],
    onSuccess: bot => form.setFieldsValue(bot)
  })
  const tradesRequest = useRequest(
    () =>
      requestList({
        entity: Entity.trade,
        filter: { bot_id: key },
        sort: '-created_at',
        page: 1,
        page_size: 50
      }),
    { ready: !!key && !isCreate, refreshDeps: [key] }
  )

  const onSaved = () => router.push(LIST_PATH)
  const createRequest = useRequest(requestCreate, { manual: true, onSuccess: onSaved })
  const updateRequest = useRequest(requestUpdate, { manual: true, onSuccess: onSaved })
  const deleteRequest = useRequest(requestDelete, {
    manual: true,
    onSuccess: () => {
      toast.success(t('bot_deleted'))
      router.push(LIST_PATH)
    }
  })

  const onSubmit = (values: Record<string, any>) => {
    const data = { ...values }
    NUMBER_FIELDS.forEach(field => (data[field] = +values[field]))
    if (isCreate) return createRequest.run({ entity: Entity.bot, data })
    updateRequest.run({ entity: Entity.bot, key, data })
  }

  const onDelete = () =>
    Modal.confirm({
      title: t('bot_delete_title', { name: detailRequest.data?.name }),
      description: t('bot_delete_detail'),
      confirmLabel: t('bot_delete'),
      cancelLabel: t('review_cancel'),
      onConfirm: () => deleteRequest.run({ entity: Entity.bot, key })
    })

  const refresh = () => {
    detailRequest.refresh()
    tradesRequest.refresh()
  }

  return {
    form,
    isCreate,
    bot: detailRequest.data,
    symbols,
    trades: tradesRequest.data?.rows || [],
    saving: createRequest.loading || updateRequest.loading,
    onSave: () => form.submit(),
    onSubmit,
    onDelete,
    refresh
  }
}

export default useBotDetail
