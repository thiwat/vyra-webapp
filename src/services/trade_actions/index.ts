import { useRequest } from 'ahooks'
import toast from 'react-hot-toast'
import { requestCloseTrade, requestOverview, requestRetryProtection } from '@/apis/client/trading'
import { Trade } from '@/apis/client/trading/types'
import { useSetOverviewState } from '@/atoms/overview'
import Modal from '@/components/ui/Modal'
import { t } from '@/utils/translate'

/** Position actions shared by Dashboard, Positions and the alert banner. */
const useTradeActions = () => {
  const setOverview = useSetOverviewState()
  const { run: refresh } = useRequest(requestOverview, {
    manual: true,
    onSuccess: overview => setOverview({ data: overview })
  })

  const closeRequest = useRequest(requestCloseTrade, {
    manual: true,
    onSuccess: () => {
      toast.success(t('trading_closed'))
      refresh()
    }
  })

  const retryRequest = useRequest(requestRetryProtection, {
    manual: true,
    onSuccess: trade => {
      if (trade.status == 'open') toast.success(t('trading_protection_ok'))
      refresh()
    }
  })

  const onClose = (trade: Trade) =>
    Modal.confirm({
      title: t('trading_close_title', { symbol: trade.symbol }),
      description: t('trading_close_detail'),
      confirmLabel: t('trading_close_confirm'),
      cancelLabel: t('trading_close_cancel'),
      onConfirm: () => closeRequest.run({ trade_id: trade.id })
    })

  return {
    closing: closeRequest.loading,
    retrying: retryRequest.loading,
    onClose,
    onRetry: (trade: Trade) => retryRequest.run({ trade_id: trade.id })
  }
}

export default useTradeActions
