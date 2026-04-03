import { useEffect, useState } from 'react';
import api from '@/lib/api';

interface InboxCounts {
  sectorCount: number;
  personalCount: number;
}

export function useInboxCounts() {
  const [counts, setCounts] = useState<InboxCounts>({ sectorCount: 0, personalCount: 0 });

  useEffect(() => {
    api
      .get<InboxCounts>('/protocols/inbox-counts')
      .then(res => setCounts(res.data))
      .catch(err => console.error('Failed to load inbox counts:', err));
  }, []);

  return counts;
}
