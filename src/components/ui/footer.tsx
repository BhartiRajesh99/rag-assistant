export default function Footer({theme}: {theme: boolean}) {
  return (
    <footer
      className={` py-6 mt-10 border-t sticky w-full top-0 z-50 shadow-lg backdrop-blur-xl transition-all duration-500 ${
        theme
          ? "border-gradient-to-r from-amber-200/20 via-gray-700/40 to-orange-200/20 bg-black/70 shadow-amber-500/5"
          : "border-gradient-to-r from-amber-300/30 via-gray-300/40 to-orange-300/30 bg-white/70 shadow-amber-500/10"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Branding */}
        <div className="text-center md:text-left">
          <h1
            className={`text-lg bg-clip-text text-transparent font-serif transition-all duration-500 font-bold ${
              theme
                ? "bg-gradient-to-r from-amber-300 via-orange-400 to-amber-400"
                : "bg-gradient-to-r from-amber-600 via-orange-700 to-amber-700"
            }`}
          >
            RAGify
          </h1>
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
        <div
          className={`text-xs text-center text-gray-500`}
        >
          © {new Date().getFullYear()} Ragify. Created by Raj for AI-powered
          search.
        </div>
      </div>
    </footer>
  );
}
