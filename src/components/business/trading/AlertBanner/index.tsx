import { useOverviewStateValue } from '@/atoms/overview'
import Button from '@/components/ui/Button'
import useTradeActions from '@/services/trade_actions'
import { formatAmount } from '@/utils/trading'
import { t } from '@/utils/translate'

const STALE_SECONDS = 15

const AlertBanner = () => {
  const { data, offline } = useOverviewStateValue()
  const { closing, retrying, onClose, onRetry } = useTradeActions()
  if (!data) return null

  const trades = data.active_trades || []
  const unknown = trades.find(row => row.status == 'entry_unknown')
  const unprotected = trades.find(row => row.status == 'unprotected')
  const overBudget = trades.find(row => row.status == 'open' && row.actual_risk > row.risk_limit)
  // Bots leave on their exit signal, so they never have a Take Profit.
  const noTp = trades.find(
    row => row.status == 'open' && row.source != 'bot' && !row.take_profit_confirmed
  )
  const age = data.reconcile_age_seconds
  const stale = age === null || age > STALE_SECONDS

  if (!data.mode) {
    return (
      <div role={'status'} className={'px-5 py-2 bg-warning/15 border-b border-warning body-base'}>
        <b className={'!text-font-dark'}>{t('trading_alert_no_connector')}</b>
        {` ${t('trading_alert_no_connector_detail')}`}
      </div>
    )
  }

  if (offline || !data.connected) {
    return (
      <div role={'alert'} className={'px-5 py-2 bg-error/20 border-b border-error body-base'}>
        <b className={'!text-font-dark'}>{t('trading_alert_disconnected')}</b>
        {` ${t('trading_alert_disconnected_detail')}`}
      </div>
    )
  }

  if (unknown) {
    return (
      <div role={'alert'} className={'px-5 py-2 bg-warning/15 border-b border-warning body-base'}>
        <b className={'!text-font-dark'}>{t('trading_alert_unknown')}</b>
        {` ${t('trading_alert_unknown_detail')}`}
      </div>
    )
  }

  if (unprotected) {
    const trade = unprotected
    return (
      <div
        role={'alert'}
        className={
          'flex flex-row items-center gap-3 px-5 py-2 bg-error/20 border-b border-error body-base'
        }
      >
        <span className={'flex-1'}>
          <b className={'!text-font-dark'}>
            {`⚠ ${t('trading_alert_unprotected', { symbol: trade.symbol, side: trade.side.toUpperCase() })}`}
          </b>
          {` ${trade.protection_error || t('trading_alert_no_stop')}`}
          {!!trade.stop_loss_price && ` ${t('trading_alert_auto_close')}`}
        </span>
        {!!trade.stop_loss_price && (
          <div>
            <Button size={'small'} disabled={retrying} onClick={() => onRetry(trade)}>
              {t('trading_retry_stop')}
            </Button>
          </div>
        )}
        <div>
          <Button
            size={'small'}
            type={'danger_primary'}
            disabled={closing}
            onClick={() => onClose(trade)}
          >
            {t('trading_emergency_close')}
          </Button>
        </div>
      </div>
    )
  }

  if (stale) {
    return (
      <div role={'alert'} className={'px-5 py-2 bg-error/20 border-b border-error body-base'}>
        <b className={'!text-font-dark'}>{t('trading_alert_stale')}</b>
        {` ${t('trading_alert_stale_detail')}`}
      </div>
    )
  }

  if (overBudget) {
    const trade = overBudget
    return (
      <div role={'status'} className={'px-5 py-2 bg-warning/15 border-b border-warning body-base'}>
        <b className={'!text-font-dark'}>
          {t('trading_alert_over_budget', {
            risk: formatAmount(trade.actual_risk),
            limit: formatAmount(trade.risk_limit)
          })}
        </b>
        {` ${t('trading_alert_over_budget_detail')}`}
      </div>
    )
  }

  if (noTp) {
    return (
      <div role={'status'} className={'px-5 py-2 bg-warning/15 border-b border-warning body-base'}>
        <b className={'!text-font-dark'}>{t('trading_alert_no_tp', { symbol: noTp.symbol })}</b>
        {` ${t('trading_alert_no_tp_detail')}`}
      </div>
    )
  }

  if (data.discipline.locked) {
    return (
      <div role={'status'} className={'px-5 py-2 bg-warning/15 border-b border-warning body-base'}>
        <b className={'!text-font-dark'}>{t('trading_alert_locked')}</b>
        {` ${t('trading_alert_locked_detail')}`}
      </div>
    )
  }

  return null
}

export default AlertBanner
