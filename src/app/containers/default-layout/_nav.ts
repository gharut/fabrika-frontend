import { INavData } from '@coreui/angular';


export interface ICustomNavData extends INavData {
  can?: string | string[]
}
export const navItems: ICustomNavData[] = [
  {
    name: 'Dashboard',
    url: '/dashboard',
    iconComponent: { name: 'cil-speedometer' },
    badge: {
      color: 'info',
      text: 'NEW'
    },
  },
  {
    title: true,
    name: 'Управление',
    can: ['list-users', 'list-roles', 'list-tags']
  },
  {
    name: 'Пользователи',
    url: '/users',
    icon: 'fa fa-users',
    can: 'list-users'
  },
  {
    name: 'Роли и права',
    url: '/roles',
    icon: 'fa fa-lock',
    can: 'list-roles'
  },
  {
    name: 'Расходники',
    url: '/consumables',
    icon: 'fa fa-tags',
    can: 'list-tags'
  },
  {
    name: 'Приход/Расход',
    url: '/inout',
    icon: 'fa fa-arrows-h',
    can: 'list-inout'
  },
  {
    name: 'Поставщики',
    url: '/suppliers',
    icon: 'fa fa-truck',
    can: 'list-suppliers'
  },
  {
    name: 'Услуги',
    url: '/services',
    icon: 'fa fa-server',
    can: 'list-services'
  },
  {
    name: 'Клиенты',
    url: '/clients',
    icon: 'fa fa-folder',
    can: 'list-clients'
  },
  {
    name: 'Склады',
    url: '/warehouses',
    icon: 'fa fa-folder',
    can: 'list-warehouses'
  },
  {
    name: 'Заказы',
    url: '/orders',
    icon: 'fa fa-calculator',
    can: 'list-services'
  },
];
