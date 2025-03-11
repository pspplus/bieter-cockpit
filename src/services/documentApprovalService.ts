
import { supabase } from "@/integrations/supabase/client";
import { DocumentApproval, ApprovalStatus } from "@/types/tender";

// Datenbankzeile in DocumentApproval-Typ konvertieren
const mapApprovalFromDB = (approval: any): DocumentApproval => {
  return {
    id: approval.id,
    documentId: approval.document_id,
    userId: approval.user_id,
    userName: approval.user_id, // Default Fallback
    status: approval.status as ApprovalStatus,
    comment: approval.comment || "",
    createdAt: new Date(approval.created_at),
    updatedAt: new Date(approval.updated_at)
  };
};

// Genehmigungen für ein Dokument abrufen
export const fetchDocumentApprovals = async (documentId: string): Promise<DocumentApproval[]> => {
  const { data, error } = await supabase
    .from('document_approvals')
    .select('*')
    .eq('document_id', documentId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Fehler beim Abrufen der Genehmigungen:', error);
    throw error;
  }

  // Hier holen wir Benutzerinformationen separat
  const approvals = (data || []).map(mapApprovalFromDB);
  
  // Holen der Benutzerprofile für die Anzeigenamen
  for (const approval of approvals) {
    try {
      const { data: userData } = await supabase.auth.admin.getUserById(approval.userId);
      if (userData && userData.user) {
        approval.userName = userData.user.email || approval.userId;
      }
    } catch (error) {
      console.error('Fehler beim Abrufen der Benutzerinformationen:', error);
      // Fallback ist bereits in mapApprovalFromDB gesetzt
    }
  }

  return approvals;
};

// Neue Genehmigung hinzufügen
export const addApproval = async (documentId: string, status: ApprovalStatus, comment?: string): Promise<DocumentApproval> => {
  // Aktuellen Benutzer abrufen
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('Benutzer nicht authentifiziert');
  }

  const approvalData = {
    document_id: documentId,
    user_id: user.id,
    status,
    comment,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const { data, error } = await supabase
    .from('document_approvals')
    .insert(approvalData)
    .select()
    .single();

  if (error) {
    console.error('Fehler beim Hinzufügen der Genehmigung:', error);
    throw error;
  }

  // Dokument-Status aktualisieren
  await supabase
    .from('documents')
    .update({ approval_status: status })
    .eq('id', documentId);

  return mapApprovalFromDB(data);
};

// Genehmigungsstatus aktualisieren
export const updateApprovalStatus = async (
  approvalId: string, 
  status: ApprovalStatus, 
  comment?: string
): Promise<DocumentApproval> => {
  // Aktuellen Benutzer abrufen
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('Benutzer nicht authentifiziert');
  }

  // Zuerst die zugehörige Genehmigung abrufen, um die Dokument-ID zu erhalten
  const { data: approvalData, error: approvalError } = await supabase
    .from('document_approvals')
    .select('document_id')
    .eq('id', approvalId)
    .eq('user_id', user.id) // Sicherstellen, dass nur der Ersteller aktualisieren kann
    .single();

  if (approvalError) {
    console.error('Fehler beim Abrufen der Genehmigung:', approvalError);
    throw approvalError;
  }

  const updateData: any = {
    status,
    updated_at: new Date().toISOString()
  };

  if (comment !== undefined) {
    updateData.comment = comment;
  }

  const { data, error } = await supabase
    .from('document_approvals')
    .update(updateData)
    .eq('id', approvalId)
    .select()
    .single();

  if (error) {
    console.error('Fehler beim Aktualisieren der Genehmigung:', error);
    throw error;
  }

  // Dokument-Status aktualisieren
  await supabase
    .from('documents')
    .update({ approval_status: status })
    .eq('id', approvalData.document_id);

  return mapApprovalFromDB(data);
};
