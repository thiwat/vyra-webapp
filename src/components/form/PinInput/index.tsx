import { useContext, useRef } from 'react'
import { FormContext } from '../Form'
import { PinInputProps } from './types'

/**
 * OTP / PIN boxes (dependency-free; react-pin-input bundles React 16 and breaks on React 19).
 * Typing moves forward, Backspace moves back, paste fills all boxes.
 * Inside a <Form>, submits the form when complete (autoSubmit).
 */
const PinInput = ({
  value = '',
  length = 6,
  type = 'numeric',
  secret,
  disabled,
  autoSubmit = true,
  onChange
}: PinInputProps) => {
  const { form } = useContext(FormContext)
  const refs = useRef<(HTMLInputElement | null)[]>([])

  const chars = Array.from({ length }, (_, i) => value?.[i] || '')

  const clean = (input: string) => (type == 'numeric' ? input.replace(/\D/g, '') : input)

  const emit = (next: string[]) => {
    const newValue = next.join('').slice(0, length)
    onChange?.(newValue)
    if (autoSubmit && form && newValue.length == length) {
      form.submit()
    }
  }

  const focus = (index: number) => {
    refs.current[Math.max(0, Math.min(length - 1, index))]?.focus()
  }

  const onInput = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = clean(e.target.value)
    if (!input) return

    const next = [...chars]
    // typing into a filled box replaces it; pasting/autofill spreads over the next boxes
    const incoming = input.length > 1 && chars[index] ? input.slice(1) : input
    incoming.split('').forEach((char, offset) => {
      if (index + offset < length) next[index + offset] = char
    })
    emit(next)
    focus(index + incoming.length)
  }

  const onKeyDown = (index: number) => (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key == 'Backspace') {
      e.preventDefault()
      const next = [...chars]
      if (next[index]) {
        next[index] = ''
      } else if (index > 0) {
        next[index - 1] = ''
        focus(index - 1)
      }
      emit(next)
    }
    if (e.key == 'ArrowLeft') focus(index - 1)
    if (e.key == 'ArrowRight') focus(index + 1)
  }

  const onPaste = (index: number) => (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pasted = clean(e.clipboardData.getData('text'))
    if (!pasted) return
    const next = [...chars]
    pasted.split('').forEach((char, offset) => {
      if (index + offset < length) next[index + offset] = char
    })
    emit(next)
    focus(index + pasted.length)
  }

  return (
    <div className={'flex flex-row justify-between gap-2'}>
      {chars.map((char, index) => (
        <input
          key={index}
          ref={el => {
            refs.current[index] = el
          }}
          value={char}
          disabled={disabled}
          type={secret ? 'password' : 'text'}
          inputMode={type == 'numeric' ? 'numeric' : 'text'}
          autoComplete={index == 0 ? 'one-time-code' : 'off'}
          aria-label={`pin ${index + 1}`}
          onChange={onInput(index)}
          onKeyDown={onKeyDown(index)}
          onPaste={onPaste(index)}
          onFocus={e => e.target.select()}
          className={
            'pin-input w-[45px] h-[45px] min-w-0 rounded-[5px] text-center header-base bg-primary/10 outline-none focus:ring-1 focus:ring-primary disabled:opacity-50 group-[.field-error]:ring-1 group-[.field-error]:ring-error'
          }
        />
      ))}
    </div>
  )
}

export default PinInput
