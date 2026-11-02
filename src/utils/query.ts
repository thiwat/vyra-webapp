import _reduce from 'lodash/reduce'
import { qsParse, qsStringify } from './request'

/** Encode a filter object for the URL (`?f=`): `field=<value>|field2=<qs-object>`. */
export const encodeFilter = (filter: any): string => {
  return _reduce(
    filter || {},
    (r, i, k) => {
      r.push(`${k}=${qsStringify(typeof i === 'object' && i !== null ? i : `${i}`)}`)
      return r
    },
    []
  ).join('|')
}

// qs cannot express a top-level array ("0=a&1=b"), so restore it from index keys
const toArrayIfIndexed = (value: any) => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return value
  const keys = Object.keys(value)
  return keys.length > 0 && keys.every((k, index) => k === `${index}`)
    ? keys.map(k => value[k])
    : value
}

/** Inverse of encodeFilter. Scalars come back as strings, objects/arrays via qs. */
export const decodeFilter = (filter: string): any => {
  if (!filter) return {}

  return _reduce(
    filter.split('|'),
    (r, i) => {
      const [field, value = ''] = i.split('=')
      if (!field) return r
      const decoded = decodeURIComponent(value)
      r[field] = decoded.includes('=') ? toArrayIfIndexed(qsParse(value)) : decoded
      return r
    },
    {}
  )
}
