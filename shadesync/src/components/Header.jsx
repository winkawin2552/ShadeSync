import { useState } from "react";
import { useLocation } from "react-router-dom";

import styles from "./header.module.css";
import logo from "../assets/logo(1).png";
import Hamburger from "./Hamburger";
import Navbar from "./Navbar";

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  let currentLogo;
  let currentTitle;

  switch (location.pathname) {
    case "/ShadowDetect":
      currentLogo = logo;
      currentTitle = "ShadowDetect";
      break;

    default:
      currentLogo = logo;
      currentTitle = "ShadeSync";
  }

  const handleNavClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.logo_container}>
          <img src={currentLogo} alt="Shadesync Logo" className={styles.logo} />
          <h2 className={styles.font_head}>{currentTitle}</h2>
        </div>
        <Hamburger onClick={handleNavClick} />
      </header>

      <Navbar isOpen={isOpen} />
    </>
  );
}

export default Header;
