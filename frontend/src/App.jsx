import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import TextCompression from "./pages/TextCompression";
import ImageCompression from "./pages/ImageCompression";
import ImageDecompression from "./pages/ImageDecompression";

function App() {
  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/text" element={<TextCompression />} />
          <Route path="/image" element={<ImageCompression />} />
          <Route path="/image-decompress" element={<ImageDecompression />} />
        </Routes>
      </div>

      <Footer />
    </div>
  );
}

export default App;