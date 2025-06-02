
import React from "react";

interface AuthMessageProps {
  error?: string;
  success?: string;
}

const AuthMessage = ({ error, success }: AuthMessageProps) => {
  if (!error && !success) return null;
  
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
        {error}
      </div>
    );
  }
  
  return (
    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md text-sm">
      {success}
    </div>
  );
};

export default AuthMessage;
