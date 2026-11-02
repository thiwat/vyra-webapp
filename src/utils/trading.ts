/** Decimals implied by an exchange tick or step, e.g. 0.01 -> 2. */
export const decimalsOf = (step: number): number =>
  step >= 1 ? 0 : Math.ceil(-Math.log10(step) - 1e-9)

export const formatAmount = (value: number, decimals = 2): string =>
  (value || 0).toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  })

export const formatSigned = (value: number, decimals = 2): string => {
  const amount = formatAmount(Math.abs(value), decimals)
  if (+amount.replace(/,/g, '') === 0) return amount
  return `${value > 0 ? '+' : '−'}${amount}`
}

export const formatClock = (seconds: number): string =>
  [seconds / 3600, (seconds / 60) % 60, seconds % 60]
    .map(v => String(Math.floor(v)).padStart(2, '0'))
    .join(':')

export const pnlClass = (value: number): string =>
  value > 0 ? '!text-success' : value < 0 ? '!text-error' : ''

export const sideClass = (side: string): string =>
  side == 'long' ? '!text-success' : '!text-error'

export const unrealizedPnl = (
  side: string,
  entry: number,
  mark: number,
  quantity: number
): number => (mark - entry) * quantity * (side == 'long' ? 1 : -1)
