
import React from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormButtonProps extends ButtonProps {
  loading?: boolean;
  loadingText?: string;
  icon?: React.ReactNode;
}

export const FormButton = React.forwardRef<HTMLButtonElement, FormButtonProps>(
  ({ loading, loadingText, icon, className, children, disabled, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        className={cn("relative w-full", className)}
        disabled={loading || disabled}
        {...props}
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            {loadingText || "Carregando..."}
          </>
        ) : (
          <>
            {icon && <span className="mr-2">{icon}</span>}
            {children}
          </>
        )}
      </Button>
    );
  }
);

FormButton.displayName = "FormButton";
