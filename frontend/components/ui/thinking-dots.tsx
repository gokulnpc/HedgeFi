import React, { useEffect, useState } from "react";

export function ThinkingDots() {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => {
        if (prev.length >= 3) return "";
        return prev + ".";
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return <span className="inline-block ml-1">{dots}</span>;
}
