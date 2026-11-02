import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai'
import { Profile } from './types'

export const profileAtom = atom<Profile>({})

export const useProfileState = () => useAtom(profileAtom)

export const useProfileStateValue = () => useAtomValue(profileAtom)

export const useSetProfileState = () => useSetAtom(profileAtom)
