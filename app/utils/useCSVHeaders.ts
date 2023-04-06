import { useState, useEffect } from 'react';
import Papa from 'papaparse';

export type CSVHeadersHook = [string[], (event: React.ChangeEvent<HTMLInputElement>) => void];

export function useCSVHeaders(): CSVHeadersHook {
  const [headers, setHeaders] = useState<string[]>([]);

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || file.type !== 'text/csv'){
      setHeaders([]);
      return;
    }

    const reader = new FileReader();
    reader.addEventListener('load', (event) => {
      const result = event.target?.result;
      if (typeof result === 'string') {
        const { data } = Papa.parse(result, { preview: 1 });
        setHeaders(data[0] as string[] ?? []);
      }
    });
    reader.readAsText(file);
  };

  useEffect(() => {
    return () => {
      setHeaders([]);
    };
  }, []);

  return [headers, handleFileInputChange];
}
