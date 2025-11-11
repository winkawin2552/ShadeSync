import Map from "../components/Map";
import styles from "./homePage.module.css";

function HomePage() {
  return (
    <>
      <main style={{ padding: "0.5rem" }}>
        <div className={styles.circle}>
          <h5 style= {{color: "#595959", paddingLeft: "38px" , paddingTop: "3px"}}>AnalyzingReady</h5>
        </div>
        
      </main>
    </>
  );
}

export default HomePage;
