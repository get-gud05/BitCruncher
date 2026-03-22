import React from "react";
import FeatureCard from "./FeatureCard";
import { FaBolt, FaLock, FaCogs } from "react-icons/fa";

export default function FeaturesSection() {
  const features = [
    {
      icon: <FaBolt />,
      title: "Fast Encoding",
      description: "Encode large strings instantly.",
    },
    {
      icon: <FaLock />,
      title: "Secure & Reliable",
      description: "Your data is safe while encoding.",
    },
    {
      icon: <FaCogs />,
      title: "Tree-Based Encoding",
      description: "Uses a binary tree to assign optimal codes for each character, maximizing compression efficiency.",
    },
  ];

  return (
    <section className="max-w-6xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-3 gap-8">
      {features.map((feature, idx) => (
        <FeatureCard
          key={idx}
          icon={feature.icon}
          title={feature.title}
          description={feature.description}
        />
      ))}
    </section>
  );
}