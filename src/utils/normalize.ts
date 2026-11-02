/* FormItem `normalize` functions: (value) => normalizedValue */

export const normalizeUsername = (value: string): string => {
  if (!value) return ''

  return value.toLowerCase().replace(/[^0-9a-z_@.-]/gi, '')
}

export const normalizeNumber = (value: string): string => {
  if (!value) return ''

  return value.replace(/[^0-9]/g, '')
}

export const normalizeMobileNo = (value: string): string => {
  return normalizeNumber(value).slice(0, 10)
}

export const normalizeTrim = (value: string): string => {
  if (!value) return ''

  return value.trim()
}
