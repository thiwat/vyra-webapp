import { useRouter } from 'next/router'
import Icon from '@/components/ui/Icon'
import useTradeCalendar from '@/services/trade_calendar'
import dayjs from '@/utils/dayjs'
import { formatSigned, pnlClass } from '@/utils/trading'
import { t } from '@/utils/translate'
import Panel from '../Panel'

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const cellClass = (pnl?: number) => {
  if (pnl > 0) return 'bg-success/10 border-success/30 hover:bg-success/15 cursor-pointer'
  if (pnl < 0) return 'bg-error/10 border-error/30 hover:bg-error/15 cursor-pointer'
  return pnl === 0 ? 'bg-plane border-line cursor-pointer' : 'border-transparent'
}

const TradeCalendar = () => {
  const router = useRouter()
  const { month, summary, cells, today, onPrevious, onNext } = useTradeCalendar()

  return (
    <Panel
      title={dayjs(`${month}-01`).locale('en').format('MMMM YYYY')}
      action={
        <div className={'flex flex-row items-center gap-1'}>
          <button
            type={'button'}
            aria-label={t('calendar_previous')}
            className={'p-1 cursor-pointer hover:!text-font-dark'}
            onClick={onPrevious}
          >
            <Icon name={'CaretLeft'} size={16} />
          </button>
          <button
            type={'button'}
            aria-label={t('calendar_next')}
            className={'p-1 cursor-pointer hover:!text-font-dark'}
            onClick={onNext}
          >
            <Icon name={'CaretRight'} size={16} />
          </button>
        </div>
      }
    >
      <div className={'p-3.5'}>
        <div className={'grid grid-cols-7 gap-1.5 mb-1.5'}>
          {WEEKDAYS.map(day => (
            <div key={day} className={'tagline-small text-center'}>
              {day}
            </div>
          ))}
        </div>
        <div className={'grid grid-cols-7 gap-1.5'}>
          {cells.map((cell, index) =>
            cell ? (
              <button
                key={cell.day}
                type={'button'}
                disabled={!cell.summary}
                onClick={() => router.push(`/journal?day=${cell.day}`)}
                className={`h-[64px] rounded border p-1.5 flex flex-col justify-between text-left ${cellClass(cell.summary?.pnl)} ${cell.day == today ? '!border-font-dark' : ''}`}
              >
                <span className={'tagline-small'}>{cell.date}</span>
                {!!cell.summary && (
                  <span className={`num text-[12px] ${pnlClass(cell.summary.pnl)}`}>
                    {formatSigned(cell.summary.pnl)}
                  </span>
                )}
              </button>
            ) : (
              <div key={`pad-${index}`} />
            )
          )}
        </div>
        <div className={'paragraph-small mt-3 flex flex-row gap-4'}>
          <span>
            {t('calendar_total')}{' '}
            <span className={`num ${pnlClass(summary?.total)}`}>
              {formatSigned(summary?.total || 0)} USDT
            </span>
          </span>
          <span>{t('calendar_win_days', { count: summary?.win_days || 0 })}</span>
          <span>{t('calendar_loss_days', { count: summary?.loss_days || 0 })}</span>
        </div>
      </div>
    </Panel>
  )
}

export default TradeCalendar
