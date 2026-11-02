import { render, unmount } from '@/utils/render'
import { t } from '@/utils/translate'
import Button from '../../Button'
import Modal from '..'
import { ConfirmModalProps } from './types'

const ConfirmModal = ({
  title,
  description,
  confirmLabel,
  cancelLabel,
  onClose,
  onConfirm
}: ConfirmModalProps) => {
  return (
    <Modal open={true}>
      <div className={'px-6 py-6 flex flex-col items-center'}>
        <div className={'header-base'}>{title || t('modal_confirm_title')}</div>
        <div className={'paragraph-base text-center mt-1'}>
          {description || t('modal_confirm_description')}
        </div>
        <div className={'flex flex-row justify-between w-full space-x-3 pt-3 mt-4'}>
          <div className={'flex-1 min-w-[100px]'}>
            <Button onClick={onClose}>{cancelLabel || t('modal_button_cancel')}</Button>
          </div>
          <div className={'flex-1 min-w-[100px]'}>
            <Button type={'primary'} onClick={onConfirm}>
              {confirmLabel || t('modal_button_confirm')}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}

const confirm = ({ onClose, onConfirm, ...props }: ConfirmModalProps) => {
  if (typeof document === 'undefined') return
  const container = document.createDocumentFragment()

  const submit = () => {
    onConfirm && onConfirm()
    unmount(container)
  }

  const close = () => {
    onClose && onClose()
    unmount(container)
  }

  render(<ConfirmModal {...props} onClose={close} onConfirm={submit} />, container)
}

export default confirm
