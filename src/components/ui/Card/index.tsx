import { CardProps } from './types'

const Card = ({ children, className = '' }: CardProps) => {
  return (
    <div className={`bg-card shadow rounded-lg px-4 md:px-6 pt-5 pb-3 ${className}`}>
      {children}
    </div>
  )
}

export default Card
