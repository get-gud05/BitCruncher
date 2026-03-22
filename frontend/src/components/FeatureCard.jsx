import React from "react";

export default function FeatureCard({ title, description, icon }) {
  return (
    <div className="flex flex-col items-center bg-gray-800/50 backdrop-blur-md rounded-xl p-6 shadow-md text-center hover:scale-105 transition-transform">
      <div className="text-gray-100 mb-4 text-4xl">{icon}</div>
      <h3 className="text-lg font-semibold mb-2 text-white">{title}</h3>
      <p className="text-gray-300 text-sm">{description}</p>
    </div>
  );
}