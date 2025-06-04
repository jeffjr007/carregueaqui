import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface SparklesTextProps {
  children: string;
  className?: string;
  sparklesCount?: number;
  colors?: {
    first: string;
    second: string;
  };
}

export function SparklesText({
  children,
  className = "",
  sparklesCount = 10,
  colors = { first: "#A07CFE", second: "#FE8FB5" },
}: SparklesTextProps) {
  const [sparkles, setSparkles] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!textRef.current) return;

    const newSparkles = Array.from({ length: sparklesCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
    }));

    setSparkles(newSparkles);
  }, [sparklesCount]);

  return (
    <div ref={textRef} className={`relative inline-block ${className}`}>
      {children}
      {sparkles.map((sparkle) => (
        <motion.div
          key={sparkle.id}
          className="absolute pointer-events-none"
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
            x: [sparkle.x - 50, sparkle.x, sparkle.x + 50],
            y: [sparkle.y - 50, sparkle.y, sparkle.y + 50],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: sparkle.id * 0.1,
          }}
          style={{
            left: `${sparkle.x}%`,
            top: `${sparkle.y}%`,
            background: `linear-gradient(45deg, ${colors.first}, ${colors.second})`,
            width: "4px",
            height: "4px",
            borderRadius: "50%",
          }}
        />
      ))}
    </div>
  );
} 