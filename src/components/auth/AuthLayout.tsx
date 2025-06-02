
import React from "react";
import { cn } from "@/lib/utils";

interface AuthLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const AuthLayout = ({ children, className }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20 p-4">
      <div className={cn("w-full max-w-md space-y-6 animate-fade-in bg-white/95 backdrop-blur-sm p-6 rounded-lg shadow-xl", className)}>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
