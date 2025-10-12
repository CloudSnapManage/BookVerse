'use client';

import { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';

export function TopLoader() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-1 z-50">
      <Progress value={progress} className="h-1 w-full" />
    </div>
  );
}
