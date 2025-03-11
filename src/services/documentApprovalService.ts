
import { supabase } from "@/integrations/supabase/client";
import { DocumentApproval, ApprovalStatus } from "@/types/tender";

// Datenbankzeile in DocumentApproval-Typ konvertieren
const mapApprovalFromDB = (approval: any): DocumentApproval => {
  return {
    id: approval.id,
    documentId: approval.document_id,
    userId: approval.user_id,
    userName: approval.user_email || approval.user_id, // Fallback, falls kein Name verfügbar ist
    status: approval.status,
    comment: approval.comment || "",
    createdAt: new Date(approval.created_at),
    updatedAt: new Date(approval.updated_at)
  };
};

// Genehmigungen für ein Dokument abrufen
export const fetchDocumentApprovals = async (documentId: string): Promise<DocumentApproval[]> => {
  const { data, error } = await supabase
    .from('document_approvals')
    .select(`
      *,
      profiles:user_id (
        email,
        full_name
      )
    `)
    .eq('document_id', documentId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Fehler beim Abrufen der Genehmigungen:', error);
    throw error;
  }

  return (data || []).map(approval => {
    // Benutzernamen aus Profiltabelle extrahieren, falls verfügbar
    const userName = approval.profiles?.full_name || approval.profiles?.email || approval.user_id;
    return {
      ...mapApprovalFromDB(approval),
      userName
    };
  });
};

// Genehmigungsanfrage erstellen
export const requestApproval = async (documentId: string): Promise<DocumentApproval> => {
  // Aktuellen Benutzer abrufen
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('Benutzer nicht authentifiziert');
  }

  // Prüfen, ob bereits eine Genehmigungsanfrage vom Benutzer existiert
  const { data: existingApproval, error: checkError } = await supabase
    .from('document_approvals')
    .select('*')
    .eq('document_id', documentId)
    .eq('user_id', user.id);

  if (checkError) {
    console.error('Fehler beim Prüfen vorhandener Genehmigungen:', checkError);
    throw checkError;
  }

  if (existingApproval && existingApproval.length > 0) {
    console.warn('Es existiert bereits eine Genehmigungsanfrage vom Benutzer.');
    return mapApprovalFromDB(existingApproval[0]);
  }

  const approvalData = {
    document_id: documentId,
    user_id: user.id,
    status: 'pending' as ApprovalStatus,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const { data, error } = await supabase
    .from('document_approvals')
    .insert(approvalData)
    .select()
    .single();

  if (error) {
    console.error('Fehler beim Erstellen der Genehmigungsanfrage:', error);
    throw error;
  }

  // Dokumentstatus aktualisieren
  const { error: updateError } = await supabase
    .from('documents')
    .update({ approval_status: 'pending' as ApprovalStatus })
    .eq('id', documentId);

  if (updateError) {
    console.error('Fehler beim Aktualisieren des Dokumentstatus:', updateError);
    throw updateError;
  }

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

  // Genehmigung aktualisieren
  const { data, error } = await supabase
    .from('document_approvals')
    .update({
      status,
      comment,
      updated_at: new Date().toISOString()
    })
    .eq('id', approvalId)
    .eq('user_id', user.id) // Sicherstellen, dass nur der Ersteller die Genehmigung aktualisieren kann
    .select('*, documents:document_id(id)')
    .single();

  if (error) {
    console.error('Fehler beim Aktualisieren der Genehmigung:', error);
    throw error;
  }

  // Dokumentstatus aktualisieren, falls alle Genehmigungen vom gleichen Typ sind
  const documentId = data.document_id;
  
  // Alle Genehmigungen für dieses Dokument abrufen
  const { data: allApprovals, error: fetchError } = await supabase
    .from('document_approvals')
    .select('status')
    .eq('document_id', documentId);

  if (fetchError) {
    console.error('Fehler beim Abrufen aller Genehmigungen:', fetchError);
    throw fetchError;
  }

  let newDocumentStatus: ApprovalStatus = 'pending';
  
  // Wenn alle Genehmigungen genehmigt sind, wird das Dokument genehmigt
  if (allApprovals.every(a => a.status === 'approved')) {
    newDocumentStatus = 'approved';
  } 
  // Wenn mindestens eine Genehmigung abgelehnt wurde, wird das Dokument abgelehnt
  else if (allApprovals.some(a => a.status === 'rejected')) {
    newDocumentStatus = 'rejected';
  }

  // Dokumentstatus aktualisieren
  const { error: updateError } = await supabase
    .from('documents')
    .update({ approval_status: newDocumentStatus })
    .eq('id', documentId);

  if (updateError) {
    console.error('Fehler beim Aktualisieren des Dokumentstatus:', updateError);
    throw updateError;
  }

  return mapApprovalFromDB(data);
};

// Genehmigungsanfrage löschen
export const deleteApproval = async (approvalId: string): Promise<void> => {
  // Aktuellen Benutzer abrufen
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('Benutzer nicht authentifiziert');
  }

  // Dokumenten-ID vor dem Löschen abrufen
  const { data: approval, error: fetchError } = await supabase
    .from('document_approvals')
    .select('document_id')
    .eq('id', approvalId)
    .eq('user_id', user.id)
    .single();

  if (fetchError) {
    console.error('Fehler beim Abrufen der Genehmigungsinformationen:', fetchError);
    throw fetchError;
  }

  const documentId = approval.document_id;

  // Genehmigung löschen
  const { error } = await supabase
    .from('document_approvals')
    .delete()
    .eq('id', approvalId)
    .eq('user_id', user.id);

  if (error) {
    console.error('Fehler beim Löschen der Genehmigung:', error);
    throw error;
  }

  // Prüfen, ob noch andere Genehmigungen für dieses Dokument existieren
  const { data: remainingApprovals, error: countError } = await supabase
    .from('document_approvals')
    .select('id')
    .eq('document_id', documentId);

  if (countError) {
    console.error('Fehler beim Zählen verbleibender Genehmigungen:', countError);
    throw countError;
  }

  // Wenn keine Genehmigungen mehr vorhanden sind, Dokumentstatus zurücksetzen
  if (remainingApprovals.length === 0) {
    const { error: updateError } = await supabase
      .from('documents')
      .update({ approval_status: null })
      .eq('id', documentId);

    if (updateError) {
      console.error('Fehler beim Zurücksetzen des Dokumentstatus:', updateError);
      throw updateError;
    }
  }
};
