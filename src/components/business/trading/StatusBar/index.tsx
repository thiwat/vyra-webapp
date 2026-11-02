import { useOverviewStateValue } from '@/atoms/overview'
import { formatAmount, formatClock, formatSigned, pnlClass } from '@/utils/trading'
import { t } from '@/utils/translate'

const Item = ({
  label,
  value,
  className = ''
}: {
  label: string
  value: string
  className?: string
}) => (
  <div className={'whitespace-nowrap'}>
    <div className={'tagline-small leading-none'}>{label}</div>
    <div className={`num text-[12px] mt-0.5 ${className || '!text-font-dark'}`}>{value}</div>
  </div>
)

const StatusBar = () => {
  const { data, offline } = useOverviewStateValue()
  if (!data?.mode) return null

  const { discipline, rules } = data
  const connected = data.connected && !offline

  return (
    <div className={'hidden xl:flex flex-row items-center gap-4'}>
      <span
        className={`text-[11px] px-1.5 py-0.5 rounded whitespace-nowrap ${connected ? 'bg-success/15 !text-success' : 'bg-error/15 !text-error'}`}
      >
        {`● ${t(connected ? 'trading_connected' : 'trading_disconnected')}`}
      </span>
      <div className={'hidden 2xl:block'}>
        <Item label={t('trading_session')} value={formatClock(discipline.session_seconds)} />
      </div>
      <div className={'hidden 2xl:contents'}>
        <Item
          label={t('trading_trades')}
          value={`${discipline.trades_taken}/${rules.max_trades_per_day}`}
        />
        <Item
          label={t('trading_today')}
          value={formatSigned(discipline.daily_realized_pnl)}
          className={pnlClass(discipline.daily_realized_pnl)}
        />
      </div>
      <div className={'hidden 2xl:block'}>
        <Item
          label={t('trading_loss_left')}
          value={formatAmount(discipline.daily_loss_remaining)}
        />
      </div>
    </div>
  )
}

export default StatusBar
