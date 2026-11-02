import { useRequest } from 'ahooks'
import toast from 'react-hot-toast'
import {
  requestCloseTrade,
  requestEndSession,
  requestOverview,
  requestRetryProtection
} from '@/apis/client/trading'
import { useOverviewStateValue, useSetOverviewState } from '@/atoms/overview'
import Modal from '@/components/ui/Modal'
import { t } from '@/utils/translate'

/** Position and session actions shared by Dashboard, Positions and the alert banner. */
const useTradeActions = () => {
  const { data } = useOverviewStateValue()
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

  const endRequest = useRequest(requestEndSession, {
    manual: true,
    onSuccess: () => {
      toast.success(t('trading_session_ended'))
      refresh()
    }
  })

  const onClose = () =>
    Modal.confirm({
      title: t('trading_close_title', { symbol: data?.active_trade?.symbol }),
      description: t('trading_close_detail'),
      confirmLabel: t('trading_close_confirm'),
      cancelLabel: t('trading_close_cancel'),
      onConfirm: () => closeRequest.run()
    })

  return {
    closing: closeRequest.loading,
    retrying: retryRequest.loading,
    onClose,
    onRetry: retryRequest.run,
    onEndSession: endRequest.run
  }
}

export default useTradeActions
