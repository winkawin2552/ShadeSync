import { useNavigate } from "react-router-dom";
import styles from "./NewNav.module.css";
import analyzeIcon from "../assets/analyze.png";
import walkIcon from "../assets/walk.png";
import buildingIcon from "../assets/building.png";

export default function NewNav() {
  const navigate = useNavigate();

  const handleAnalyzeClick = () => {
    navigate("/");
  };

  const handlemapClick = () => {
    navigate("/Navigate");
  };

  const handlebuildingClick = () => {
    navigate("/");
  };

  return (
    <div className={styles.navContainer}>
      <nav
        className={styles.navItem}
        onClick={handleAnalyzeClick}
        style={{ cursor: "pointer" }}
      >
        <img src={analyzeIcon} className={styles.icon} alt="analyze" />
        <span className={styles.label}>Analyze</span>
      </nav>

      <nav 
        className={styles.navItem}
        onClick={handlemapClick}
        style={{ cursor: "pointer" }}
    >
        <img src={walkIcon} className={styles.icon} alt="walk" />
        <span className={styles.label}>Shadow MAP</span>
      </nav>
        
      <nav
        className={styles.navItem}
        onClick={handlebuildingClick}
        style={{ cursor: "pointer" }}
    >
        <img src={buildingIcon} className={styles.icon} alt="building" />
        <span className={styles.label}>Building</span>
      </nav>
    </div>
  );
}
