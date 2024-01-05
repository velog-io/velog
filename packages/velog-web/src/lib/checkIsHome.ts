export const checkIsHome = (pathname: string) =>
  pathname === '/' || ['/recent', '/trending', '/feed'].includes(pathname)
