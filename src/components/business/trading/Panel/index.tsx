import { EmptyStateProps, InfoRowProps, PanelProps } from './types'

const Panel = ({ title, action, className = '', children }: PanelProps) => {
  return (
    <section className={`bg-card border border-line rounded-md min-w-0 ${className}`}>
      {(!!title || !!action) && (
        <div
          className={
            'flex flex-row items-center justify-between gap-3 px-3.5 h-[42px] border-b border-line'
          }
        >
          <h2 className={'body-strong !text-font-dark'}>{title}</h2>
          {action}
        </div>
      )}
      {children}
    </section>
  )
}

export const InfoRow = ({ label, value, valueClassName }: InfoRowProps) => {
  return (
    <div
      className={
        'flex flex-row justify-between gap-3 py-1.5 border-b border-line last:border-b-0 paragraph-small'
      }
    >
      <span>{label}</span>
      <span className={`num text-right ${valueClassName || '!text-font-dark'}`}>{value}</span>
    </div>
  )
}

export const EmptyState = ({ title, detail }: EmptyStateProps) => {
  return (
    <div className={'px-4 py-9 text-center'}>
      <div className={'body-strong !text-font-dark'}>{title}</div>
      {!!detail && <div className={'paragraph-small mt-0.5'}>{detail}</div>}
    </div>
  )
}

export default Panel
