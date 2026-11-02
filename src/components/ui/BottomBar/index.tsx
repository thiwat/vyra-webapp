import { BottomBarProps } from './types'

/** Sticky bottom action bar (e.g. Save button on mobile forms). */
const BottomBar = ({ children }: BottomBarProps) => {
  return (
    <div className={'sticky bottom-0 w-full mt-auto px-3 pb-3 z-[99]'}>
      <div className={'bg-card w-full rounded-full py-1 px-1 shadow border border-line'}>
        {children}
      </div>
    </div>
  )
}

export default BottomBar
