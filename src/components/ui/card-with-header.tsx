
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface CardWithHeaderProps {
  title?: string;
  description?: string;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  footerClassName?: string;
  headerAction?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const CardWithHeader = ({
  title,
  description,
  className,
  headerClassName,
  contentClassName,
  footerClassName,
  headerAction,
  children,
  footer,
}: CardWithHeaderProps) => {
  return (
    <Card className={cn("w-full", className)}>
      {(title || description || headerAction) && (
        <CardHeader className={cn("flex flex-row items-center justify-between", headerClassName)}>
          <div>
            {title && <CardTitle>{title}</CardTitle>}
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </CardHeader>
      )}
      <CardContent className={cn("", contentClassName)}>
        {children}
      </CardContent>
      {footer && (
        <CardFooter className={cn("", footerClassName)}>
          {footer}
        </CardFooter>
      )}
    </Card>
  );
};
