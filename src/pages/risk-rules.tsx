import { useOverviewStateValue } from '@/atoms/overview'
import Panel, { InfoRow } from '@/components/business/trading/Panel'
import Form, { FormItem } from '@/components/form/Form'
import Input from '@/components/form/Input'
import Select from '@/components/form/Select'
import Button from '@/components/ui/Button'
import useSettings from '@/services/settings'
import { t } from '@/utils/translate'

const GROUPS = [
  {
    title: 'risk_group_trade',
    fields: [
      ['risk_per_trade_pct', 'settings_max_risk'],
      ['max_notional_pct', 'settings_max_notional'],
      ['min_stop_pct', 'settings_min_stop'],
      ['slippage_pct', 'settings_slippage'],
      ['default_leverage', 'settings_leverage']
    ]
  },
  {
    title: 'risk_group_daily',
    fields: [
      ['daily_loss_pct', 'settings_max_daily'],
      ['max_trades_per_day', 'settings_max_trades']
    ]
  },
  {
    title: 'risk_group_session',
    fields: [
      ['session_hours', 'settings_session'],
      ['cooldown_minutes', 'settings_cooldown']
    ]
  }
]

const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div
    className={
      'flex flex-row items-center justify-between gap-6 px-3.5 py-2 border-b border-line last:border-b-0'
    }
  >
    <span className={'paragraph-small'}>{label}</span>
    <div className={'w-[180px]'}>{children}</div>
  </div>
)

const RiskRulesPage = () => {
  const { form, pendingDay, saving, onSubmit } = useSettings()
  const { data } = useOverviewStateValue()
  const locked = !!data?.connected && data?.discipline?.locked

  return (
    <div className={'w-full max-w-[760px] mx-auto'}>
      <Form form={form} name={'risk-rules'} disabled={locked} onFinish={onSubmit}>
        <div className={'grid gap-3.5'}>
          {GROUPS.map(group => (
            <Panel key={group.title} title={t(group.title)}>
              {group.fields.map(([name, label]) => (
                <Row key={name} label={t(label)}>
                  <FormItem name={name} noStyle>
                    <Input type={'number'} allowDecimal />
                  </FormItem>
                </Row>
              ))}
              {group.title == 'risk_group_trade' && (
                <Row label={t('settings_symbol')}>
                  <FormItem name={'default_symbol'} noStyle>
                    <Select
                      options={(data?.symbols || []).map(s => ({
                        label: s.symbol,
                        value: s.symbol
                      }))}
                    />
                  </FormItem>
                </Row>
              )}
            </Panel>
          ))}
          <div className={'flex flex-row items-center justify-between gap-4'}>
            <span className={'paragraph-small'}>
              {pendingDay ? t('settings_pending', { day: pendingDay }) : t('settings_risk_note')}
            </span>
            <div>
              <Button type={'primary'} htmlType={'submit'} disabled={saving || locked}>
                {t('trading_save')}
              </Button>
            </div>
          </div>
          <Panel title={t('settings_fixed')}>
            <div className={'px-3.5 py-2'}>
              <InfoRow label={t('settings_max_positions')} value={'1'} />
              <InfoRow label={t('settings_leverage_cap')} value={'5x'} />
              <InfoRow label={t('settings_session_rule')} value={'1'} />
              <InfoRow label={t('settings_sl_tp_edit')} value={t('settings_sl_tp_edit_value')} />
              <InfoRow label={t('settings_margin_mode')} value={t('settings_isolated')} />
              <InfoRow label={t('settings_position_mode')} value={t('settings_one_way')} />
              <InfoRow label={t('settings_day_reset')} value={t('settings_day_reset_value')} />
            </div>
          </Panel>
        </div>
      </Form>
    </div>
  )
}

export default RiskRulesPage
