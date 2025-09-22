import { useEffect, useRef, useState } from 'react';

interface PerformanceMetrics {
  renderTime: number;
  memoryUsage?: number;
  elementCount: number;
}

export const usePerformance = (elementCount: number) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    renderTime: 0,
    elementCount: 0
  });
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    startTimeRef.current = performance.now();

    // Use requestAnimationFrame to measure render completion
    requestAnimationFrame(() => {
      const renderTime = performance.now() - startTimeRef.current;

      let memoryUsage: number | undefined;
      if ('memory' in performance) {
        const memory = (performance as unknown as { memory: { usedJSHeapSize: number } }).memory;
        memoryUsage = memory.usedJSHeapSize / 1024 / 1024; // Convert to MB
      }

      setMetrics({
        renderTime,
        memoryUsage,
        elementCount
      });
    });
  }, [elementCount]);

  return metrics;
};

// Hook for measuring operation performance
export const useOperationTimer = () => {
  const startOperation = () => performance.now();

  const endOperation = (startTime: number, operationName: string) => {
    const duration = performance.now() - startTime;
    if (duration > 100) { // Log slow operations
      console.warn(`Slow operation detected: ${operationName} took ${duration.toFixed(2)}ms`);
    }
    return duration;
  };

  return { startOperation, endOperation };
};