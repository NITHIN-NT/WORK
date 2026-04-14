import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useProjects } from '../use-projects';
import { useAuthStore } from '@/store/user';
import { ProjectService } from '@/services/project.service';

vi.mock('@/store/user', () => ({
  useAuthStore: vi.fn(),
}));

vi.mock('@/services/project.service', () => ({
  ProjectService: {
    subscribeToProjects: vi.fn(),
    createProject: vi.fn(),
  }
}));

describe('useProjects Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches projects automatically when user is authenticated', async () => {
    // Setup Mock User
    (useAuthStore as unknown as { mockReturnValue: (val: unknown) => void }).mockReturnValue({ user: { uid: 'u1' } });
    
    // Catch the subscription callback payload
    let capturedCallback: (data: unknown) => void;
    (ProjectService.subscribeToProjects as unknown as { mockImplementation: (fn: unknown) => void }).mockImplementation((_uid: string, cb: (data: unknown) => void) => {
      capturedCallback = cb;
      return vi.fn(); // Mock unsubscribe cleanup function
    });

    const { result } = renderHook(() => useProjects());

    // Initially loading
    expect(result.current.loading).toBe(true);

    // Call the captured realtime callback manually with dummy data
    expect(capturedCallback).toBeDefined();
    capturedCallback([{ id: 'mock-1', name: 'Mock Data' }]);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.projects).toHaveLength(1);
      expect(result.current.projects[0].name).toBe('Mock Data');
    });
  });

  it('does not attempt fetching if there is no authenticated user', () => {
    (useAuthStore as unknown as { mockReturnValue: (val: unknown) => void }).mockReturnValue({ user: null });
    
    const { result } = renderHook(() => useProjects());

    expect(ProjectService.subscribeToProjects).not.toHaveBeenCalled();
    expect(result.current.projects).toHaveLength(0);
  });
});
