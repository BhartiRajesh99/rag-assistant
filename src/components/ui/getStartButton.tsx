"use client"
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import Link from "next/link";

interface GetStartedButtonProps {
  isDarkMode: boolean;
}

export function GetStartedButton({ isDarkMode }: GetStartedButtonProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.03, rotate: 0.6 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "tween", stiffness: 300 }}
      className="relative group"
    >
      <div
        className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
          isDarkMode
            ? "bg-gradient-to-r from-amber-400/20 to-orange-500/20 blur-md"
            : "bg-gradient-to-r from-amber-500/20 to-orange-600/20 blur-md"
        }`}
      />
      <Button
        asChild
        className={`relative px-8 py-4 rounded-xl text-lg font-serif text-white border-0 shadow-lg transition-all duration-300 overflow-hidden ${
          isDarkMode
            ? "bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 hover:from-amber-500 hover:via-orange-600 hover:to-amber-600 shadow-amber-500/25"
            : "bg-gradient-to-r from-amber-500 via-orange-600 to-amber-600 hover:from-amber-600 hover:via-orange-700 hover:to-amber-700 shadow-amber-500/30"
        }`}
      >
        <Link href="/main">
          <motion.span
            className="flex items-center gap-1 font-bold"
            animate={{ x: [0, 3, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            Get Started
            <motion.div>
              <Sparkles className="h-5 w-5 text-white" />
            </motion.div>
          </motion.span>
        </Link>
      </Button>
    </motion.div>
  );
}
