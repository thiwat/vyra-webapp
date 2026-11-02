import Picker from 'rc-picker'
import dayjsGenerateConfig from 'rc-picker/lib/generate/dayjs'
import thTH from 'rc-picker/lib/locale/th_TH'
import 'rc-picker/assets/index.css'
import Icon from '@/components/ui/Icon'
import dayjs, { Dayjs } from '@/utils/dayjs'
import { t } from '@/utils/translate'
import { DatePickerProps } from './types'

export const DATE_VALUE_FORMAT = 'DD/MM/YYYY'
export const TIME_VALUE_FORMAT = 'HH:mm'

const DISPLAY_FORMAT = {
  date: 'DD MMM YYYY',
  datetime: 'DD MMM YYYY HH:mm',
  time: 'HH:mm'
}

const suffixIcon = (
  <div className={'py-1.5 px-1'}>
    <Icon name={'CalendarDots'} className={'text-icon'} size={18} />
  </div>
)

const clearIcon = (
  <div className={'py-1.5 px-1 mr-5'}>
    <Icon name={'X'} className={'text-icon'} size={18} />
  </div>
)

/** rc-picker + dayjs. See types for the value format of each mode. */
const DatePicker = ({
  id,
  disabled,
  disabledHours,
  minuteStep = 15,
  placeholder,
  value,
  min,
  max,
  mode = 'date',
  onBlur,
  onChange
}: DatePickerProps) => {
  const parse = (input: any): Dayjs | null => {
    if (!input) return null
    if (mode == 'date') return dayjs(input, DATE_VALUE_FORMAT)
    if (mode == 'time') return dayjs(input, TIME_VALUE_FORMAT)
    return dayjs(input)
  }

  const serialize = (input: Dayjs | null) => {
    if (!input) return undefined
    if (mode == 'date') return input.format(DATE_VALUE_FORMAT)
    if (mode == 'time') return input.format(TIME_VALUE_FORMAT)
    return input.toDate()
  }

  const getDisabledTime = () => ({
    disabledHours: () => disabledHours || []
  })

  return (
    <Picker<Dayjs>
      id={id}
      value={parse(value)}
      onChange={(newValue: Dayjs) => {
        onChange?.(serialize(newValue))
        onBlur && setTimeout(onBlur, 0)
      }}
      generateConfig={dayjsGenerateConfig}
      inputReadOnly
      disabled={disabled}
      picker={mode == 'time' ? 'time' : 'date'}
      showTime={mode == 'datetime' ? { format: 'HH:mm', minuteStep } : mode == 'time'}
      minuteStep={minuteStep}
      showNow={false}
      needConfirm={mode == 'datetime'}
      disabledTime={disabledHours ? getDisabledTime : undefined}
      hideDisabledOptions={mode == 'time'}
      suffixIcon={suffixIcon}
      locale={thTH}
      minDate={min ? parse(min) : undefined}
      maxDate={max ? parse(max) : undefined}
      classNames={{
        popup: 'custom-picker'
      }}
      allowClear={{ clearIcon }}
      format={DISPLAY_FORMAT[mode]}
      placeholder={
        placeholder || (mode == 'time' ? t('common_select_time') : t('common_select_date'))
      }
    />
  )
}

export default DatePicker
