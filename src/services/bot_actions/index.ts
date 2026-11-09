import { useRequest } from 'ahooks'
import toast from 'react-hot-toast'
import { requestStartBot, requestStopBot } from '@/apis/client/bot'
import { Bot } from '@/apis/client/bot/types'
import Modal from '@/components/ui/Modal'
import { formatAmount } from '@/utils/trading'
import { t } from '@/utils/translate'

/** Start (after a confirm dialog) and Stop. Stopping never closes a position. */
const useBotActions = ({ onChanged }: { onChanged?: () => void } = {}) => {
  const startRequest = useRequest(requestStartBot, {
    manual: true,
    onSuccess: () => {
      toast.success(t('bot_started'))
      onChanged?.()
    }
  })
  const stopRequest = useRequest(requestStopBot, {
    manual: true,
    onSuccess: () => {
      toast.success(t('bot_stopped'))
      onChanged?.()
    }
  })

  const onStart = (bot: Bot) =>
    Modal.confirm({
      title: t('bot_start_title', { name: bot.name }),
      description: t('bot_start_detail', {
        symbol: bot.symbol,
        capital: formatAmount(bot.capital_usdt),
        risk: bot.risk_pct,
        loss: bot.max_daily_loss_pct
      }),
      confirmLabel: t('bot_start'),
      cancelLabel: t('review_cancel'),
      onConfirm: () => startRequest.run({ id: bot.id })
    })

  return {
    busy: startRequest.loading || stopRequest.loading,
    onStart,
    onStop: (bot: Bot) => stopRequest.run({ id: bot.id })
  }
}

export default useBotActions
