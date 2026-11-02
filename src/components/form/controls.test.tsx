import { act, fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import Checkbox from './Checkbox'
import ColorPicker from './ColorPicker'
import DatePicker from './DatePicker'
import Input from './Input'
import PinInput from './PinInput'
import RadioGroup from './RadioGroup'
import Select from './Select'
import Switch from './Switch'
import Upload from './Upload'

vi.mock('next/router', () => ({ useRouter: () => ({ pathname: '/', query: {} }) }))

/** Every control follows the controlled `{ value, onChange }` contract and renders on React 19. */
describe('form controls', () => {
  it('Input number formats and emits numbers', () => {
    const onChange = vi.fn()
    render(<Input type={'number'} value={1234} onChange={onChange} />)
    const input = screen.getByDisplayValue('1,234')
    fireEvent.change(input, { target: { value: '12,345' } })
    expect(onChange).toHaveBeenCalledWith(12345)
  })

  it('Input applies normalize', () => {
    const onChange = vi.fn()
    render(<Input value={''} normalize={v => v.toUpperCase()} onChange={onChange} />)
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'abc' } })
    expect(onChange).toHaveBeenCalledWith('ABC')
  })

  it('Checkbox / Switch toggle', () => {
    const onCheck = vi.fn()
    const onSwitch = vi.fn()
    render(
      <>
        <Checkbox value={false} label={'agree'} onChange={onCheck} />
        <Switch value={true} onChange={onSwitch} />
      </>
    )
    fireEvent.click(screen.getByRole('checkbox'))
    fireEvent.click(screen.getByRole('switch'))
    expect(onCheck).toHaveBeenCalledWith(true)
    expect(onSwitch).toHaveBeenCalledWith(false)
  })

  it('RadioGroup selects an option', () => {
    const onChange = vi.fn()
    render(
      <RadioGroup
        value={'a'}
        options={[
          { label: 'A', value: 'a' },
          { label: 'B', value: 'b' }
        ]}
        onChange={onChange}
      />
    )
    fireEvent.click(screen.getByText('B'))
    expect(onChange).toHaveBeenCalledWith('b')
  })

  it('Select shows the label of the current value', () => {
    render(
      <Select
        value={2}
        options={[
          { label: 'One', value: 1 },
          { label: 'Two', value: 2 }
        ]}
      />
    )
    expect(screen.getByText('Two')).toBeTruthy()
  })

  it('DatePicker renders the formatted date value', () => {
    render(<DatePicker value={'15/01/2026'} />)
    const input = screen.getByRole('textbox') as HTMLInputElement
    expect(input.value).toContain('2026')
  })

  it('PinInput moves through boxes and handles paste', () => {
    const onChange = vi.fn()
    const { rerender } = render(<PinInput length={4} value={''} onChange={onChange} />)
    const boxes = screen.getAllByLabelText(/pin/)
    fireEvent.change(boxes[0], { target: { value: '7' } })
    expect(onChange).toHaveBeenLastCalledWith('7')
    rerender(<PinInput length={4} value={'7'} onChange={onChange} />)
    fireEvent.paste(boxes[1], { clipboardData: { getData: () => '1a23' } })
    expect(onChange).toHaveBeenLastCalledWith('7123')
  })

  it('Upload, PinInput and ColorPicker render', async () => {
    await act(async () => {
      render(
        <>
          <Upload name={'file'} />
          <PinInput length={4} />
          <ColorPicker value={'#00ff00'} />
        </>
      )
    })
    expect(screen.getByText('อัปโหลดไฟล์')).toBeTruthy()
    expect(document.querySelectorAll('.pin-input').length).toBe(4)
    expect(screen.getByText('#00ff00')).toBeTruthy()
  })
})
