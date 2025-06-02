
import { useState, useEffect } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  placeholderSrc?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export const OptimizedImage = ({
  src,
  alt,
  width,
  height,
  className = "",
  placeholderSrc = "/placeholder.svg",
  onLoad,
  onError
}: OptimizedImageProps) => {
  const [imgSrc, setImgSrc] = useState(placeholderSrc);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Reset state when src changes
    setImgSrc(placeholderSrc);
    setLoaded(false);

    // Create new image to preload
    const img = new Image();
    img.src = src;
    
    img.onload = () => {
      setImgSrc(src);
      setLoaded(true);
      onLoad?.();
    };
    
    img.onerror = () => {
      console.error(`Failed to load image: ${src}`);
      onError?.();
    };

    return () => {
      // Cancel the load event if component unmounts
      img.onload = null;
      img.onerror = null;
    };
  }, [src, placeholderSrc, onLoad, onError]);

  return (
    <img 
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      className={`${className} ${!loaded ? 'animate-pulse bg-gray-200' : ''}`}
      loading="lazy"
    />
  );
};
