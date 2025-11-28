import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ShadowDetect from "./pages/ShadowDetect";
import Navigate from "./pages/navigate";
import Header from "./components/Header"; // 1. Import your new component
import NewNav from "./components/NewNav";

function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
         <NewNav />
        <Routes>
          <Route index element={<HomePage />} />
          <Route path="/ShadowDetect" element={<ShadowDetect />} />
          <Route path="/navigate" element={<Navigate />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
