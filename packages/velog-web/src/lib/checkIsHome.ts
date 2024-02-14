export const checkIsHome = (pathname: string) =>
  pathname === '/' || ['/recent', '/trending', '/feed'].some((path) => pathname.includes(path))
