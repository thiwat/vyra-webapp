import { useState } from 'react'
import Icon from '../Icon'
import { CollapseProps } from './types'

const Collapse = ({ title, children, defaultOpen = true }: CollapseProps) => {
  const [open, setOpen] = useState<boolean>(defaultOpen)

  const onToggleOpen = () => setOpen(prev => !prev)

  return (
    <div className={'bg-card shadow rounded-lg'}>
      <div className={'px-4 md:px-6 py-5 flex flex-row justify-between items-center'}>
        <div className={'header-bold'}>{title}</div>
        <div
          onClick={onToggleOpen}
          className={
            'h-[32px] w-[32px] cursor-pointer rounded-md bg-plane flex items-center justify-center'
          }
        >
          <Icon
            name={'CaretDown'}
            size={16}
            className={`text-icon transition-all duration-300 ${open ? 'rotate-180' : ''}`}
          />
        </div>
      </div>
      <div
        className={'grid transition-all duration-300'}
        style={{
          gridTemplateRows: open ? '1fr' : '0fr'
        }}
      >
        <div className={'overflow-hidden'}>
          <div className={'px-4 md:px-6 pb-5'}>{children}</div>
        </div>
      </div>
    </div>
  )
}

export default Collapse
