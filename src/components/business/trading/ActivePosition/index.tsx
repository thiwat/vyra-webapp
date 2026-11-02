import { useOverviewStateValue } from '@/atoms/overview'
import { formatAmount, formatSigned, pnlClass, sideClass, unrealizedPnl } from '@/utils/trading'
import { t } from '@/utils/translate'
import Panel, { EmptyState, InfoRow } from '../Panel'

const ActivePosition = () => {
  const { data } = useOverviewStateValue()
  const trade = data?.active_trade
  const mark = data?.mark_prices?.[trade?.symbol]
  const pnl = trade
    ? unrealizedPnl(trade.side, trade.average_entry_price, mark, trade.filled_quantity)
    : 0
  const protectedTrade = trade?.status == 'open'

  return (
    <Panel
      title={t('dashboard_active_position')}
      action={
        !!trade && (
          <span
            className={`tagline-small px-1.5 py-0.5 rounded ${protectedTrade ? 'bg-success/15 !text-success' : 'bg-error/15 !text-error'}`}
          >
            {t(protectedTrade ? 'dashboard_protected' : 'dashboard_unprotected')}
          </span>
        )
      }
    >
      {trade ? (
        <div className={'px-3.5 py-2'}>
          <InfoRow
            label={trade.symbol}
            value={`${trade.side.toUpperCase()} · ${formatAmount(trade.filled_quantity, 3)}`}
            valueClassName={sideClass(trade.side)}
          />
          <InfoRow
            label={t('positions_upnl')}
            value={`${formatSigned(pnl)} USDT`}
            valueClassName={pnlClass(pnl)}
          />
          <InfoRow label={t('positions_stop')} value={formatAmount(trade.stop_loss_price)} />
          <InfoRow label={t('positions_take')} value={formatAmount(trade.take_profit_price)} />
        </div>
      ) : (
        <EmptyState title={t('dashboard_no_position')} detail={t('dashboard_no_position_detail')} />
      )}
    </Panel>
  )
}

export default ActivePosition
