export type PanelProps = {
  title?: React.ReactNode
  action?: React.ReactNode
  className?: string
  children?: React.ReactNode
}

export type InfoRowProps = {
  label: React.ReactNode
  value: React.ReactNode
  valueClassName?: string
}

export type EmptyStateProps = {
  title: string
  detail?: string
}
