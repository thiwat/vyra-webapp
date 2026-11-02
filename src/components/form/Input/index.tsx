import { focusNextInput } from '@/utils/input'
import InputNumber from './InputNumber'
import InputPassword from './InputPassword'
import { INPUT_CLASS } from './style'
import { InputProps } from './types'

/** Controlled text input. `type="password" | "number"` switch to the dedicated variants. */
const Input = (props: InputProps) => {
  const {
    id,
    inputRef,
    autoFocus = true,
    value,
    type,
    disabled,
    tabIndex,
    placeholder,
    maxLength,
    autoComplete,
    normalize,
    onChange,
    onBlur,
    onKeyDown
  } = props

  if (type == 'password') {
    return <InputPassword {...props} />
  }

  if (type == 'number') {
    return <InputNumber {...props} autoFocus={autoFocus} />
  }

  const _onKeyDown = e => {
    if (e.keyCode == 13 && autoFocus) {
      focusNextInput()
    }

    onKeyDown && onKeyDown(e.keyCode, value, e)
  }

  const _onChange = e => {
    const value = e.target.value
    onChange?.(normalize ? normalize(value) : value)
  }

  return (
    <input
      id={id}
      type={type == 'email' || type == 'tel' ? type : 'text'}
      value={value ?? ''}
      tabIndex={tabIndex}
      placeholder={placeholder || ''}
      disabled={disabled}
      maxLength={maxLength}
      autoComplete={autoComplete}
      ref={inputRef}
      onChange={_onChange}
      onBlur={onBlur}
      onKeyDown={_onKeyDown}
      className={`${INPUT_CLASS} truncate`}
    />
  )
}

export default Input
