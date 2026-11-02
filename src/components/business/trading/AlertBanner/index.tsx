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

  const trade = data.active_trade
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

  if (trade?.status == 'entry_unknown') {
    return (
      <div role={'alert'} className={'px-5 py-2 bg-warning/15 border-b border-warning body-base'}>
        <b className={'!text-font-dark'}>{t('trading_alert_unknown')}</b>
        {` ${t('trading_alert_unknown_detail')}`}
      </div>
    )
  }

  if (trade?.status == 'unprotected') {
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
            <Button size={'small'} disabled={retrying} onClick={() => onRetry()}>
              {t('trading_retry_stop')}
            </Button>
          </div>
        )}
        <div>
          <Button size={'small'} type={'danger_primary'} disabled={closing} onClick={onClose}>
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

  if (trade?.status == 'open' && trade.actual_risk > trade.risk_limit) {
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

  if (trade?.status == 'open' && !trade.take_profit_confirmed) {
    return (
      <div role={'status'} className={'px-5 py-2 bg-warning/15 border-b border-warning body-base'}>
        <b className={'!text-font-dark'}>{t('trading_alert_no_tp', { symbol: trade.symbol })}</b>
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
