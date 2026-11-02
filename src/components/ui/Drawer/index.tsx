import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import Icon from '../Icon'
import { DrawerProps } from './types'

const Drawer = ({ open, target, children, align, onClose }: DrawerProps) => {
  const [display, setDisplay] = useState<boolean>(false)
  const [done, setDone] = useState<boolean>(false)

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>
    if (open) {
      setDisplay(true)
      timer = setTimeout(() => setDone(true), 50)
    } else {
      setDone(false)
      timer = setTimeout(() => setDisplay(false), 200)
    }
    return () => clearTimeout(timer)
  }, [open])

  if (!display || typeof document === 'undefined') return null

  const drawerRoot = document.getElementById(target || 'drawer-root') || document.body

  const classAlign =
    align === 'right' ? (done ? 'right-0' : '-right-full') : done ? 'left-0' : '-left-full'

  return createPortal(
    <div className={'fixed inset-0 flex justify-center items-center z-[999]'}>
      <div className={'w-full h-full relative'}>
        <div className={'w-full h-full bg-neutral-400/50 backdrop-blur-sm'} onClick={onClose} />
        <div
          className={`bg-card w-[85vw] max-w-[320px] h-full border-r border-line shadow absolute top-0 ${classAlign} transition-all duration-200`}
        >
          <div className={'w-full h-full relative overflow-y-auto no-scrollbar'}>
            <div className={'absolute top-1 right-1 p-2 cursor-pointer z-[1]'} onClick={onClose}>
              <Icon name={'X'} size={22} className={'text-icon'} />
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>,
    drawerRoot
  )
}

export default Drawer
