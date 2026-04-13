export type TaskStatus = 'Todo' | 'In Progress' | 'Review' | 'Blocked' | 'Completed';
export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Urgent';

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignedTo?: string;
  deadline?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}
