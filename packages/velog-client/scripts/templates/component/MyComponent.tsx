import styles from './MyComponent.module.css'

type Props = {}

function MyComponent({}: Props) {
  return <div className={styles.block}></div>
}

export default MyComponent
