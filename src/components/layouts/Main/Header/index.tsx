import Link from 'next/link'
import AccountSwitcher from '@/components/business/trading/AccountSwitcher'
import StatusBar from '@/components/business/trading/StatusBar'
import Icon from '@/components/ui/Icon'
import Logo from '@/components/ui/Logo'
import useTheme from '@/hooks/theme'
import { ThemeMode } from '@/enums/theme'
import Menu from '../Menu'
import MobileMenu from '../MobileMenu'
import Profile from '../Profile'

const Header = () => {
  const { theme, onToggle } = useTheme()

  return (
    <header className={'sticky top-0 z-[100] bg-card shadow'}>
      <div
        className={
          'flex flex-row items-center h-[56px] w-full max-w-[1600px] mx-auto px-2 md:px-6 gap-2'
        }
      >
        <div className={'md:hidden'}>
          <MobileMenu />
        </div>
        <Link href={'/'} className={'flex flex-row items-center flex-1 md:flex-none min-w-0'}>
          <Logo />
        </Link>
        <nav className={'hidden md:flex flex-1 ml-4'}>
          <Menu />
        </nav>
        <StatusBar />
        <div className={'hidden md:block'}>
          <AccountSwitcher />
        </div>
        <button
          type={'button'}
          aria-label={'toggle theme'}
          className={'p-1.5 cursor-pointer'}
          onClick={onToggle}
        >
          <Icon
            name={theme == ThemeMode.light ? 'Sun' : 'Moon'}
            size={22}
            className={'text-icon hover:text-warning'}
          />
        </button>
        <div className={'hidden md:block'}>
          <Profile />
        </div>
      </div>
    </header>
  )
}

export default Header
