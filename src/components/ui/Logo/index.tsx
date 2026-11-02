import { LogoProps } from './types'

const Logo = ({ className = '' }: LogoProps) => {
  return (
    <span className={`inline-flex flex-row items-center gap-2 ${className}`}>
      <svg viewBox={'0 0 32 32'} className={'w-[22px] h-[22px]'} aria-hidden={true}>
        <polygon points={'2,5 10,5 19.5,27 13.5,27'} fill={'#e8ebf0'} />
        <polygon points={'30,5 22,5 17.6,15.2 21.6,24.4'} fill={'#2ebd85'} />
      </svg>
      <b className={'!text-font-dark text-[16px] tracking-[0.2em] font-bold'}>{'VYRA'}</b>
      <span className={'tagline-small hidden lg:inline'}>{'Terminal'}</span>
    </span>
  )
}

export default Logo
