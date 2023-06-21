import styles from './BasicLayout.module.css'

interface Props {
  children?: React.ReactNode
}

function BasicLayout({ children }: Props) {
  return (
    <main className={styles.block}>
      {children}
      <div className={styles.test}>
        test
        <div className="innder-test">inner-test</div>
      </div>
    </main>
  )
}

export default BasicLayout
