"use client";

import { motion } from "framer-motion";
import { Brain, Sparkles, Upload } from "lucide-react";
import Footer from "@/components/ui/footer";
import Header from "./header";
import { useTheme } from "@/app/context/ThemeContext";
import { GetStartedButton } from "./getStartButton";

export default function LandingPage() {
  const {isDarkMode} = useTheme();


  return (
    <div
      className={`min-h-screen transition-all duration-500 relative overflow-hidden ${
        isDarkMode
          ? "bg-gradient-to-br from-slate-900 via-gray-900 to-black"
          : "bg-gradient-to-br from-gray-50 via-white to-gray-100"
      }`}
    >
      {/* Background effects from RAGAssistant */}
      <div
        className={`absolute inset-0 animate-pulse-slow ${
          isDarkMode
            ? "bg-gradient-to-r from-amber-400/5 via-transparent to-orange-400/5"
            : "bg-gradient-to-r from-amber-200/20 via-transparent to-orange-200/20"
        }`}
      />
      <div
        className={`absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl animate-float ${
          isDarkMode
            ? "bg-gradient-radial from-amber-400/10 to-transparent"
            : "bg-gradient-radial from-amber-300/30 to-transparent"
        }`}
      />
      <div
        className={`absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl animate-float-delayed ${
          isDarkMode
            ? "bg-gradient-radial from-orange-400/10 to-transparent"
            : "bg-gradient-radial from-orange-300/30 to-transparent"
        }`}
      />

      {/* Navbar */}
      <Header />

      {/* Hero Section */}
      <motion.section
        className="container mx-auto px-4 py-20 flex flex-col justify-center items-center text-center relative z-10"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.h2
          className="text-4xl md:text-6xl font-bold font-serif mb-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Chat with your{" "}
          <span
            className={` bg-clip-text text-transparent ${
              isDarkMode
                ? "bg-gradient-to-r from-amber-300 via-orange-400 to-amber-400"
                : "bg-gradient-to-r from-amber-600 via-orange-700 to-amber-700"
            }`}
          >
            Documents
          </span>
        </motion.h2>
        <motion.p
          className={`max-w-2xl text-lg transition-colors duration-500 ${
            isDarkMode ? "text-gray-400" : "text-gray-600"
          } mb-8`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          Upload your files, process knowledge, and get instant answers with the
          power of Retrieval Augmented Generation.
        </motion.p>
        
        <GetStartedButton isDarkMode/>
      </motion.section>

      {/* Features Section */}
      <section className="container mx-auto px-4 lg:py-16 grid lg:grid-cols-3 gap-8 relative z-10">
        {[
          {
            title: "Upload Easily",
            desc: "Drag & drop PDFs, CSVs, DOCXs and text files.",
            icon: <Upload className="h-6 w-6 text-white" />,
          },
          {
            title: "Smart Search",
            desc: "Find precise answers from your data instantly.",
            icon: <Brain className="h-6 w-6 text-white" />,
          },
          {
            title: "Fast & Secure",
            desc: "Optimized RAG pipelines with secure storage.",
            icon: <Sparkles className="h-6 w-6 text-white" />,
          },
        ].map((feature, i) => (
          <motion.div
            key={i}
            className={`p-6 rounded-2xl border-0 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500 relative overflow-hidden ${
              isDarkMode
                ? "bg-gradient-to-br from-gray-900/80 via-black/60 to-gray-800/40 border border-gray-700/50"
                : "bg-gradient-to-br from-white/80 via-gray-50/60 to-white/40 border border-gray-200/50"
            }`}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2, duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div
              className={`absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 ${
                isDarkMode
                  ? "bg-gradient-to-br from-amber-500/5 to-transparent"
                  : "bg-gradient-to-br from-amber-200/20 to-transparent"
              }`}
            />
            <div className="relative z-10 flex justify-center items-center gap-3">
              <div
                className={`w-12 h-10 rounded-lg flex items-center justify-center ${
                  isDarkMode
                    ? "bg-gradient-to-br from-amber-400 to-orange-500"
                    : "bg-gradient-to-br from-amber-500 to-orange-600"
                }`}
              >
                {feature.icon}
              </div>
              <div>
                <h3
                  className={`text-xl font-serif font-semibold transition-colors duration-500 ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  } mb-2`}
                >
                  {feature.title}
                </h3>
                <p
                  className={`transition-colors duration-500 ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {feature.desc}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </section>

      {/* Footer */}
      <Footer theme={isDarkMode} />
    </div>
  );
}