import { Link } from "react-router-dom";
import HeroSection from "../components/HeroSection";
import FeatureSection from "../components/FeatureSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeatureSection />
      
        <div
        id="get-started"
        className="flex flex-col items-center gap-6 py-16"
        >
        <h2 className="text-3xl font-bold text-white">
            Get Started
        </h2>

        <div className="flex gap-6">
            <Link to="/text" className="px-6 py-3 bg-blue-500 rounded-lg">
            Text Compression
            </Link>

            <Link to="/image" className="px-6 py-3 bg-purple-500 rounded-lg">
            Image Compression
            </Link>
        </div>
        </div>
    </>
  );
}