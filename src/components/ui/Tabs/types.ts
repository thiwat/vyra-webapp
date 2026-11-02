export type TabProps = {
  title: string
  key: string
  children?: React.ReactNode
  disabled?: boolean
}

export type TabsProps = {
  active?: any
  tabs?: TabProps[]
  onChange?: (active: any) => void
}
