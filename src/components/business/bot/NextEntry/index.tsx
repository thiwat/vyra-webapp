import { BotNextEntry } from '@/apis/client/bot/types'
import { formatAmount, formatSigned } from '@/utils/trading'
import { t } from '@/utils/translate'

// Within this distance the level gets an amber highlight.
const NEAR_PCT = 0.5
// Pills carry their own dark background so they read on green, red or grey tiles.
const PILL = 'tagline-small px-1 rounded bg-black/40 mr-1.5'

/** One line per level: "[S] < 84.66 −1.35%". The price hides on narrow tiles. */
const NextEntry = ({ next, className = '' }: { next: BotNextEntry | null; className?: string }) => {
  if (!next) return null
  if (next.blocked == 'too_volatile') {
    return (
      <span className={`paragraph-small num ${className}`}>
        <span className={`${PILL} !text-font-dark`}>WAIT</span>
        {t('bot_next_too_volatile', { atr: formatAmount(next.atr_pct * 100) })}
      </span>
    )
  }
  const levels = [
    { side: 'L', sign: '>', price: next.long_above, pct: next.long_distance_pct, color: '!text-success' },
    { side: 'S', sign: '<', price: next.short_below, pct: next.short_distance_pct, color: '!text-error' }
  ].filter(l => l.price)
  return (
    <span className={`paragraph-small num flex flex-col gap-0.5 ${className}`}>
      {levels.map(l => (
        <span key={l.side} className={'whitespace-nowrap'}>
          <span className={`${PILL} ${l.color}`}>{l.side}</span>
          <span className={'hidden md:inline mr-1.5'}>
            {`${l.sign} ${formatAmount(l.price, l.price < 10 ? 4 : 2)}`}
          </span>
          {l.pct !== undefined && (
            <span className={Math.abs(l.pct) < NEAR_PCT ? '!text-warning' : ''}>
              {formatSigned(l.pct)}%
            </span>
          )}
        </span>
      ))}
    </span>
  )
}

export default NextEntry
