import { useRouter } from 'next/router'
import Icon from '@/components/ui/Icon'
import useMenu from '@/hooks/menu'
import { t } from '@/utils/translate'

/** Page title from constants/menu, or a back link for pages listed in HIDE_MENU. */
const PageHeader = () => {
  const router = useRouter()
  const { hideMenu } = useMenu()

  if (hideMenu) {
    return (
      <div
        className={
          'flex flex-row items-center body-base cursor-pointer mb-3 w-fit hover:!text-primary'
        }
        onClick={router.back}
      >
        <Icon name={'CaretLeft'} size={16} />
        <span className={'ml-1'}>{t('common_back')}</span>
      </div>
    )
  }

  return null
}

export default PageHeader
