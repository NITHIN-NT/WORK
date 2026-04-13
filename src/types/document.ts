export type DocumentType = 
  | 'Proposal' 
  | 'Agreement' 
  | 'Requirement Specification' 
  | 'Meeting Summary' 
  | 'Technical Documentation' 
  | 'Internal Documentation';

export interface ProjectDocument {
  id: string;
  projectId: string;
  title: string;
  type: DocumentType;
  content: string; // HTML or JSON string from TipTap
  sharedLinkToken?: string;
  isPublic?: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}
