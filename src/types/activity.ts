export type ActivityType = 
  | 'task_created' 
  | 'task_updated' 
  | 'task_completed' 
  | 'note_updated' 
  | 'invoice_generated' 
  | 'invoice_sent' 
  | 'document_uploaded' 
  | 'document_created'
  | 'financial_update'
  | 'project_created'
  | 'requirement_updated';

export type MetadataValue = string | number | boolean | null | { [key: string]: MetadataValue } | MetadataValue[];

export interface ActivityLog {
  id: string;
  projectId: string;
  userId: string;
  userName: string;
  type: ActivityType;
  title: string;
  description?: string;
  metadata?: Record<string, MetadataValue>;
  timestamp: string;
}
