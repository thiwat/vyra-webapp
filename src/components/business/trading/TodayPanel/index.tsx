import { useOverviewStateValue } from '@/atoms/overview'
import Button from '@/components/ui/Button'
import useTradeActions from '@/services/trade_actions'
import { formatAmount, formatClock, formatSigned, pnlClass } from '@/utils/trading'
import { t } from '@/utils/translate'
import Panel from '../Panel'

const Meter = ({ label, value, used }: { label: string; value: string; used: number }) => (
  <div>
    <div className={'flex flex-row justify-between gap-3 paragraph-small mb-1'}>
      <span>{label}</span>
      <span className={'num !text-font-dark'}>{value}</span>
    </div>
    <div className={'h-[4px] bg-line rounded overflow-hidden'}>
      <div
        className={`h-full transition-all ${used >= 90 ? 'bg-error' : used >= 60 ? 'bg-warning' : 'bg-font-dark'}`}
        style={{ width: `${Math.min(100, Math.max(0, used))}%` }}
      />
    </div>
  </div>
)

const TodayPanel = () => {
  const { data } = useOverviewStateValue()
  const { onEndSession } = useTradeActions()
  if (!data) return null

  const { discipline, rules, active_trade: trade } = data
  const lossLimit = rules.max_daily_loss_usdt
  // Without a balance every limit reads 0, which is not a real lockout.
  const status = !data.connected
    ? 'offline'
    : discipline.locked
      ? 'locked'
      : trade
        ? 'in_trade'
        : discipline.cooldown_seconds
          ? 'cooldown'
          : !discipline.trades_remaining
            ? 'limit'
            : discipline.can_open
              ? 'ready'
              : 'idle'

  return (
    <Panel
      title={
        <>
          {t('dashboard_today')}
          <span className={'tagline-small ml-2'}>{t(`dashboard_status_${status}`)}</span>
        </>
      }
      action={
        discipline.session_active && (
          <div>
            <Button size={'small'} onClick={() => onEndSession()}>
              {t('dashboard_end_session')}
            </Button>
          </div>
        )
      }
    >
      <div className={'p-3.5 grid gap-3.5'}>
        <div>
          <div className={'tagline-small'}>{t('dashboard_pnl')}</div>
          <div
            className={`num text-[24px] leading-tight ${pnlClass(discipline.daily_realized_pnl) || '!text-font-dark'}`}
          >
            {formatSigned(discipline.daily_realized_pnl)}
          </div>
        </div>
        <Meter
          label={t('dashboard_loss_left')}
          value={`${formatAmount(discipline.daily_loss_remaining)} / ${formatAmount(lossLimit)}`}
          used={lossLimit ? 100 - (discipline.daily_loss_remaining / lossLimit) * 100 : 0}
        />
        <Meter
          label={t('dashboard_trades_left')}
          value={`${discipline.trades_remaining} / ${rules.max_trades_per_day}`}
          used={(discipline.trades_taken / rules.max_trades_per_day) * 100}
        />
        <Meter
          label={t('dashboard_session')}
          value={`${formatClock(discipline.session_seconds)} / ${formatClock(discipline.session_limit_seconds)}`}
          used={(discipline.session_seconds / discipline.session_limit_seconds) * 100}
        />
        {!!discipline.cooldown_seconds && (
          <div className={'flex flex-row justify-between paragraph-small !text-warning'}>
            <span>{t('dashboard_cooldown')}</span>
            <span className={'num'}>{formatClock(discipline.cooldown_seconds)}</span>
          </div>
        )}
        <div className={'flex flex-row justify-between paragraph-small'}>
          <span>{t('dashboard_next_budget')}</span>
          <span className={'num !text-font-dark'}>
            {formatAmount(discipline.next_trade_risk_budget)} USDT
          </span>
        </div>
      </div>
    </Panel>
  )
}

export default TodayPanel
