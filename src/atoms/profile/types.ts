import { UserRole } from '@/enums/user'

export type Profile = {
  user_id?: string
  username?: string
  email?: string
  first_name?: string
  last_name?: string
  mobile_no?: string
  role?: UserRole
  profile_image?: string
}
