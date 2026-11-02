export type DrawerProps = {
  open?: boolean
  /** id of the portal element (default `drawer-root`) */
  target?: string
  children: React.ReactNode
  align?: 'left' | 'right'
  onClose?: () => void
}
