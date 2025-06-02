
import React from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface IconButtonProps extends ButtonProps {
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  loading?: boolean;
  loadingText?: string;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ 
    children, 
    icon, 
    iconPosition = "left", 
    loading, 
    loadingText,
    className,
    disabled,
    ...props 
  }, ref) => {
    return (
      <Button
        ref={ref}
        className={cn("flex items-center gap-2", className)}
        disabled={loading || disabled}
        {...props}
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            {loadingText || children}
          </>
        ) : (
          <>
            {icon && iconPosition === "left" && (
              <span className="inline-flex">{icon}</span>
            )}
            {children}
            {icon && iconPosition === "right" && (
              <span className="inline-flex">{icon}</span>
            )}
          </>
        )}
      </Button>
    );
  }
);

IconButton.displayName = "IconButton";
