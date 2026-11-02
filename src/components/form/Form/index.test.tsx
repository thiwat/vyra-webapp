import { act, fireEvent, render, renderHook, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import Input from '../Input'
import Form, { FormItem, useForm } from '.'

const setup = (onFinish = vi.fn()) => {
  const { result } = renderHook(() => useForm())
  const [form] = result.current

  render(
    <Form form={form} onFinish={onFinish}>
      <FormItem label={'Username'} name={'username'} required description={'help text'}>
        <Input />
      </FormItem>
      <button type={'submit'}>submit</button>
    </Form>
  )

  return { form, onFinish }
}

describe('components/form/Form', () => {
  it('renders label, required mark and description', () => {
    setup()
    expect(screen.getByText('Username')).toBeTruthy()
    expect(screen.getByText('*')).toBeTruthy()
    expect(screen.getByText('help text')).toBeTruthy()
  })

  it('shows the required error on submit and does not call onFinish', async () => {
    const { onFinish } = setup()

    fireEvent.click(screen.getByText('submit'))

    await waitFor(() => expect(screen.getByText('กรุณากรอกข้อมูล')).toBeTruthy())
    expect(onFinish).not.toHaveBeenCalled()
  })

  it('submits controlled values', async () => {
    const { onFinish } = setup()

    fireEvent.change(document.getElementById('username'), { target: { value: 'john' } })
    fireEvent.click(screen.getByText('submit'))

    await waitFor(() => expect(onFinish).toHaveBeenCalledWith({ username: 'john' }))
  })

  it('form.setErrors shows server-side errors on a field', async () => {
    const { form } = setup()

    act(() => form.setErrors({ username: 'Duplicate username' }))

    await waitFor(() => expect(screen.getByText('Duplicate username')).toBeTruthy())
  })
})
