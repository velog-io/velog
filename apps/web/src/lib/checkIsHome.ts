export const checkIsHome = (pathname: string) =>
  pathname === '/' ||
  ['/recent', '/trending', '/feed', '/tags'].some((path) => pathname.includes(path))
