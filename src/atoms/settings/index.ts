import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai'
import { Settings } from './types'

export const settingsAtom = atom<Settings>({})

export const useSettingsState = () => useAtom(settingsAtom)

export const useSettingsStateValue = () => useAtomValue(settingsAtom)

export const useSetSettingsState = () => useSetAtom(settingsAtom)
