import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinimize } from '@fortawesome/free-solid-svg-icons';

export default function Navbar() {
  return (
    <nav className="w-full bg-gray-900/80 backdrop-blur-md border-b border-gray-700">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        <a href="#" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gray-700 flex items-center justify-center shadow-lg animate-float">
            <FontAwesomeIcon icon={faMinimize} className="text-gray-100" />
          </div>
          <span className="text-gray-100 text-xl font-bold hover:text-gray-300 transition-colors">
            BitCruncher
          </span>
        </a>
      </div>
    </nav>
  );
}