import { createPortal } from 'react-dom'
import Icon from '../Icon'
import confirm from './Confirm'
import warn from './Warning'
import { ModalProps } from './types'

/**
 * Controlled modal: <Modal open={open} onClose={...}>...</Modal>
 * Imperative helpers: Modal.confirm({ title, description, onConfirm }) / Modal.warn({ ... })
 */
const Modal = ({
  open,
  children,
  closeOnPressBackdrop,
  modalClassName = '',
  root,
  onClose
}: ModalProps) => {
  if (!open || typeof document === 'undefined') return null

  const modalRoot = document.getElementById(root || 'modal-root') || document.body

  return createPortal(
    <div className={'fixed inset-0 flex justify-center items-center z-[999]'}>
      <div className={'w-full h-full relative'}>
        <div
          className={'w-full h-full bg-neutral-400/50 backdrop-blur-sm'}
          onClick={closeOnPressBackdrop ? onClose : undefined}
        />
        <div
          className={`bg-card min-w-[300px] max-w-[calc(100vw-24px)] rounded-md shadow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${modalClassName}`}
        >
          <div className={'w-full h-full relative'}>
            {onClose && (
              <div
                onClick={onClose}
                className={'absolute top-1.5 right-1.5 px-1.5 pt-0.5 pb-1.5 cursor-pointer'}
              >
                <Icon name={'X'} size={22} className={'text-icon'} />
              </div>
            )}
            <div>{children}</div>
          </div>
        </div>
      </div>
    </div>,
    modalRoot
  )
}

Modal.confirm = confirm
Modal.warn = warn

export default Modal
