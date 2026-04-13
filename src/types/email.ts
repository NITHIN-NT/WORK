export type EmailStatus = 'Draft' | 'Sent' | 'Failed';

export interface EmailLog {
  id: string;
  projectId: string;
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  body: string; // HTML string from TipTap
  status: EmailStatus;
  sentAt?: string;
  error?: string;
  attachments?: {
    name: string;
    url: string;
    size: number;
  }[];
  createdBy: string;
}
