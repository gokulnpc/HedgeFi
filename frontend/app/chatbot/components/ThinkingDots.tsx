"use client";

import { motion } from "framer-motion";

export default function ThinkingDots() {
  const dotVariants = {
    initial: { y: 0 },
    animate: { y: -5 },
  };

  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  return (
    <motion.div
      className="flex items-center justify-center ml-1 space-x-1"
      variants={containerVariants}
      initial="initial"
      animate="animate"
    >
      {[0, 1, 2].map((dot) => (
        <motion.div
          key={dot}
          className="w-1.5 h-1.5 bg-current rounded-full"
          variants={dotVariants}
          transition={{
            repeat: Infinity,
            repeatType: "reverse",
            duration: 0.5,
            delay: dot * 0.2,
          }}
        />
      ))}
    </motion.div>
  );
}
