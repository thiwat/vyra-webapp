import { act, renderHook } from '@testing-library/react'
import { Provider } from 'jotai'
import { describe, expect, it } from 'vitest'
import { ThemeMode } from '@/enums/theme'
import { UserRole } from '@/enums/user'
import { useProfileState, useProfileStateValue, useSetProfileState } from './profile'
import { useSettingsState } from './settings'
import { useSetThemeState, useThemeStateValue } from './theme'

const wrapper = ({ children }: { children: React.ReactNode }) => <Provider>{children}</Provider>

describe('atoms (jotai)', () => {
  it('profile: state / value / setter hooks share one atom', () => {
    const { result } = renderHook(
      () => ({
        state: useProfileState(),
        value: useProfileStateValue(),
        set: useSetProfileState()
      }),
      { wrapper }
    )

    expect(result.current.value).toEqual({})

    act(() => result.current.set({ username: 'john', role: UserRole.member }))
    expect(result.current.value.username).toBe('john')
    expect(result.current.state[0].role).toBe(UserRole.member)

    act(() => result.current.state[1](prev => ({ ...prev, first_name: 'John' })))
    expect(result.current.value).toEqual({
      username: 'john',
      role: UserRole.member,
      first_name: 'John'
    })
  })

  it('theme defaults to light and can be switched', () => {
    const { result } = renderHook(
      () => ({ value: useThemeStateValue(), set: useSetThemeState() }),
      {
        wrapper
      }
    )
    expect(result.current.value).toBe(ThemeMode.light)
    act(() => result.current.set(ThemeMode.dark))
    expect(result.current.value).toBe(ThemeMode.dark)
  })

  it('each Provider has its own store', () => {
    const first = renderHook(() => useSettingsState(), { wrapper })
    act(() => first.result.current[1]({ name: 'Site A' }))

    const second = renderHook(() => useSettingsState(), { wrapper })
    expect(first.result.current[0].name).toBe('Site A')
    expect(second.result.current[0]).toEqual({})
  })
})
