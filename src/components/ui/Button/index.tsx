import Icon from '../Icon'
import { ButtonProps } from './types'

const TYPE_CLASS = {
  primary: 'bg-primary !text-white hover:opacity-70 disabled:opacity-20',
  secondary: 'bg-secondary !text-white hover:opacity-80 disabled:opacity-20',
  danger: 'border border-error bg-card !text-error hover:opacity-70 disabled:opacity-30',
  danger_primary: 'bg-error !text-white hover:opacity-70 disabled:opacity-20',
  long: 'bg-success !text-black hover:opacity-80 disabled:opacity-20',
  short: 'bg-error !text-black hover:opacity-80 disabled:opacity-20',
  default: 'bg-card border border-primary !text-primary hover:opacity-70 disabled:opacity-30'
}

const LINK_CLASS = {
  primary: '!text-primary hover:!text-primary-800',
  secondary: '!text-secondary hover:opacity-80',
  danger: '!text-error hover:opacity-80',
  danger_primary: '!text-error hover:opacity-80',
  long: '!text-success hover:opacity-80',
  short: '!text-error hover:opacity-80',
  default: '!text-font hover:!text-primary'
}

const Button = ({
  children,
  className = '',
  htmlType,
  icon,
  link,
  size = 'default',
  type = 'default',
  disabled,
  tabIndex,
  setRef,
  onClick
}: ButtonProps) => {
  if (link) {
    return (
      <button
        ref={setRef}
        tabIndex={tabIndex}
        type={htmlType || 'button'}
        disabled={disabled}
        onClick={onClick}
        className={`inline-flex flex-row items-center underline header-field-title cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${LINK_CLASS[type]} ${className}`}
      >
        {!!icon && <Icon name={icon as any} size={16} className={'mr-1'} />}
        {children}
      </button>
    )
  }

  const sizeClass = size == 'small' ? 'h-[30px]' : 'h-[34px]'
  const styleClass = TYPE_CLASS[type]
  const paddingClass = !children ? 'px-2' : icon ? 'pl-2 pr-4' : 'px-4'

  return (
    <button
      ref={setRef}
      tabIndex={tabIndex}
      type={htmlType || 'button'}
      onClick={onClick}
      className={`rounded-md whitespace-nowrap cursor-pointer ${paddingClass} flex flex-row justify-center items-center w-full header-field-title ${sizeClass} ${styleClass} ${className} disabled:cursor-not-allowed`}
      disabled={disabled}
    >
      {!!icon && (
        <div className={children ? 'mr-1.5' : ''}>
          <Icon name={icon as any} size={20} />
        </div>
      )}
      {children}
    </button>
  )
}

export default Button
