import { useState, useCallback } from 'react';

export function useClipboard(resetDelay = 2000) {
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      setTimeout(() => setCopiedText(null), resetDelay);
      return true;
    } catch (err) {
      console.error('Failed to copy:', err);
      return false;
    }
  }, [resetDelay]);

  return { copiedText, copyToClipboard };
}
