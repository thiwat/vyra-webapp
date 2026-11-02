import Form, { FormItem } from '@/components/form/Form'
import Input from '@/components/form/Input'
import Button from '@/components/ui/Button'
import useLogin from '@/services/login'
import { normalizeUsername } from '@/utils/normalize'
import { t } from '@/utils/translate'

const LoginForm = () => {
  const { form, loading, onLogin } = useLogin()

  return (
    <div className={'px-3 pt-6 pb-8'}>
      <Form form={form} name={'login-form'} onFinish={onLogin}>
        <div className={'space-y-1'}>
          <FormItem
            label={t('login_username')}
            name={'username'}
            normalize={normalizeUsername}
            required
          >
            <Input autoComplete={'username'} />
          </FormItem>
          <FormItem label={t('login_password')} name={'password'} required>
            <Input type={'password'} />
          </FormItem>
        </div>
        <div className={'mt-6'}>
          <Button type={'primary'} htmlType={'submit'} disabled={loading}>
            {t('login_button_submit')}
          </Button>
        </div>
      </Form>
    </div>
  )
}

export default LoginForm
