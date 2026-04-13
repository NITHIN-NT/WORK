export type ProjectStatus = 'Planning' | 'In Progress' | 'Review' | 'Blocked' | 'Completed';

export interface Project {
  id: string;
  name: string;
  client: string;
  clientId: string;
  status: ProjectStatus;
  progress: number;
  tasksCount: number;
  deadline: string;
  createdAt: string;
  updatedAt: string;
}
