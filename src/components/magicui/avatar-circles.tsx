/* eslint-disable @next/next/no-img-element */
"use client";

import { cn } from "@/lib/utils";
import React from "react";
import { motion } from "framer-motion";

interface Avatar {
  imageUrl: string;
  profileUrl: string;
}
interface AvatarCirclesProps {
  className?: string;
  numPeople?: number;
  avatarUrls: Avatar[];
}

export const AvatarCircles = ({
  numPeople,
  className,
  avatarUrls,
}: AvatarCirclesProps) => {
  return (
    <div className={cn("z-10 flex rtl:space-x-reverse items-center", className)}>
      {avatarUrls.map((url, index) => (
        <motion.a
          key={index}
          href={url.profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={index < avatarUrls.length - 1 ? "mr-2" : ""}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <img
            key={index}
            className="h-10 w-10 rounded-full border-2 border-white dark:border-gray-800"
            src={url.imageUrl}
            width={40}
            height={40}
            alt={`Avatar ${index + 1}`}
          />
        </motion.a>
      ))}
      {(numPeople ?? 0) > 0 && (
        <motion.a
          className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-black text-center text-xs font-medium text-white hover:bg-gray-600 dark:border-gray-800 dark:bg-white dark:text-black"
          href=""
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: (avatarUrls.length) * 0.1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          +{numPeople}
        </motion.a>
      )}
    </div>
  );
};
