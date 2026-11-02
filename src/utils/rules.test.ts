import { describe, expect, it } from 'vitest'
import {
  validateConfirmPassword,
  validateEmail,
  validateMobileNo,
  validatePassword,
  validatePercent,
  validatePositiveNumber
} from './rules'

const run = (rule: any, value: any) => rule.validator({}, value)

describe('utils/rules', () => {
  it('validateEmail', async () => {
    await expect(run(validateEmail(), 'a@b.co')).resolves.toBeUndefined()
    await expect(run(validateEmail(), '')).resolves.toBeUndefined()
    await expect(run(validateEmail(), 'not-an-email')).rejects.toThrow('รูปแบบอีเมลไม่ถูกต้อง')
  })

  it('validateMobileNo', async () => {
    await expect(run(validateMobileNo(), '0812345678')).resolves.toBeUndefined()
    await expect(run(validateMobileNo(), '12345')).rejects.toThrow()
  })

  it('validatePassword(length)', async () => {
    await expect(run(validatePassword(8)(), '12345678')).resolves.toBeUndefined()
    await expect(run(validatePassword(8)(), '1234')).rejects.toThrow('8')
  })

  it('validateConfirmPassword compares with password / new_password', async () => {
    const form = {
      getFieldValue: (name: string) => (name == 'new_password' ? 'secret1' : undefined)
    }
    await expect(run(validateConfirmPassword(form), 'secret1')).resolves.toBeUndefined()
    await expect(run(validateConfirmPassword(form), 'other')).rejects.toThrow('รหัสผ่านไม่ตรงกัน')
  })

  it('validatePercent and validatePositiveNumber', async () => {
    await expect(run(validatePercent(), 50)).resolves.toBeUndefined()
    await expect(run(validatePercent(), 150)).rejects.toThrow()
    await expect(run(validatePositiveNumber(), 1)).resolves.toBeUndefined()
    await expect(run(validatePositiveNumber(), 0)).rejects.toThrow()
  })
})
