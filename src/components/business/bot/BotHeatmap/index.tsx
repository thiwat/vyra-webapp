import { formatAmount, formatSigned, pnlClass, sideClass } from '@/utils/trading'
import { t } from '@/utils/translate'
import { BotHeatmapProps } from './types'

// Full class names so Tailwind keeps them. Shade grows with return on the bot's capital.
const SHADES = {
  up: ['bg-success/10', 'bg-success/20', 'bg-success/35', 'bg-success/50'],
  down: ['bg-error/10', 'bg-error/20', 'bg-error/35', 'bg-error/50']
}
const STEPS_PCT = [0.5, 2, 5]

const tileShade = (pct: number) => {
  if (!pct) return 'bg-line/40'
  const step = STEPS_PCT.filter(s => Math.abs(pct) >= s).length
  return SHADES[pct > 0 ? 'up' : 'down'][step]
}

const BotHeatmap = ({ rows, onTileClick }: BotHeatmapProps) => {
  const capital = rows.reduce((sum, b) => sum + (b.capital_usdt || 0), 0)
  const today = rows.reduce((sum, b) => sum + (b.pnl_today || 0), 0)
  const total = rows.reduce((sum, b) => sum + (b.pnl_total || 0), 0)
  const running = rows.filter(b => b.status == 'running').length

  return (
    <div>
      <div className={'flex flex-wrap gap-x-6 gap-y-1 px-4 py-3 border-b border-line'}>
        <span>
          {t('bot_capital')} <b className={'num'}>{formatAmount(capital)}</b>
        </span>
        <span>
          {t('bot_pnl_today')} <b className={`num ${pnlClass(today)}`}>{formatSigned(today)}</b>
        </span>
        <span>
          {t('bot_pnl_total')} <b className={`num ${pnlClass(total)}`}>{formatSigned(total)}</b>
        </span>
        <span>
          {t('bot_status_running')}{' '}
          <b className={'num'}>
            {running}/{rows.length}
          </b>
        </span>
      </div>
      <div className={'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 p-3'}>
        {rows.map(bot => {
          const pct = bot.capital_usdt ? ((bot.pnl_total || 0) / bot.capital_usdt) * 100 : 0
          const trade = bot.active_trade
          return (
            <button
              key={bot.id}
              type={'button'}
              title={bot.halt_reason || bot.last_message || ''}
              onClick={() => onTileClick?.(bot)}
              className={`text-left rounded p-3 min-h-[120px] flex flex-col gap-1 border cursor-pointer ${tileShade(pct)} ${
                bot.status == 'halted' ? 'border-error' : 'border-transparent'
              } ${bot.status == 'running' ? '' : 'opacity-60'}`}
            >
              <div className={'flex justify-between items-baseline gap-2'}>
                <span className={'body-strong'}>{bot.symbol.replace(/USDT$/, '')}</span>
                {bot.status != 'running' && (
                  <span className={`tagline-small ${bot.status == 'halted' ? '!text-error' : ''}`}>
                    {t(`bot_status_${bot.status}`)}
                  </span>
                )}
              </div>
              <span className={'paragraph-small !text-font-dark'}>
                {bot.name} · {t(`bot_strategy_${bot.strategy}`)}
              </span>
              <span className={`num text-xl mt-auto ${pnlClass(pct)}`}>
                {formatSigned(pct, 1)}%
              </span>
              <span className={'paragraph-small num'}>
                <span className={pnlClass(bot.pnl_total)}>{formatSigned(bot.pnl_total)}</span>
                {' USDT'}
                {trade && (
                  <span className={`ml-2 ${sideClass(trade.side)}`}>{trade.side.toUpperCase()}</span>
                )}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default BotHeatmap
