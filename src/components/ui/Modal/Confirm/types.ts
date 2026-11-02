export type ConfirmModalProps = {
  title?: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  onClose?: () => void
  onConfirm?: () => void
}
