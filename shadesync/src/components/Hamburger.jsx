import styles from "./hamburger.module.css";

function Hamburger({ onClick }) {
  return (
    <button className={styles.burgerButton} onClick={onClick}>
      <div className={styles.line}></div>
      <div className={styles.line}></div>
      <div className={styles.line}></div>
    </button>
  );
}

export default Hamburger;
