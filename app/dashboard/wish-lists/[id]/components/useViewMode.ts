import { useLocalStorage } from 'usehooks-ts';

export default function useViewMode() {
  return useLocalStorage<'detailed' | 'compact'>('viewMode', 'compact');
}
