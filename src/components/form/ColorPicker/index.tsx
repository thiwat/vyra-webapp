import { ColorPickerProps } from './types'

/** OPTIONAL: hex color control using the native color input (no extra dependency). */
const ColorPicker = ({ value, disabled, onChange }: ColorPickerProps) => {
  const color = value || '#ff0000'

  return (
    <label
      className={`h-[34px] flex flex-row items-center w-fit ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
    >
      <span
        className={'relative h-[28px] w-[28px] border border-line rounded overflow-hidden'}
        style={{ background: color }}
      >
        <input
          type="color"
          value={color}
          disabled={disabled}
          onChange={e => onChange?.(e.target.value)}
          className={'absolute inset-0 opacity-0 cursor-pointer'}
        />
      </span>
      <span className={'paragraph-base ml-2'}>{color}</span>
    </label>
  )
}

export default ColorPicker
