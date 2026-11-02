import _isEmpty from 'lodash/isEmpty'
import Icon from '@/components/ui/Icon'
import useUpload from '@/hooks/upload'
import { t } from '@/utils/translate'
import { UploadProps } from './types'

/**
 * Drag & drop / pick a file -> base64 value `{ file_name, size, image_data, file_type, ... }`.
 * Send it with `apis/client/attachment.requestUpload` (or inside the entity payload) on save.
 */
const Upload = ({
  name,
  id,
  value,
  path,
  disabled,
  description,
  accept,
  isFile,
  onBlur,
  onChange
}: UploadProps) => {
  const inputId = name || id || 'upload'

  const { dragOver, preventEvent, onDrop, onDragLeave, onDragOver } = useUpload({
    path,
    accept,
    onBlur,
    onChange
  })

  const onRemove = e => {
    e.preventDefault()
    if (disabled) return
    onChange?.(undefined)
    onBlur && onBlur()
  }

  const haveValue = !_isEmpty(value)
  const borderClass = 'border-line border-dashed group-[.field-error]:border-error'

  return (
    <div
      className={`overflow-hidden rounded-lg w-full border ${borderClass} ${dragOver ? 'bg-primary/15' : 'bg-card'} ${disabled ? 'opacity-60' : ''}`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDragEnter={preventEvent}
      onDrop={disabled ? preventEvent : onDrop}
    >
      <label htmlFor={inputId} className={'flex flex-col items-center w-full h-full'}>
        <div
          className={
            'relative overflow-hidden w-full h-full flex flex-col justify-center items-center'
          }
        >
          {!haveValue && (
            <>
              <Icon name={'UploadSimple'} size={48} className={'text-primary mt-6'} />
              <div className={'header-base mt-3 text-center px-3'}>{t('common_upload_title')}</div>
              <div className={'tagline-base my-3'}>{t('common_upload_description')}</div>
              <div
                className={`flex px-4 justify-center items-center w-full min-w-[150px] max-w-[200px] header-field-title rounded-full h-[36px] bg-primary !text-white ${disabled ? 'cursor-not-allowed' : 'cursor-pointer hover:opacity-90'}`}
              >
                {t('common_upload_button_upload')}
              </div>
              <div className={'tagline-base whitespace-pre-line text-center mt-4 pb-6 px-3'}>
                {description}
              </div>
            </>
          )}
          {haveValue && !isFile && (
            <>
              <img
                src={value?.url || value?.image_data}
                alt={value?.file_name || ''}
                className={'h-full w-full object-cover min-h-[200px] max-h-[400px]'}
              />
              {!disabled && (
                <div
                  onClick={onRemove}
                  className={
                    'cursor-pointer absolute top-1 right-1 bg-black/70 rounded-full p-1.5 text-white hover:text-error'
                  }
                >
                  <Icon name={'Trash'} size={18} />
                </div>
              )}
            </>
          )}
          {haveValue && isFile && (
            <div className={'flex flex-row items-center w-full px-3 py-2'}>
              <div className={'flex flex-row items-center flex-1 overflow-hidden'}>
                <Icon name={'File'} className={'text-icon'} size={44} />
                <div className={'flex-1 ml-3 overflow-x-hidden'}>
                  <div className={'body-strong truncate'}>{value?.file_name}</div>
                  {!!value?.size && (
                    <div className={'tagline-base'}>
                      {t('common_upload_file_size', { size: Math.round(value.size / 1000) })}
                    </div>
                  )}
                </div>
              </div>
              {!disabled && (
                <div
                  onClick={onRemove}
                  className={
                    'cursor-pointer bg-black/50 rounded-full p-1.5 text-white hover:text-error'
                  }
                >
                  <Icon name={'Trash'} size={18} />
                </div>
              )}
            </div>
          )}
        </div>
        <input
          type="file"
          id={inputId}
          className={'hidden'}
          onChange={onDrop}
          disabled={disabled}
          accept={_isEmpty(accept) ? '' : accept.join(', ')}
        />
      </label>
    </div>
  )
}

export default Upload
