import React from "react";
import SoundWave from "./SoundWave"; // optional animated background

const HeroSection = () => {
  const scrollToEncoder = () => {
    const element = document.getElementById("encoder");
    if (element) element.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="min-h-screen flex items-center justify-center text-center relative overflow-hidden pt-20">
      {/* Background gradients */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at top right, rgba(79,70,229,0.15), transparent 40%), radial-gradient(circle at bottom left, rgba(236,72,153,0.15), transparent 40%)",
        }}
      />
      
      {/* Optional animated background */}
      <SoundWave />

      <div className="container mx-auto px-6 z-10">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight text-white text-glow">
          Huffman <span className="bg-gradient-to-r from-gray-400 via-gray-200 to-white bg-clip-text text-transparent">Encoding</span>
        </h1>
        <h2 className="mt-4 text-2xl md:text-4xl font-light text-gray-300">
          Fast. Efficient. Modern.
        </h2>
        <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-400">
          Encode your strings securely and efficiently using Huffman Coding. Experience a modern, interactive, and sleek interface built with React and Tailwind CSS.
        </p>
        <button
          onClick={scrollToEncoder}
          className="mt-10 inline-block bg-gradient-to-r from-gray-700 to-gray-500 text-white font-semibold py-3 px-8 rounded-full shadow-lg hover:scale-105 transition-transform"
        >
          Try It Now
        </button>
      </div>
    </section>
  );
};

export default HeroSection;