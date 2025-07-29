"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500">
      <div className="text-center text-white">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-9xl font-bold mb-4">404</h1>
        </motion.div>
        
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-4xl font-semibold mb-4">Page Not Found</h2>
          <p className="text-xl mb-8">
            Oops! The page you're looking for doesn't exist.
          </p>
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Link 
              href="/"
              className="bg-white text-purple-600 px-6 py-3 rounded-full 
                        font-semibold hover:bg-opacity-90 transition-all"
            >
              Go Back Home
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}