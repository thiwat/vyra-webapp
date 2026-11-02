import { useState } from 'react'
import Modal from '../Modal'
import { PreviewImageProps } from './types'

/** Wrap a thumbnail; click opens the full image in a Modal. */
const PreviewImage = ({ children, src }: PreviewImageProps) => {
  const [open, setOpen] = useState<boolean>(false)

  const onToggle = () => setOpen(prev => !prev)

  return (
    <>
      <div className={'cursor-pointer'} onClick={onToggle}>
        {children}
      </div>
      <Modal
        open={open}
        modalClassName={'w-fit max-w-[400px]'}
        closeOnPressBackdrop
        onClose={onToggle}
      >
        <img src={src} alt={''} className={'w-full max-h-[80vh] rounded-md'} />
      </Modal>
    </>
  )
}

export default PreviewImage
