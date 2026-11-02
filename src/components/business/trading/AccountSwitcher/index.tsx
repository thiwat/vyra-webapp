import { useOverviewStateValue } from '@/atoms/overview'
import Dropdown from '@/components/ui/Dropdown'
import ExchangeLogo from '@/components/ui/ExchangeLogo'
import Icon from '@/components/ui/Icon'
import useAccountSwitch from '@/services/account_switch'

const envClass = (environment: string) =>
  environment == 'live' ? 'bg-error !text-black' : 'bg-warning/15 !text-warning'

const EnvTag = ({ environment }: { environment: string }) => (
  <span className={`num text-[11px] px-1.5 py-0.5 rounded ${envClass(environment)}`}>
    {environment.toUpperCase()}
  </span>
)

const AccountSwitcher = () => {
  const { data } = useOverviewStateValue()
  const { onSwitch } = useAccountSwitch()
  const accounts = data?.accounts || []
  const current = accounts.find(a => a.is_active)
  if (!current) return null

  const onClick = (id: string) => {
    const account = accounts.find(a => a.id == id)
    if (account && !account.is_active) onSwitch(account)
  }

  return (
    <Dropdown
      alignment={'bottom-right'}
      options={accounts.map(a => ({
        value: a.id,
        label: (
          <span className={'flex flex-row items-center gap-2 min-w-[210px]'}>
            <ExchangeLogo exchange={a.exchange} />
            <span className={'flex-1 truncate'}>{a.name}</span>
            <EnvTag environment={a.environment} />
            <span className={`w-3 !text-success ${a.is_active ? '' : 'invisible'}`}>{'✓'}</span>
          </span>
        )
      }))}
      onClick={onClick}
    >
      <div className={'flex flex-row items-center gap-2 px-2 py-1 rounded-md hover:bg-plane'}>
        <ExchangeLogo exchange={current.exchange} />
        <span className={'body-strong !text-font-dark max-w-[140px] truncate'}>{current.name}</span>
        <EnvTag environment={current.environment} />
        <Icon name={'CaretDown'} size={14} className={'text-icon'} />
      </div>
    </Dropdown>
  )
}

export default AccountSwitcher
