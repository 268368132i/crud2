export const routesInfo = {
  home: {
    route: '/',
    title: 'Home'
  },
  items_all: {
    route: '/item/all',
    title: 'Items',
  },
  item_edit: {
    route: '/item/:id/edit',
    title: ''
  },
  auditories_all: {
    route: '/auditory/all',
    title: 'Locations',
  },
  auditory_edit: {
    route: '/auditory/:id/edit',
    title: ''
  },
  users_all: {
    route: '/user/all',
    title: 'System users',
  },
  login: {
    route: '/login',
    title: 'Login',
  },
  profile: {
    route: '/profile',
    title: 'My Profile'
  },
  group_all: {
    route: '/group',
    title: 'Groups'
  },
  collectionPermissions_all: {
    route: '/colperm',
    title: 'Collections\' Permissions'
  },
}

export function routeInfoToPathData (routeInfo, isActive = false) {
  return {
    route: routeInfo.route,
    name: routeInfo.title,
    isActive
  }
}
