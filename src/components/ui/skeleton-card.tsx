
import React from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface SkeletonCardProps {
  className?: string;
  headerHeight?: number;
  contentCount?: number;
  contentHeight?: number;
  footerHeight?: number;
  showFooter?: boolean;
}

export const SkeletonCard = ({
  className,
  headerHeight = 28,
  contentCount = 3,
  contentHeight = 20,
  footerHeight = 40,
  showFooter = true,
}: SkeletonCardProps) => {
  return (
    <Card className={cn("w-full overflow-hidden", className)}>
      <div className="p-6">
        <Skeleton className="h-7 w-3/4 mb-2" style={{ height: `${headerHeight}px` }} />
        {showFooter && <Skeleton className="h-5 w-1/2 mb-6" />}
        
        <div className="space-y-4">
          {Array.from({ length: contentCount }).map((_, i) => (
            <Skeleton 
              key={i} 
              className="w-full" 
              style={{ height: `${contentHeight}px` }} 
            />
          ))}
        </div>
        
        {showFooter && (
          <div className="pt-6">
            <Skeleton 
              className="w-full" 
              style={{ height: `${footerHeight}px` }} 
            />
          </div>
        )}
      </div>
    </Card>
  );
};

export const SkeletonList = ({
  count = 3,
  className,
}: {
  count?: number;
  className?: string;
}) => {
  return (
    <div className={cn("space-y-3 w-full", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="w-full h-16" />
      ))}
    </div>
  );
};

export const SkeletonAvatar = ({
  size = 40,
  className,
}: {
  size?: number;
  className?: string;
}) => {
  return (
    <Skeleton
      className={cn("rounded-full", className)}
      style={{ width: `${size}px`, height: `${size}px` }}
    />
  );
};
