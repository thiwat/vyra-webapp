import { useOverviewStateValue } from '@/atoms/overview'
import Button from '@/components/ui/Button'
import useTradeActions from '@/services/trade_actions'
import { formatAmount, formatSigned, pnlClass, sideClass, unrealizedPnl } from '@/utils/trading'
import { t } from '@/utils/translate'
import Panel, { EmptyState, InfoRow } from '../Panel'

/** Every open position, view-only apart from Emergency close. */
const ActivePosition = () => {
  const { data } = useOverviewStateValue()
  const { closing, onClose } = useTradeActions()
  const trades = data?.active_trades || []

  return (
    <Panel title={t('dashboard_active_position')}>
      {trades.length ? (
        trades.map(trade => {
          const mark = data?.mark_prices?.[trade.symbol]
          const pnl = unrealizedPnl(
            trade.side,
            trade.average_entry_price,
            mark,
            trade.filled_quantity
          )
          const protectedTrade = trade.status == 'open'
          return (
            <div key={trade.id} className={'px-3.5 py-2 border-b border-line last:border-b-0'}>
              <div className={'flex flex-row items-center justify-between gap-2 mb-1'}>
                <span
                  className={`tagline-small px-1.5 py-0.5 rounded ${protectedTrade ? 'bg-success/15 !text-success' : 'bg-error/15 !text-error'}`}
                >
                  {t(protectedTrade ? 'dashboard_protected' : 'dashboard_unprotected')}
                </span>
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
              <InfoRow
                label={`${trade.symbol}${trade.source == 'bot' ? ` · ${t('bot_source')}` : ''}`}
                value={`${trade.side.toUpperCase()} · ${formatAmount(trade.filled_quantity, 3)}`}
                valueClassName={sideClass(trade.side)}
              />
              <InfoRow
                label={t('positions_upnl')}
                value={`${formatSigned(pnl)} USDT`}
                valueClassName={pnlClass(pnl)}
              />
              <InfoRow label={t('positions_stop')} value={formatAmount(trade.stop_loss_price)} />
              {!!trade.take_profit_price && (
                <InfoRow
                  label={t('positions_take')}
                  value={formatAmount(trade.take_profit_price)}
                />
              )}
            </div>
          )
        })
      ) : (
        <EmptyState title={t('dashboard_no_position')} detail={t('dashboard_no_position_detail')} />
      )}
    </Panel>
  )
}

export default ActivePosition
