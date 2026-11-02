import { useRouter } from 'next/router'
import Dropdown from '@/components/ui/Dropdown'
import Icon from '@/components/ui/Icon'
import { ACCOUNT_MENU } from '@/constants/menu'
import useProfile from '@/services/profile'
import { t } from '@/utils/translate'

const AVATAR_FALLBACK = '/images/default-profile.svg'

/** Desktop avatar + action menu. */
const Profile = () => {
  const router = useRouter()
  const { profile, onChangePassword, onLogout } = useProfile()

  const onClick = (event: string) => {
    if (event == 'change_password') return onChangePassword()
    if (event == 'logout') return onLogout()
    router.push(event)
  }

  return (
    <Dropdown
      alignment={'bottom-right'}
      options={[
        ...ACCOUNT_MENU.map(i => ({ label: i.label, value: i.href, icon: i.icon })),
        { label: t('profile_button_change_password'), value: 'change_password', icon: 'Password' },
        { label: t('profile_button_logout'), value: 'logout', icon: 'SignOut' }
      ]}
      onClick={onClick}
    >
      <div
        className={'flex flex-row items-center gap-2 pl-1 pr-2 py-1 rounded-full hover:bg-plane'}
      >
        <img
          src={profile?.profile_image || AVATAR_FALLBACK}
          alt={''}
          className={'h-[32px] w-[32px] rounded-full bg-plane object-cover'}
        />
        <span className={'body-strong max-w-[140px] truncate'}>
          {profile?.first_name || profile?.username}
        </span>
        <Icon name={'CaretDown'} size={14} className={'text-icon'} />
      </div>
    </Dropdown>
  )
}

export default Profile
