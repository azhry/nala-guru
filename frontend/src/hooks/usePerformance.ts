import { useState, useEffect } from 'react';
import { fetchPerformance, PerformanceData } from '../api';

export function usePerformance() {
  const [data, setData] = useState<PerformanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const d = await fetchPerformance();
      setData(d);
    } catch {
      setError('Failed to load performance data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return { data, loading, error, reload: load };
}
