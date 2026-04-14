import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DocumentEditor } from '../document-editor';
import { useAuthStore } from '@/store/user';

vi.mock('@/store/user', () => ({
  useAuthStore: vi.fn(),
}));

// Mock NoteEditor since Tiptap requires full DOM rendering context
vi.mock('@/components/notes/note-editor', () => ({
  NoteEditor: ({ content, onChange }: any) => (
    <textarea data-testid="mock-tiptap" value={content} onChange={(e) => onChange(e.target.value)} />
  )
}));

describe('DocumentEditor Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useAuthStore as any).mockReturnValue({ user: { uid: 'u1' } });
  });

  it('renders correctly with given defaults', () => {
    const onSave = vi.fn();
    render(<DocumentEditor projectId="p1" onSave={onSave} />);

    expect(screen.getByPlaceholderText('Protocol Title...')).toHaveValue('Untitled Protocol');
    expect(screen.getByText('Synchronize')).toBeInTheDocument();
  });

  it('emits exact state payload on save click', () => {
    const onSave = vi.fn();
    render(<DocumentEditor projectId="p1" onSave={onSave} initialDocument={{ title: 'Integration Plan', content: '<p>test</p>' }} />);

    const saveButton = screen.getByText('Synchronize');
    fireEvent.click(saveButton);

    expect(onSave).toHaveBeenCalledWith({
      title: 'Integration Plan',
      type: 'Technical Documentation',
      content: '<p>test</p>',
      isPublic: false
    });
  });

  it('allows title mutation', () => {
    const onSave = vi.fn();
    render(<DocumentEditor projectId="p1" onSave={onSave} />);

    const titleInput = screen.getByPlaceholderText('Protocol Title...');
    fireEvent.change(titleInput, { target: { value: 'New Test Protocol' } });

    fireEvent.click(screen.getByText('Synchronize'));

    expect(onSave).toHaveBeenCalledWith(expect.objectContaining({ title: 'New Test Protocol' }));
  });
});
