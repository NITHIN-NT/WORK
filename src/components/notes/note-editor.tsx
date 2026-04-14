import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

export const NoteEditor = dynamic(
  () => import('./note-editor-component').then((mod) => mod.NoteEditor),
  { 
    ssr: false,
    loading: () => <Skeleton className="w-full h-[400px] rounded-sm" />
  }
);
