import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ShadowDetect from "./pages/ShadowDetect";
import Header from "./components/Header"; // 1. Import your new component

function App() {
  return (
    <>
      <BrowserRouter>
        <Header />

        <Routes>
          <Route index element={<HomePage />} />
          <Route path="/ShadowDetect" element={<ShadowDetect />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
