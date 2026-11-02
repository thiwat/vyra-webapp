import _get from 'lodash/get'
import { Fragment, useState } from 'react'
import { TabProps, TabsProps } from './types'

/** Controlled (`active` + `onChange`) or uncontrolled tabs. */
const Tabs = ({ active: controlledActive, tabs = [], onChange }: TabsProps) => {
  const [innerActive, setInnerActive] = useState<string>(_get(tabs, '0.key'))

  const active = controlledActive ?? innerActive

  const _onChange = (tab: TabProps) => () => {
    if (tab.disabled) return
    setInnerActive(tab.key)
    onChange && onChange(tab.key)
  }

  return (
    <div className={'overflow-hidden h-full'}>
      <div
        className={'flex flex-row items-center border-b border-b-line overflow-x-auto no-scrollbar'}
      >
        {tabs.map((i, index) => {
          const labelClass =
            i.key == active
              ? '!text-primary body-strong'
              : i.disabled
                ? '!text-disabled body-base'
                : '!text-font body-base'

          const cursorClass = i.disabled ? 'cursor-not-allowed' : 'cursor-pointer'

          return (
            <Fragment key={i.key}>
              <div onClick={_onChange(i)} className={'flex-1 relative'}>
                <div
                  className={`w-full px-3 py-2 h-full flex justify-center items-center whitespace-nowrap text-sm ${labelClass} ${cursorClass}`}
                >
                  {i.title}
                </div>
                {i.key == active && (
                  <div className={'w-full h-[3px] bg-primary absolute bottom-0'} />
                )}
              </div>
              {index + 1 != tabs.length && <div className={'w-px h-4 bg-line'} />}
            </Fragment>
          )
        })}
      </div>
      <div>
        {tabs.map(i => (
          <div key={i.key} className={`h-full ${i.key == active ? 'flex' : 'hidden'}`}>
            {i.children}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Tabs
