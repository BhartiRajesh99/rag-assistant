"use client";

import { motion } from "framer-motion";
import { Brain } from "lucide-react";
import React from "react";

export default function Footer({ theme }: { theme: boolean }) {
  const [year, setYear] = React.useState<number | null>(null);

  React.useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);
  return (
    <motion.footer
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      className={` py-6 mt-10 border-t sticky w-full top-0 z-50 shadow-lg backdrop-blur-xl transition-all duration-500 ${
        theme
          ? "border-gradient-to-r from-amber-200/20 via-gray-700/40 to-orange-200/20 bg-black/70 shadow-amber-500/5"
          : "border-gradient-to-r from-amber-300/30 via-gray-300/40 to-orange-300/30 bg-white/70 shadow-amber-500/10"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Branding */}
        <div className="text-center md:text-left">
          <div
            className={`text-lg flex justify-center md:justify-start items-center gap-1 bg-clip-text text-transparent font-serif transition-all duration-500 font-bold ${
              theme
                ? "bg-gradient-to-r from-amber-300 via-orange-400 to-amber-400"
                : "bg-gradient-to-r from-amber-600 via-orange-700 to-amber-700"
            }`}
          >
            <div
              className={`w-6 h-6 rounded flex items-center justify-center shadow-lg transition-all duration-500 ${
                theme
                  ? "bg-gradient-to-br from-amber-400 via-orange-500 to-amber-500 "
                  : "bg-gradient-to-br from-amber-500 via-orange-600 to-amber-600 "
              }`}
            >
              <Brain className="h-4 w-4 text-white animate-pulse-slow" />
            </div>
            <p>RAGify</p>
          </div>
          <p className={`text-sm text-gray-500`}>
            Upload • Search • Chat with your documents
          </p>
        </div>

        {/* Links */}
        <div className="flex gap-6 text-sm text-gray-500">
          <a
            href="#github"
            rel="noopener noreferrer"
            className="hover:text-amber-500 transition-colors"
          >
            🐙 GitHub
          </a>
          <a
            href="#features"
            className=" hover:text-amber-500 transition-colors"
          >
            ⚡ Features
          </a>
          <a href="#about" className="hover:text-amber-500 transition-colors">
            📘 About
          </a>
        </div>

        {/* Copyright */}
        <div className={`text-xs text-center text-gray-500`}>
          © {year} Ragify. Created by Raj for AI-powered
          search.
        </div>
      </div>
    </motion.footer>
  );
}
