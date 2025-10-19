import styles from "./navBar.module.css";

function Navbar({ isOpen }) {
  const navClasses = `${styles.navbar} ${isOpen ? styles.open : ""}`;

  return (
    <nav className={navClasses}>
      <ul>
        <li>
          <a href="/">Home</a>
        </li>
        <li>
          <a href="/ShadowDetect">Shadow Detect</a>
        </li>
        <li>
          <a href="/contact">Contact</a>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
