import _isEmpty from 'lodash/isEmpty'
import Link from 'next/link'
import { ACCOUNT_MENU } from '@/constants/menu'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import Drawer from '@/components/ui/Drawer'
import Icon from '@/components/ui/Icon'
import useHeader from '@/hooks/header'
import useMenu from '@/hooks/menu'
import useProfile from '@/services/profile'
import { t } from '@/utils/translate'

const AVATAR_FALLBACK = '/images/default-profile.svg'

/** Mobile hamburger + Drawer: profile summary, menu (with expandable children), account actions. */
const MobileMenu = () => {
  const router = useRouter()
  const { open, onToggleOpen } = useHeader()
  const { menu, openKeys, getIsActive, onClick } = useMenu()
  const { profile, onChangePassword, onLogout } = useProfile()

  useEffect(() => {
    if (open) onToggleOpen()
  }, [router.asPath])

  const itemClass = (href: string) =>
    getIsActive(href) ? 'body-strong !text-primary bg-primary/10' : 'body-base hover:bg-plane'

  return (
    <>
      <button
        type={'button'}
        aria-label={'menu'}
        className={'p-1.5 cursor-pointer'}
        onClick={onToggleOpen}
      >
        <Icon name={'List'} size={26} className={'text-icon'} />
      </button>
      <Drawer open={open} onClose={onToggleOpen}>
        <div className={'flex flex-col min-h-full'}>
          <div className={'flex flex-row items-center px-4 pt-10 pb-4 border-b border-line'}>
            <img
              src={profile?.profile_image || AVATAR_FALLBACK}
              alt={''}
              className={'h-[52px] w-[52px] rounded-full bg-plane object-cover'}
            />
            <div className={'px-3 min-w-0'}>
              <div className={'header-base truncate'}>
                {[profile?.first_name, profile?.last_name].filter(Boolean).join(' ') ||
                  profile?.username}
              </div>
              <div className={'tagline-base truncate'}>{profile?.email || profile?.mobile_no}</div>
            </div>
          </div>
          <div className={'flex-1 px-2 py-3 space-y-1'}>
            {menu.map(i => {
              if (_isEmpty(i.children)) {
                return (
                  <Link key={i.href} href={i.href}>
                    <div
                      className={`p-2 rounded flex flex-row items-center space-x-2 ${itemClass(i.href)}`}
                    >
                      <Icon name={i.icon} size={22} />
                      <span>{i.label}</span>
                    </div>
                  </Link>
                )
              }

              const isOpen = openKeys.includes(i.href)

              return (
                <div key={i.href}>
                  <div
                    className={`p-2 cursor-pointer rounded flex flex-row items-center space-x-2 ${itemClass(i.href)}`}
                    onClick={() => onClick(i.href)}
                  >
                    <Icon name={i.icon} size={22} />
                    <div className={'flex-1'}>{i.label}</div>
                    <Icon
                      name={'CaretDown'}
                      size={16}
                      className={`transition-all ${isOpen ? 'rotate-180' : ''}`}
                    />
                  </div>
                  {isOpen && (
                    <div className={'pl-4 py-1'}>
                      {i.children.map(j => (
                        <Link key={j.href} href={j.href}>
                          <div
                            className={`flex flex-row items-center space-x-2 py-2 border-l-2 pl-3 ${getIsActive(j.href) ? 'border-primary !text-primary body-strong' : 'border-line body-base'}`}
                          >
                            <Icon name={j.icon} size={20} />
                            <span>{j.label}</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
          <div className={'px-2 py-3 border-t border-line space-y-1'}>
            {ACCOUNT_MENU.map(i => (
              <Link
                key={i.href}
                href={i.href}
                onClick={onToggleOpen}
                className={
                  'p-2 rounded flex flex-row items-center space-x-2 body-base hover:bg-plane'
                }
              >
                <Icon name={i.icon} size={22} />
                <span>{i.label}</span>
              </Link>
            ))}
            <div
              className={
                'p-2 rounded flex flex-row items-center space-x-2 body-base cursor-pointer hover:bg-plane'
              }
              onClick={() => {
                onToggleOpen()
                onChangePassword()
              }}
            >
              <Icon name={'Password'} size={22} />
              <span>{t('profile_button_change_password')}</span>
            </div>
            <div
              className={
                'p-2 rounded flex flex-row items-center space-x-2 body-base !text-error cursor-pointer hover:bg-plane'
              }
              onClick={() => {
                onToggleOpen()
                onLogout()
              }}
            >
              <Icon name={'SignOut'} size={22} />
              <span>{t('profile_button_logout')}</span>
            </div>
          </div>
        </div>
      </Drawer>
    </>
  )
}

export default MobileMenu
