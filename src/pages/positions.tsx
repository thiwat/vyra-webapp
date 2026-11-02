import { useOverviewStateValue } from '@/atoms/overview'
import Panel, { EmptyState } from '@/components/business/trading/Panel'
import Button from '@/components/ui/Button'
import Table from '@/components/ui/Table'
import useTradeActions from '@/services/trade_actions'
import { formatAmount, formatSigned, pnlClass, sideClass, unrealizedPnl } from '@/utils/trading'
import { t } from '@/utils/translate'

const PositionsPage = () => {
  const { data } = useOverviewStateValue()
  const { closing, onClose } = useTradeActions()
  if (!data) return null

  const trade = data.active_trade
  const position = data.positions.find(p => p.symbol == trade?.symbol)
  const mark = data.mark_prices[trade?.symbol]
  const pending = ['pending_entry', 'entry_unknown'].includes(trade?.status)
  const margin = position
    ? (Math.abs(position.quantity) * position.entry_price) / (trade.leverage || 1)
    : 0
  const protection = !trade?.stop_loss_confirmed
    ? { label: t('positions_no_sl'), className: 'bg-error/15 !text-error' }
    : trade?.take_profit_confirmed
      ? { label: t('positions_sl_tp_ok'), className: 'bg-success/15 !text-success' }
      : { label: t('positions_no_tp'), className: 'bg-warning/15 !text-warning' }

  return (
    <div className={'grid gap-3.5'}>
      <Panel
        title={t('positions_open')}
        action={
          <div>
            <Button
              size={'small'}
              type={'danger_primary'}
              disabled={!trade || closing}
              onClick={onClose}
            >
              {pending ? t('trading_close_entry') : t('trading_emergency_close')}
            </Button>
          </div>
        }
      >
        {position ? (
          <Table
            data={[{ ...position, side: trade.side }]}
            columns={[
              { label: t('positions_symbol'), keyData: 'symbol' },
              {
                label: t('positions_side'),
                keyData: 'side',
                renderer: row => (
                  <span className={sideClass(row.side)}>{row.side.toUpperCase()}</span>
                )
              },
              {
                label: t('positions_size'),
                keyData: 'quantity',
                align: 'right',
                renderer: row => (
                  <span className={'num'}>{formatAmount(Math.abs(row.quantity), 3)}</span>
                )
              },
              {
                label: t('positions_entry'),
                keyData: 'entry_price',
                align: 'right',
                renderer: row => <span className={'num'}>{formatAmount(row.entry_price)}</span>
              },
              {
                label: t('positions_mark'),
                keyData: 'mark',
                align: 'right',
                renderer: () => <span className={'num'}>{formatAmount(mark)}</span>
              },
              {
                label: t('positions_margin'),
                keyData: 'margin',
                align: 'right',
                renderer: () => <span className={'num'}>{formatAmount(margin)}</span>
              },
              {
                label: t('positions_upnl'),
                keyData: 'upnl',
                align: 'right',
                renderer: row => {
                  const pnl = unrealizedPnl(row.side, row.entry_price, mark, Math.abs(row.quantity))
                  return <span className={`num ${pnlClass(pnl)}`}>{formatSigned(pnl)}</span>
                }
              },
              {
                label: t('positions_protection'),
                keyData: 'protection',
                renderer: () => (
                  <span className={`tagline-small px-1.5 py-0.5 rounded ${protection.className}`}>
                    {protection.label}
                  </span>
                )
              }
            ]}
          />
        ) : (
          <EmptyState
            title={pending ? t('positions_pending_entry') : t('positions_none')}
            detail={pending ? t('review_pending') : t('positions_none_detail')}
          />
        )}
      </Panel>
      <Panel
        title={t('positions_protective')}
        action={<span className={'tagline-small'}>{t('positions_protective_note')}</span>}
      >
        {data.algo_orders.length ? (
          <Table
            data={data.algo_orders}
            columns={[
              { label: t('positions_symbol'), keyData: 'symbol' },
              {
                label: t('positions_order'),
                keyData: 'order',
                renderer: row =>
                  row.type == 'stop_market' ? t('positions_stop') : t('positions_take')
              },
              {
                label: t('positions_type'),
                keyData: 'type',
                renderer: row => row.type.toUpperCase()
              },
              {
                label: t('positions_trigger'),
                keyData: 'trigger_price',
                align: 'right',
                renderer: row => <span className={'num'}>{formatAmount(row.trigger_price)}</span>
              },
              {
                label: t('positions_status'),
                keyData: 'status',
                renderer: () => (
                  <span
                    className={'tagline-small px-1.5 py-0.5 rounded bg-success/15 !text-success'}
                  >
                    {t('positions_accepted')}
                  </span>
                )
              }
            ]}
          />
        ) : (
          <EmptyState title={t('positions_no_orders')} detail={t('positions_no_orders_detail')} />
        )}
      </Panel>
    </div>
  )
}

export default PositionsPage
