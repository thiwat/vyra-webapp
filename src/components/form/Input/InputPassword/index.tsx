import { useState } from 'react'
import Icon from '@/components/ui/Icon'
import { focusNextInput } from '@/utils/input'
import { INPUT_CLASS } from '../style'
import { InputProps } from '../types'

const InputPassword = ({
  id,
  value,
  disabled,
  placeholder,
  tabIndex,
  inputRef,
  onBlur,
  onChange
}: InputProps) => {
  const [show, setShow] = useState<boolean>(false)

  const onToggle = () => {
    setShow(prev => !prev)
  }

  const onKeyDown = e => {
    if (e.keyCode == 13) focusNextInput()
  }

  return (
    <div className={'w-full relative'}>
      <input
        id={id}
        ref={inputRef}
        value={value || ''}
        disabled={disabled}
        tabIndex={tabIndex}
        placeholder={placeholder || ''}
        autoComplete={'current-password'}
        onBlur={onBlur}
        onChange={e => onChange?.(e.target.value)}
        onKeyDown={onKeyDown}
        type={show ? 'text' : 'password'}
        className={`${INPUT_CLASS} pr-8`}
      />
      <span className={'absolute top-2 right-2 cursor-pointer text-icon'} onClick={onToggle}>
        {show ? <Icon name={'Eye'} size={18} /> : <Icon name={'EyeClosed'} size={18} />}
      </span>
    </div>
  )
}

export default InputPassword
