import styles from './BasicLayout.module.css'

interface Props {
  children?: React.ReactNode
}

function BasicLayout({ children }: Props) {
  return (
    <main className={styles.block}>
      {children}
      <div className="test">test</div>
    </main>
  )
}

export default BasicLayout
