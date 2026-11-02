import { useRequest } from 'ahooks'
import toast from 'react-hot-toast'
import { requestChangePassword } from '@/apis/client/user'
import Form, { FormItem, useForm } from '@/components/form/Form'
import Input from '@/components/form/Input'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import { render, unmount } from '@/utils/render'
import { validateConfirmPassword, validatePassword } from '@/utils/rules'
import { t } from '@/utils/translate'
import { ProfileChangePasswordProps } from './types'

const ProfileChangePassword = ({ onClose, onSuccess }: ProfileChangePasswordProps) => {
  const [form] = useForm()

  const changeRequest = useRequest(requestChangePassword, {
    manual: true,
    onSuccess: () => {
      toast.success(t('profile_change_password_success'))
      onSuccess && onSuccess()
    },
    onError: e => {
      form.setErrors({
        current_password: e.message
      })
    }
  })

  const onFinish = values => {
    changeRequest.run({
      current_password: values.current_password,
      new_password: values.new_password
    })
  }

  return (
    <Modal open={true} modalClassName={'!w-[calc(100%-24px)] !max-w-[450px]'} onClose={onClose}>
      <div className={'px-6 py-6 h-full max-h-[80vh] overflow-y-auto'}>
        <div className={'header-base mb-4'}>{t('profile_change_password')}</div>
        <Form form={form} name={'change-password-form'} onFinish={onFinish}>
          <FormItem label={t('profile_current_password')} required name={'current_password'}>
            <Input type={'password'} />
          </FormItem>
          <FormItem
            label={t('profile_new_password')}
            required
            rules={[validatePassword(6)]}
            name={'new_password'}
          >
            <Input type={'password'} />
          </FormItem>
          <FormItem
            label={t('profile_confirm_new_password')}
            required
            dependencies={['new_password']}
            rules={[validateConfirmPassword]}
            name={'confirm_new_password'}
          >
            <Input type={'password'} />
          </FormItem>
          <div className={'flex flex-row w-full space-x-3 pt-3'}>
            <div className={'flex-1'}>
              <Button onClick={onClose}>{t('modal_button_cancel')}</Button>
            </div>
            <div className={'flex-1'}>
              <Button type={'primary'} htmlType={'submit'} disabled={changeRequest.loading}>
                {t('modal_button_confirm')}
              </Button>
            </div>
          </div>
        </Form>
      </div>
    </Modal>
  )
}

/** Imperative: ChangePassword.open({ onSuccess }) */
const open = ({ onClose, onSuccess }: ProfileChangePasswordProps) => {
  if (typeof document === 'undefined') return
  const container = document.createDocumentFragment()

  const submit = () => {
    onSuccess && onSuccess()
    unmount(container)
  }

  const close = () => {
    onClose && onClose()
    unmount(container)
  }

  render(<ProfileChangePassword onClose={close} onSuccess={submit} />, container)
}

const ChangePassword = { open }

export default ChangePassword
