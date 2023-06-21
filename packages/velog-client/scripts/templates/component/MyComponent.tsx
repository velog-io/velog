import styles from './MyComponent.module.css'

interface Props {}

function MyComponent({}: Props) {
  return <div className={styles.block}></div>
}

export default MyComponent
