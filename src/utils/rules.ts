import _isNumber from 'lodash/isNumber'
import { isEmail, isMobileNo } from './regex'
import { t } from './translate'

/*
 * rc-field-form rule factories. Use as `rules={[validateEmail]}` (the form instance is passed in)
 * or `rules={[validatePassword(8)]}` for parameterised ones.
 */

export const validateUsername = () => ({
  validator(_, value) {
    if (!value || value?.length >= 4) return Promise.resolve()

    return Promise.reject(new Error(t('common_error_username_length', { length: 4 })))
  }
})

export const validatePassword =
  (length = 6) =>
  () => ({
    validator(_, value) {
      if (!value || value?.length >= length) return Promise.resolve()

      return Promise.reject(new Error(t('common_error_password_length', { length })))
    }
  })

/** Matches `password` or `new_password` of the same form. */
export const validateConfirmPassword = ({ getFieldValue }) => ({
  validator(_, value) {
    if (!value || getFieldValue('password') === value || getFieldValue('new_password') === value) {
      return Promise.resolve()
    }
    return Promise.reject(new Error(t('common_error_password_not_match')))
  }
})

export const validateEmail = () => ({
  validator(_, value) {
    if (!value || isEmail(value)) return Promise.resolve()

    return Promise.reject(new Error(t('common_error_invalid_email')))
  }
})

export const validateMobileNo = () => ({
  validator(_, value) {
    if (!value || isMobileNo(value)) return Promise.resolve()

    return Promise.reject(new Error(t('common_error_invalid_mobile_no')))
  }
})

export const validatePercent = () => ({
  validator(_, value) {
    if (!value || (value >= 0 && value <= 100)) return Promise.resolve()

    return Promise.reject(new Error(t('common_error_invalid_percent')))
  }
})

export const validatePositiveNumber = () => ({
  validator(_, value) {
    if (!_isNumber(value) || value > 0) return Promise.resolve()

    return Promise.reject(new Error(t('common_error_positive_number')))
  }
})

export const validateDecimal = () => ({
  validator(_, value) {
    if (!value || parseFloat(value) == value) return Promise.resolve()

    return Promise.reject(new Error(t('common_error_invalid_format')))
  }
})
