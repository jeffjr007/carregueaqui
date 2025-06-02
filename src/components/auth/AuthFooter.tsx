
import React from "react";

interface AuthFooterProps {
  message: string;
  linkText: string;
  onLinkClick: () => void;
}

const AuthFooter = ({ message, linkText, onLinkClick }: AuthFooterProps) => {
  return (
    <p className="text-center text-sm">
      {message}{" "}
      <button
        type="button"
        onClick={onLinkClick}
        className="text-primary hover:text-primary/80 font-semibold"
      >
        {linkText}
      </button>
    </p>
  );
};

export default AuthFooter;
