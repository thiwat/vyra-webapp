import Logo from '@/components/ui/Logo'
import { t } from '@/utils/translate'
import { LayoutProps } from '../types'

const LoginLayout = ({ children }: LayoutProps) => {
  return (
    <div className={'w-full min-h-dvh flex items-center justify-center px-4 md:px-24 bg-plane'}>
      <div
        className={
          'bg-card border border-line w-full md:max-w-[380px] rounded-lg px-3 py-3 flex flex-col'
        }
      >
        <div className={'px-3 pt-6'}>
          <Logo />
          <p className={'paragraph-small mt-2 italic'}>{t('brand_tagline')}</p>
        </div>
        {children}
      </div>
    </div>
  )
}

export default LoginLayout
