import { describe, expect, it } from 'vitest'
import { setTranslate, t } from './translate'

describe('utils/translate', () => {
  it('returns the dictionary value', () => {
    expect(t('login_button_submit')).toBe('เข้าสู่ระบบ')
  })

  it('interpolates ${ } placeholders', () => {
    expect(t('common_table_total_records', { count: 5 })).toBe('5 รายการ')
  })

  it('falls back to the key when missing', () => {
    expect(t('unknown_key')).toBe('unknown_key')
  })

  it('setTranslate merges new keys', () => {
    setTranslate({ order_title: 'คำสั่งซื้อ ${ no }' })
    expect(t('order_title', { no: 'A1' })).toBe('คำสั่งซื้อ A1')
    expect(t('login_button_submit')).toBe('เข้าสู่ระบบ')
  })
})
