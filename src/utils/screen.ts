/** Tailwind `md` breakpoint (768px). Below it the app uses the mobile layout. */
export const MOBILE_BREAKPOINT = 768

export const getIsMobile = (width: number): boolean => {
  return width < MOBILE_BREAKPOINT
}
