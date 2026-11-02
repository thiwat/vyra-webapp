import _isEmpty from 'lodash/isEmpty'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Dropdown from '@/components/ui/Dropdown'
import Icon from '@/components/ui/Icon'
import useMenu from '@/hooks/menu'

/** Desktop (md+) inline menu. Items with children open a Dropdown. */
const Menu = () => {
  const router = useRouter()
  const { menu, getIsActive } = useMenu()

  return (
    <div className={'flex flex-row items-center gap-1'}>
      {menu.map(i => {
        const className = getIsActive(i.href)
          ? 'body-strong !text-primary bg-primary/10'
          : 'body-base hover:!text-primary'

        const content = (
          <div
            className={`flex flex-row items-center gap-1.5 px-3 py-1.5 rounded-md cursor-pointer ${className}`}
          >
            <span className={'whitespace-nowrap'}>{i.label}</span>
            {!_isEmpty(i.children) && <Icon name={'CaretDown'} size={14} />}
          </div>
        )

        if (_isEmpty(i.children)) {
          return (
            <Link key={i.href} href={i.href}>
              {content}
            </Link>
          )
        }

        return (
          <Dropdown
            key={i.href}
            options={i.children.map(j => ({ label: j.label, value: j.href, icon: j.icon }))}
            onClick={href => router.push(href)}
          >
            {content}
          </Dropdown>
        )
      })}
    </div>
  )
}

export default Menu
