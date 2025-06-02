
import React from "react";

interface AuthHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
}

const AuthHeader = ({ title, subtitle, icon }: AuthHeaderProps) => {
  return (
    <div className="text-center">
      {icon && (
        <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-2">
          {icon}
        </div>
      )}
      {title && (
        <h2 className="mt-2 text-3xl font-bold text-gray-900">{title}</h2>
      )}
      {subtitle && (
        <p className="mt-2 text-sm text-gray-600">{subtitle}</p>
      )}
    </div>
  );
};

export default AuthHeader;
