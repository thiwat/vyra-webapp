import _get from 'lodash/get'
import _isString from 'lodash/isString'
import qs from 'qs'

export const qsStringify = (data: object | string): string => {
  if (_isString(data)) return encodeURIComponent(data as string)
  try {
    const val = qs.stringify(data, { strictNullHandling: true })
    return encodeURIComponent(val)
  } catch {
    return ''
  }
}

export const qsParse = (value: string): any => {
  if (!value) return undefined
  const decodeValue = decodeURIComponent(value)
  return qs.parse(decodeValue, { strictNullHandling: true })
}

/**
 * Build the list query string of the backend contract:
 * `page`, `page_size`, `keywords`, `filter` (qs-encoded object), `sort` ("field" | "-field").
 */
export const buildQuery = (query: object): string => {
  const q = {
    page: _get(query, 'page', 1),
    page_size: _get(query, 'page_size', 10),
    keywords: encodeURIComponent(_get(query, 'keywords', '') || ''),
    filter: _get(query, 'filter', ''),
    sort: _get(query, 'sort', '') || ''
  }

  if (q.filter) {
    q.filter = qsStringify(q.filter)
  }

  return Object.entries(q)
    .map(i => `${i[0]}=${i[1]}`)
    .join('&')
}
