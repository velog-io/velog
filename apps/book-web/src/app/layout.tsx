type Props = {
  children: React.ReactNode
}

const RootLayout = ({ children }: Props) => {
  return (
    <html id="html" lang="ko">
      <body className="body" suppressHydrationWarning={true}>
        <>{children}</>
      </body>
    </html>
  )
}

export default RootLayout
