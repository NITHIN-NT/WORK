import { supabase } from "@/lib/supabase";
import { ProjectDocument } from "@/types/document";
import { SystemService } from "./system.service";

export const DocumentService = {
  /**
   * Subscribe to documents for a specific project
   */
  subscribeToDocuments(projectId: string, callback: (docs: ProjectDocument[]) => void) {
    const fetchDocs = async () => {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('project_id', projectId)
        .order('updated_at', { ascending: false });
      
      if (!error && data) {
        callback(data as unknown as ProjectDocument[]);
      }
    };

    fetchDocs();

    const channel = supabase.channel(`documents_${projectId}`)
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'documents',
        filter: `project_id=eq.${projectId}`
      }, () => {
        fetchDocs();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel) };
  },

  /**
   * Initialize a new document within a project workspace
   */
  async createDocument(projectId: string, docData: Omit<ProjectDocument, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'projectId'>, user: Record<string, unknown>) {
    const { data, error } = await supabase
      .from('documents')
      .insert([
        {
          ...docData,
          project_id: projectId,
          created_by: (user.displayName as string) || 'System',
        }
      ])
      .select()
      .single();

    if (error) throw error;

    await SystemService.dispatchActivityLedger({
      projectId,
      type: 'document_created',
      title: 'Document Initialized',
      description: `New protocol record "${docData.title}" was drafted in the workspace.`,
      userId: (user.uid as string) || (user.id as string),
      userName: (user.displayName as string) || 'User',
      metadata: { documentId: data.id }
    });

    return data as unknown as ProjectDocument;
  },

  /**
   * Update an existing document record
   */
  async synchronizeDocument(projectId: string, documentId: string, updates: Partial<ProjectDocument>) {
    const { error } = await supabase
      .from('documents')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', documentId);
    
    if (error) throw error;
  },

  /**
   * Purge a document record from the ledger
   */
  async purgeDocument(projectId: string, documentId: string) {
    const { error } = await supabase
      .from('documents')
      .delete()
      .eq('id', documentId);
      
    if (error) throw error;
  }
};

