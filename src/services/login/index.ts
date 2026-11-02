import { useRequest } from 'ahooks'
import { useRouter } from 'next/router'
import { requestLogin } from '@/apis/client/auth'
import { useForm } from '@/components/form/Form'
import { t } from '@/utils/translate'
import { getSafeRedirect } from '@/utils/url'

/** Login page controller. On success reloads into `redirect_url` (or `/`) so `_app` SSR loads the profile. */
const useLogin = () => {
  const router = useRouter()

  const [form] = useForm()

  const loginRequest = useRequest(requestLogin, {
    manual: true,
    onSuccess: () => {
      window.location.assign(getSafeRedirect(router.query.redirect_url))
    },
    onError: () => {
      form.setErrors({
        username: t('login_invalid_username_or_password'),
        password: ''
      })
    }
  })

  const onLogin = (values: any) => {
    loginRequest.run({
      username: values.username.trim(),
      password: values.password
    })
  }

  return {
    form,
    loading: loginRequest.loading,
    onLogin
  }
}

export default useLogin
