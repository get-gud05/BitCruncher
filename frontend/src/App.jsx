import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import TextCompression from "./pages/TextCompression";
import ImageCompression from "./pages/ImageCompression";

function App() {
  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col">
      <Navbar />

      {/* Main content */}
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/text" element={<TextCompression />} />
          <Route path="/image" element={<ImageCompression />} />
        </Routes>
      </div>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}

export default App;