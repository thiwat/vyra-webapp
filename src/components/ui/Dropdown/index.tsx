import _isEmpty from 'lodash/isEmpty'
import RCDropdown from 'rc-dropdown'
import { useState } from 'react'
import { t } from '@/utils/translate'
import Icon from '../Icon'
import { DropdownOption, DropdownProps } from './types'

const PLACEMENT = {
  'top-right': 'topRight',
  'bottom-left': 'bottomLeft',
  'bottom-right': 'bottomRight'
} as const

/** Click-to-open action menu (rc-dropdown). */
const Dropdown = ({ alignment = 'bottom-left', children, options, onClick }: DropdownProps) => {
  const [open, setOpen] = useState<boolean>(false)

  const _onClick = (option: DropdownOption) => () => {
    setOpen(false)
    onClick(option.value)
  }

  const overlay = (
    <div
      className={
        'min-w-[140px] max-h-[300px] overflow-y-auto no-scrollbar mt-1 bg-card shadow rounded border border-line'
      }
    >
      {options.map(i => (
        <div
          key={i.value}
          className={
            'paragraph-base whitespace-nowrap flex flex-row items-center space-x-2 hover:bg-primary/10 cursor-pointer px-3 py-2'
          }
          onClick={_onClick(i)}
        >
          {!!i.icon && <Icon name={i.icon as any} size={18} className={'text-icon'} />}
          <span>{i.label}</span>
        </div>
      ))}
      {_isEmpty(options) && (
        <div className={'px-3 py-6 text-center paragraph-base'}>{t('common_no_options')}</div>
      )}
    </div>
  )

  return (
    <RCDropdown
      trigger={['click']}
      visible={open}
      onVisibleChange={setOpen}
      placement={PLACEMENT[alignment]}
      overlay={overlay}
      overlayStyle={{ zIndex: 1000 }}
    >
      <div className={'cursor-pointer'}>{children}</div>
    </RCDropdown>
  )
}

export default Dropdown
