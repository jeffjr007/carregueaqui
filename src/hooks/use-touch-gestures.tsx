
import { useState, useEffect, useRef } from 'react';
import { useIsMobile } from './use-mobile';

interface GestureHandlers {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onTap?: () => void;
  onDoubleTap?: () => void;
  onLongPress?: () => void;
}

interface TouchGestureOptions {
  swipeThreshold?: number;
  longPressDelay?: number;
  doubleTapDelay?: number;
  preventScrollOnSwipe?: boolean;
}

export function useTouchGestures(
  ref: React.RefObject<HTMLElement>,
  handlers: GestureHandlers,
  options: TouchGestureOptions = {}
) {
  const isMobile = useIsMobile();
  const startX = useRef(0);
  const startY = useRef(0);
  const startTime = useRef(0);
  const lastTapTime = useRef(0);
  const longPressTimer = useRef<number | null>(null);
  const [isActive, setIsActive] = useState(false);

  const {
    swipeThreshold = 50,
    longPressDelay = 500,
    doubleTapDelay = 300,
    preventScrollOnSwipe = false
  } = options;

  useEffect(() => {
    if (!ref.current || !isMobile) return;
    
    const element = ref.current;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      
      startX.current = e.touches[0].clientX;
      startY.current = e.touches[0].clientY;
      startTime.current = Date.now();
      setIsActive(true);
      
      // Set up long press timer
      if (handlers.onLongPress) {
        longPressTimer.current = window.setTimeout(() => {
          handlers.onLongPress?.();
          // Provide haptic feedback if available
          if (navigator.vibrate) {
            navigator.vibrate(100);
          }
        }, longPressDelay);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isActive || e.touches.length !== 1) return;
      
      const deltaX = e.touches[0].clientX - startX.current;
      const deltaY = e.touches[0].clientY - startY.current;
      
      // If moved significantly, cancel long press
      if (Math.abs(deltaX) > 10 || Math.abs(deltaY) > 10) {
        if (longPressTimer.current) {
          clearTimeout(longPressTimer.current);
          longPressTimer.current = null;
        }
      }
      
      // Prevent default if needed to avoid scrolling during swipe
      if (preventScrollOnSwipe && (Math.abs(deltaX) > 10 || Math.abs(deltaY) > 10)) {
        e.preventDefault();
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!isActive) return;
      
      // Clear long press timer
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
        longPressTimer.current = null;
      }
      
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const deltaX = endX - startX.current;
      const deltaY = endY - startY.current;
      const deltaTime = Date.now() - startTime.current;
      
      // Handle swipes
      if (Math.abs(deltaX) > swipeThreshold || Math.abs(deltaY) > swipeThreshold) {
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          // Horizontal swipe
          if (deltaX > 0) {
            handlers.onSwipeRight?.();
          } else {
            handlers.onSwipeLeft?.();
          }
        } else {
          // Vertical swipe
          if (deltaY > 0) {
            handlers.onSwipeDown?.();
          } else {
            handlers.onSwipeUp?.();
          }
        }
      } 
      // Handle taps
      else if (Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10 && deltaTime < 300) {
        const now = Date.now();
        if (now - lastTapTime.current < doubleTapDelay) {
          // Double tap
          handlers.onDoubleTap?.();
          lastTapTime.current = 0;
        } else {
          // Single tap
          handlers.onTap?.();
          lastTapTime.current = now;
        }
      }
      
      setIsActive(false);
    };

    const handleTouchCancel = () => {
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
        longPressTimer.current = null;
      }
      setIsActive(false);
    };

    // Add event listeners
    element.addEventListener('touchstart', handleTouchStart, { passive: !preventScrollOnSwipe });
    element.addEventListener('touchmove', handleTouchMove, { passive: !preventScrollOnSwipe });
    element.addEventListener('touchend', handleTouchEnd);
    element.addEventListener('touchcancel', handleTouchCancel);

    // Cleanup
    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
      element.removeEventListener('touchcancel', handleTouchCancel);
      
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
      }
    };
  }, [handlers, isMobile, isActive, swipeThreshold, longPressDelay, doubleTapDelay, preventScrollOnSwipe, ref]);

  return { isActive };
}
