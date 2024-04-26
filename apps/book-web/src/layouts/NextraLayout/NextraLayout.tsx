type Props = {
  children: React.ReactNode
}

// pageOpts: PageOpts
// pageProps: any
// themeConfig: ThemeConfig
// children: ReactNode

function NextraLayout({ children }: Props) {
  return <div>{children}</div>
}

export default NextraLayout
