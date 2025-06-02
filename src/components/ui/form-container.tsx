
import React from "react";
import { cn } from "@/lib/utils";
import AuthLayout from "../auth/AuthLayout";
import AuthHeader from "../auth/AuthHeader";
import AuthMessage from "../auth/AuthMessage";

interface FormContainerProps extends React.FormHTMLAttributes<HTMLFormElement> {
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  error?: string;
  success?: string;
  footerContent?: React.ReactNode;
  className?: string;
}

export const FormContainer = ({
  title,
  subtitle,
  icon,
  error,
  success,
  footerContent,
  className,
  children,
  ...props
}: FormContainerProps) => {
  return (
    <AuthLayout>
      {(title || icon) && (
        <AuthHeader title={title || ""} subtitle={subtitle} icon={icon} />
      )}

      <AuthMessage error={error} success={success} />

      <form className={cn("space-y-6", className)} {...props}>
        {children}
        
        {footerContent && (
          <div className="pt-2">{footerContent}</div>
        )}
      </form>
    </AuthLayout>
  );
};
