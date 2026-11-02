import _isNumber from 'lodash/isNumber'
import { formatNumber } from '@/utils/format'
import { focusNextInput } from '@/utils/input'
import { INPUT_CLASS } from '../style'
import { InputProps } from '../types'

/** Number input with thousand separators. Emits numbers (or an in-progress "12." string). */
const InputNumber = ({
  id,
  allowDecimal,
  autoFocus,
  value,
  placeholder,
  tabIndex,
  disabled,
  min,
  max,
  inputRef,
  small,
  onBlur,
  onChange,
  onKeyDown
}: InputProps) => {
  const clamp = (val: number) => {
    if (_isNumber(max)) val = Math.min(max, val)
    if (_isNumber(min)) val = Math.max(min, val)
    return val
  }

  const _onChange = e => {
    const raw: string = e.target.value
    if (raw == '') return onChange?.('')

    if (allowDecimal) {
      const cleaned = raw.replace(/[^0-9.]/g, '')
      if (/^\d*\.0?$/.test(cleaned)) return onChange?.(cleaned)
      const val = parseFloat(cleaned)
      return onChange?.(isNaN(val) ? '' : clamp(val))
    }

    const digits = raw.replace(/\D/g, '')
    if (digits == '') return onChange?.('')
    onChange?.(clamp(+digits))
  }

  const _onBlur = () => {
    if (allowDecimal && typeof value == 'string' && value !== '') {
      const val = parseFloat(value)
      onChange?.(isNaN(val) ? '' : clamp(val))
    }
    onBlur && onBlur()
  }

  const _onKeyDown = e => {
    if (e.keyCode == 13 && autoFocus) {
      focusNextInput()
    }

    onKeyDown && onKeyDown(e.keyCode, value, e)
  }

  return (
    <input
      id={id}
      ref={inputRef}
      inputMode={allowDecimal ? 'decimal' : 'numeric'}
      value={formatNumber(value ?? '', allowDecimal)}
      placeholder={placeholder || ''}
      onChange={_onChange}
      tabIndex={tabIndex}
      onBlur={_onBlur}
      onKeyDown={_onKeyDown}
      className={`${INPUT_CLASS} ${small ? '!h-[28px]' : ''}`}
      disabled={disabled}
    />
  )
}

export default InputNumber
