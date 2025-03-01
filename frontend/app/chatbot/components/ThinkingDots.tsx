"use client";

import { motion } from "framer-motion";

export default function ThinkingDots() {
  const dotVariants = {
    initial: { opacity: 0.5, y: 0 },
    animate: { opacity: 1, y: -3 },
  };

  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  return (
    <motion.div
      className="flex items-center justify-start ml-1 space-x-[3px] w-10"
      variants={containerVariants}
      initial="initial"
      animate="animate"
    >
      {[0, 1, 2].map((dot) => (
        <motion.div
          key={dot}
          className="w-1 h-1 bg-current rounded-full"
          variants={dotVariants}
          transition={{
            repeat: Infinity,
            repeatType: "reverse",
            duration: 0.4,
            delay: dot * 0.15,
            ease: "easeInOut",
          }}
        />
      ))}
    </motion.div>
  );
}
