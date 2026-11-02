import { useEffect, useState } from 'react'
import { getIsMobile } from '@/utils/screen'

type ScreenSize = {
  width: number
  height: number
  isMobile: boolean
}

const getSize = (): ScreenSize => {
  if (typeof window === 'undefined') {
    // SSR: assume mobile-first until the client measures
    return { width: 0, height: 0, isMobile: true }
  }
  return {
    width: window.innerWidth,
    height: window.innerHeight,
    isMobile: getIsMobile(window.innerWidth)
  }
}

/** SSR-safe window size. Prefer Tailwind `md:` classes; use this only for structural switches. */
const useScreenSize = (): ScreenSize => {
  const [screenSize, setScreenSize] = useState<ScreenSize>(getSize)

  useEffect(() => {
    const handleResize = () => setScreenSize(getSize())

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return screenSize
}

export default useScreenSize
