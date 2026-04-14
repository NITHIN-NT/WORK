import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ProjectService } from '../project.service';
import { supabase } from '@/lib/supabase';
import { SystemService } from '../system.service';

// Mock Supabase
vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(),
    channel: vi.fn(),
    removeChannel: vi.fn(),
  }
}));

// Mock SystemService
vi.mock('../system.service', () => ({
  SystemService: {
    dispatchActivityLedger: vi.fn()
  }
}));

describe('ProjectService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createProject', () => {
    it('successfully creates a project and dispatches activity ledger', async () => {
      const mockProjectData = { name: 'Test Project', client: 'Test Client', deadline: '2026-01-01', description: 'Test', priority: 'High' as const, status: 'In Progress' as const };
      const userId = 'user-123';
      const mockUser = { uid: 'user-123', displayName: 'Test User' };
      const mockInsertedData = { id: 'proj-123', ...mockProjectData };

      const selectMock = vi.fn().mockReturnThis();
      const singleMock = vi.fn().mockResolvedValue({ data: mockInsertedData, error: null });
      const insertMock = vi.fn().mockReturnValue({ select: selectMock, single: singleMock });
      
      (supabase.from as any).mockReturnValue({ insert: insertMock });

      const result = await ProjectService.createProject(userId, mockProjectData, mockUser);

      expect(supabase.from).toHaveBeenCalledWith('projects');
      expect(insertMock).toHaveBeenCalled();
      expect(SystemService.dispatchActivityLedger).toHaveBeenCalledWith(expect.objectContaining({
        projectId: 'proj-123',
        type: 'project_created',
        userId: 'user-123',
        userName: 'Test User',
      }));
      expect(result).toEqual(mockInsertedData);
    });

    it('throws error if insert fails', async () => {
      const mockError = new Error('Insert failed');
      const selectMock = vi.fn().mockReturnThis();
      const singleMock = vi.fn().mockResolvedValue({ data: null, error: mockError });
      const insertMock = vi.fn().mockReturnValue({ select: selectMock, single: singleMock });
      
      (supabase.from as any).mockReturnValue({ insert: insertMock });

      await expect(ProjectService.createProject('u1', { name: 'test' } as any, null)).rejects.toThrow('Insert failed');
    });
  });
});
