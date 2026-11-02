import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai'
import { ThemeMode } from '@/enums/theme'
import { Theme } from './types'

export const themeAtom = atom<Theme>(ThemeMode.light)

export const useThemeState = () => useAtom(themeAtom)

export const useThemeStateValue = () => useAtomValue(themeAtom)

export const useSetThemeState = () => useSetAtom(themeAtom)
