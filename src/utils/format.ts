import dayjs, { DEFAULT_TIMEZONE } from './dayjs'

/**
 * 1234.5 -> "1,234.5". With `allowDecimal`, keeps an in-progress decimal ("12." / "12.0")
 * so it can be used as the display value of a controlled number input.
 */
export const formatNumber = (value: number | string, allowDecimal?: boolean): string => {
  if (value === null || value === undefined || `${value}` === '') return ''

  const str = `${value}`

  if (allowDecimal && /^-?\d*\.0?$/.test(str)) {
    const [int] = str.split('.')
    return (+int || 0).toLocaleString('en-US') + str.slice(int.length)
  }

  if (isNaN(+value)) return ''

  return (+value).toLocaleString('en-US', {
    maximumFractionDigits: 2
  })
}

export const formatDatetime = (value: string | Date, format = 'HH:mm, DD MMM YYYY'): string => {
  if (!value) return '-'

  return dayjs(value).tz(DEFAULT_TIMEZONE).format(format)
}

export const formatDate = (value: string | Date, format = 'DD MMM YYYY'): string => {
  return formatDatetime(value, format)
}
