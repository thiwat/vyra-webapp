import { render, unmount } from '@/utils/render'
import { t } from '@/utils/translate'
import Button from '../../Button'
import Modal from '..'
import { WarningModalProps } from './types'

const WarningModal = ({ title, description, onClose }: WarningModalProps) => {
  return (
    <Modal open={true}>
      <div className={'px-6 py-6 flex flex-col items-center'}>
        <div className={'header-base'}>{title || t('modal_warn_title')}</div>
        <div className={'paragraph-base text-center mt-1'}>
          {description || t('modal_warn_description')}
        </div>
        <div className={'flex flex-row justify-center w-full space-x-3 pt-3 mt-4'}>
          <div className={'min-w-[100px]'}>
            <Button onClick={onClose}>{t('modal_button_close')}</Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}

const warn = ({ title, description, onClose }: WarningModalProps) => {
  if (typeof document === 'undefined') return
  const container = document.createDocumentFragment()

  const close = () => {
    onClose && onClose()
    unmount(container)
  }

  render(<WarningModal title={title} description={description} onClose={close} />, container)
}

export default warn
