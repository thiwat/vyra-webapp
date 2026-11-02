import { Profile } from '@/atoms/profile/types'

export type RequestUpdateMyProfileInput = {
  data?: Partial<Profile>
}

export type RequestChangePasswordInput = {
  current_password: string
  new_password: string
}
