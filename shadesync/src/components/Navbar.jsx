import styles from "./navBar.module.css";

function Navbar({ isOpen }) {
  const navClasses = `${styles.navbar} ${isOpen ? styles.open : ""}`;

  return (
    <nav className={navClasses}>
      <ul>
        <li><a href="/">Shadow Map</a></li>
        <li><a href="/HomePage">Analyze</a></li>
        <li><a href="/building">Building</a></li>
        <li><a href="/contact">Contact</a></li>
      </ul>
    </nav>
  );
}

export default Navbar;
