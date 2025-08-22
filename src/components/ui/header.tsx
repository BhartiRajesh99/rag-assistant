"use client";
import { motion } from "framer-motion";
import { Brain, Sparkles, Github, Sun, Moon } from "lucide-react";
import React from "react";
import { Button } from "./button";
import { useTheme } from "@/app/context/ThemeContext";

function Header() {
  const { isDarkMode, toggleTheme } = useTheme();
  return (
    <div>
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`border-b sticky top-0 z-50 shadow-lg backdrop-blur-xl transition-all duration-500 ${
          isDarkMode
            ? "border-gradient-to-r from-amber-200/20 via-gray-700/40 to-orange-200/20 bg-black/70 shadow-amber-500/5"
            : "border-gradient-to-r from-amber-300/30 via-gray-300/40 to-orange-300/30 bg-white/70 shadow-amber-500/10"
        }`}
      >
        <div className="container mx-auto px-4 py-6">
          <div className="flex gap-1 flex-col">
            <div className="flex items-center justify-between">
              <motion.div
                className="flex items-center gap-3"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="relative">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg transition-all duration-500 ${
                      isDarkMode
                        ? "bg-gradient-to-br from-amber-400 via-orange-500 to-amber-500 shadow-amber-500/25"
                        : "bg-gradient-to-br from-amber-500 via-orange-600 to-amber-600 shadow-amber-500/30"
                    }`}
                  >
                    <Brain className="h-6 w-6 text-white animate-pulse-slow" />
                  </div>
                  <Sparkles
                    className={`h-4 w-4 absolute -top-1 -right-1 animate-float ${
                      isDarkMode ? "text-white" : "text-black"
                    }`}
                  />
                </div>
                <div>
                  <h1
                    className={`text-3xl font-bold bg-clip-text text-transparent font-serif transition-all duration-500 ${
                      isDarkMode
                        ? "bg-gradient-to-r from-amber-300 via-orange-400 to-amber-400"
                        : "bg-gradient-to-r from-amber-600 via-orange-700 to-amber-700"
                    }`}
                  >
                    RAGify
                  </h1>
                </div>
              </motion.div>
              <div className="flex gap-2 justify-evenly">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <a
                    target="_blank"
                    href="https://github.com/BhartiRajesh99/rag-assistant"
                  >
                    <Button
                      variant="outline"
                      size="icon"
                      className={`rounded-xl cursor-pointer transition-all duration-500 ${
                        isDarkMode
                          ? "bg-gray-800/50 border-gray-600/50 hover:bg-amber-500/20 hover:border-amber-400/50 text-gray-300 hover:text-amber-400"
                          : "bg-white/50 border-gray-300/50 hover:bg-amber-100/50 hover:border-amber-400/50 text-gray-700 hover:text-amber-600"
                      }`}
                    >
                      <Github className="h-5 w-5" />
                    </Button>
                    <p
                      className={`text-xs mt-1 text-center ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Github
                    </p>
                  </a>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={() => toggleTheme()}
                    variant="outline"
                    size="icon"
                    className={`rounded-xl cursor-pointer transition-all duration-500 ${
                      isDarkMode
                        ? "bg-gray-800/50 border-gray-600/50 hover:bg-amber-500/20 hover:border-amber-400/50 text-gray-300 hover:text-amber-400"
                        : "bg-white/50 border-gray-300/50 hover:bg-amber-100/50 hover:border-amber-400/50 text-gray-700 hover:text-amber-600"
                    }`}
                  >
                    {isDarkMode ? (
                      <Sun className="h-5 w-5" />
                    ) : (
                      <Moon className="h-5 w-5" />
                    )}
                  </Button>
                  <p
                    className={`text-xs mt-1 text-center ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {isDarkMode ? "Light" : "Dark"}
                  </p>
                </motion.div>
              </div>
            </div>
            <p
              className={`text-sm transition-colors duration-500 ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Interact with your documents like never before — simply upload and
              chat.
            </p>
          </div>
        </div>
      </motion.header>
    </div>
  );
}

export default Header;
