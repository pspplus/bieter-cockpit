
import { supabase } from "@/integrations/supabase/client";
import { DocumentComment } from "@/types/tender";

// Datenbankzeile in DocumentComment-Typ konvertieren
const mapCommentFromDB = (comment: any): DocumentComment => {
  return {
    id: comment.id,
    documentId: comment.document_id,
    userId: comment.user_id,
    userName: comment.user_id, // Fallback, falls kein Name verfügbar ist
    comment: comment.comment,
    createdAt: new Date(comment.created_at),
    updatedAt: new Date(comment.updated_at)
  };
};

// Kommentare für ein Dokument abrufen
export const fetchDocumentComments = async (documentId: string): Promise<DocumentComment[]> => {
  const { data, error } = await supabase
    .from('document_comments')
    .select('*')
    .eq('document_id', documentId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Fehler beim Abrufen der Kommentare:', error);
    throw error;
  }

  const comments = (data || []).map(mapCommentFromDB);
  
  // Holen der Benutzerprofile für die Anzeigenamen
  for (const comment of comments) {
    try {
      const { data: userData } = await supabase.auth.admin.getUserById(comment.userId);
      if (userData && userData.user) {
        comment.userName = userData.user.email || comment.userId;
      }
    } catch (error) {
      console.error('Fehler beim Abrufen der Benutzerinformationen:', error);
      // Fallback ist bereits in mapCommentFromDB gesetzt
    }
  }

  return comments;
};

// Neuen Kommentar hinzufügen
export const addComment = async (documentId: string, comment: string): Promise<DocumentComment> => {
  // Aktuellen Benutzer abrufen
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('Benutzer nicht authentifiziert');
  }

  const commentData = {
    document_id: documentId,
    user_id: user.id,
    comment,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const { data, error } = await supabase
    .from('document_comments')
    .insert(commentData)
    .select()
    .single();

  if (error) {
    console.error('Fehler beim Hinzufügen des Kommentars:', error);
    throw error;
  }

  return mapCommentFromDB(data);
};

// Kommentar aktualisieren
export const updateComment = async (commentId: string, comment: string): Promise<DocumentComment> => {
  // Aktuellen Benutzer abrufen
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('Benutzer nicht authentifiziert');
  }

  const { data, error } = await supabase
    .from('document_comments')
    .update({
      comment,
      updated_at: new Date().toISOString()
    })
    .eq('id', commentId)
    .eq('user_id', user.id) // Sicherstellen, dass nur der Ersteller den Kommentar aktualisieren kann
    .select()
    .single();

  if (error) {
    console.error('Fehler beim Aktualisieren des Kommentars:', error);
    throw error;
  }

  return mapCommentFromDB(data);
};

// Kommentar löschen
export const deleteComment = async (commentId: string): Promise<void> => {
  // Aktuellen Benutzer abrufen
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('Benutzer nicht authentifiziert');
  }

  const { error } = await supabase
    .from('document_comments')
    .delete()
    .eq('id', commentId)
    .eq('user_id', user.id); // Sicherstellen, dass nur der Ersteller den Kommentar löschen kann

  if (error) {
    console.error('Fehler beim Löschen des Kommentars:', error);
    throw error;
  }
};
