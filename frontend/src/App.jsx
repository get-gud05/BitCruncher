import React from "react";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import FeatureSection from "./components/FeatureSection";
import HuffmanEncoder from "./components/HuffmanEncoder";

function App() {
  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen">
      <Navbar />
      <HeroSection />
      <FeatureSection />

      <section id="encoder" className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-white">Try it Now</h2>
          <p className="text-gray-300 mt-2">
            Enter your text below and get the encoded string instantly.
          </p>
        </div>
        <div className="card-glass p-6">
          <HuffmanEncoder />
        </div>
      </section>

      <footer className="text-center py-10 text-gray-400">
        &copy; 2025 BitCruncher. Built with ❤️
      </footer>
    </div>
  );
}

export default App;