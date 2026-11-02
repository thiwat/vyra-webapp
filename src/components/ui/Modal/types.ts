export type ModalProps = {
  open?: boolean
  children: React.ReactNode
  modalClassName?: string
  closeOnPressBackdrop?: boolean
  /** id of the portal element (default `modal-root`) */
  root?: string
  onClose?: () => void
}
