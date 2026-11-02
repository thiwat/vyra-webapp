import { useRequest } from 'ahooks'
import toast from 'react-hot-toast'
import { requestRevokeToken } from '@/apis/client/auth'
import { requestMyProfile, requestUpdateMyProfile } from '@/apis/client/user'
import { useProfileState } from '@/atoms/profile'
import ChangePassword from '@/components/business/profile/ChangePassword'
import Modal from '@/components/ui/Modal'
import { LOGIN_PATH } from '@/constants/auth'
import { t } from '@/utils/translate'

/** Current user: view/update profile, change password (modal), logout (confirm). */
const useProfile = () => {
  const [profile, setProfile] = useProfileState()

  const profileRequest = useRequest(requestMyProfile, {
    manual: true,
    onSuccess: r => {
      setProfile(r)
    }
  })

  const updateRequest = useRequest(requestUpdateMyProfile, {
    manual: true,
    onSuccess: r => {
      setProfile(prev => ({ ...prev, ...r }))
      toast.success(t('profile_update_success'))
    }
  })

  const revokeRequest = useRequest(requestRevokeToken, {
    manual: true,
    onFinally: () => {
      setProfile({})
      window.location.assign(LOGIN_PATH)
    }
  })

  const onGetProfile = () => {
    profileRequest.run()
  }

  const onLogout = () => {
    Modal.confirm({
      title: t('profile_logout_title'),
      description: t('profile_logout_description'),
      onConfirm: () => revokeRequest.run()
    })
  }

  const onChangePassword = () => {
    ChangePassword.open({})
  }

  const onUpdateProfile = (values: any) => {
    updateRequest.run({
      data: {
        first_name: values?.first_name,
        last_name: values?.last_name,
        email: values?.email,
        mobile_no: values?.mobile_no
      }
    })
  }

  return {
    profile,
    loading: profileRequest.loading,
    updating: updateRequest.loading,
    onChangePassword,
    onGetProfile,
    onLogout,
    onUpdateProfile
  }
}

export default useProfile
