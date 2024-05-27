export const removeCodeFromRoute = (route: string) =>
  `${route.split('-').slice(0, -1).join('-').trim()}`
