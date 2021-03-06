import { accountUrl } from 'src/components/urls'
import { GlobalOutlined, BlockOutlined, BellOutlined, StarOutlined, UserOutlined, BookOutlined, PlusOutlined } from '@ant-design/icons'
import { uiShowAdvanced, advancedUrl, uiShowNotifications } from 'src/components/utils/env'

export type Divider = 'Divider'

export const Divider: Divider = 'Divider'

export type PageLink = {
  name: string
  page: string[]
  icon: React.ReactNode
  hidden?: boolean

  // Helpers
  isNotifications?: boolean
  isAdvanced?: boolean
}

type MenuItem = PageLink | Divider

export const isDivider = (item: MenuItem): item is Divider =>
  item === Divider

export const isPageLink = (item: MenuItem): item is PageLink =>
  !isDivider(item)

export const DefaultMenu: MenuItem[] = [
  {
    name: 'Explore',
    page: [ '/spaces' ],
    icon: <GlobalOutlined />
  },
  {
    name: 'Advanced',
    page: [ advancedUrl ],
    icon: <BlockOutlined />,
    hidden: !uiShowAdvanced,
    isAdvanced: true
  }
]

export const buildAuthorizedMenu = (myAddress: string): MenuItem[] => {
  const account = { address: myAddress }

  const notificationsItem = uiShowNotifications
    ? [ {
        name: 'My notifications',
        page: [ '/notifications', '/notifications' ],
        icon: <BellOutlined />,
        isNotifications: true
      } ]
    : []

  return [
    ...notificationsItem,
    {
      name: 'My subscriptions',
      page: [ '/accounts/[address]/following', accountUrl(account, 'following') ],
      icon: <StarOutlined />
    },
    {
      name: 'My profile',
      page: [ '/accounts/[address]', accountUrl(account) ],
      icon: <UserOutlined />
    },
    {
      name: 'My spaces',
      page: [ '/accounts/[address]/spaces', accountUrl(account, 'spaces') ],
      icon: <BookOutlined />
    },
    {
      name: 'New space',
      page: [ '/spaces/new', '/spaces/new' ],
      icon: <PlusOutlined />
    },
    Divider,
    ...DefaultMenu
  ]
}

