
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { AlertTriangle } from "lucide-react";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  hideLabel?: boolean;
  containerClassName?: string;
}

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, icon, hideLabel = false, containerClassName, className, id, ...props }, ref) => {
    const inputId = id || props.name || Math.random().toString(36).substring(2, 9);
    
    return (
      <div className={cn("space-y-2", containerClassName)}>
        {label && !hideLabel && (
          <Label htmlFor={inputId} className="text-sm font-medium">
            {label}
          </Label>
        )}
        
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {icon}
            </div>
          )}
          
          <Input
            id={inputId}
            className={cn(
              icon && "pl-10",
              error && "border-red-300 focus-visible:ring-red-500",
              className
            )}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : undefined}
            ref={ref}
            {...props}
          />
        </div>
        
        {error && (
          <div 
            id={`${inputId}-error`}
            className="flex items-center gap-2 text-sm text-red-500 animate-fade-in"
          >
            <AlertTriangle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}
      </div>
    );
  }
);

FormInput.displayName = "FormInput";
