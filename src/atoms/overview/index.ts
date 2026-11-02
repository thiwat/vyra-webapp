import { atom, useAtomValue, useSetAtom } from 'jotai'
import { OverviewState } from './types'

export const overviewAtom = atom<OverviewState>({})
export const useOverviewStateValue = () => useAtomValue(overviewAtom)
export const useSetOverviewState = () => useSetAtom(overviewAtom)
