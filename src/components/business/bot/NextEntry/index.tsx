import { BotNextEntry } from '@/apis/client/bot/types'
import { formatAmount, formatSigned } from '@/utils/trading'
import { t } from '@/utils/translate'

/** One line per entry level, e.g. "Short < 84.66 (−1.35%)". */
const NextEntry = ({ next, className = '' }: { next: BotNextEntry | null; className?: string }) => {
  if (!next) return null
  if (next.blocked == 'too_volatile') {
    return (
      <span className={`paragraph-small num ${className}`}>
        {t('bot_next_too_volatile', { atr: formatAmount(next.atr_pct * 100) })}
      </span>
    )
  }
  const levels = [
    { label: t('bot_next_long'), sign: '>', price: next.long_above, pct: next.long_distance_pct },
    { label: t('bot_next_short'), sign: '<', price: next.short_below, pct: next.short_distance_pct }
  ].filter(l => l.price)
  return (
    <span className={`paragraph-small num flex flex-col ${className}`}>
      {levels.map(l => (
        <span key={l.label}>
          {`${l.label} ${l.sign} ${formatAmount(l.price, l.price < 10 ? 4 : 2)}`}
          {l.pct !== undefined && ` (${formatSigned(l.pct)}%)`}
        </span>
      ))}
    </span>
  )
}

export default NextEntry
