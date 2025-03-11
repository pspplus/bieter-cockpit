
import { supabase } from "@/integrations/supabase/client";
import { DocumentVersion } from "@/types/tender";
import { v4 as uuidv4 } from "uuid";

// Datenbankzeile in DocumentVersion-Typ konvertieren
const mapVersionFromDB = (version: any): DocumentVersion => {
  return {
    id: version.id,
    documentId: version.document_id,
    versionNumber: version.version_number,
    fileUrl: version.file_url,
    fileType: version.file_type,
    fileSize: version.file_size,
    uploadDate: new Date(version.upload_date),
    changesDescription: version.changes_description || "",
    userId: version.user_id
  };
};

// Versionen für ein Dokument abrufen
export const fetchDocumentVersions = async (documentId: string): Promise<DocumentVersion[]> => {
  const { data, error } = await supabase
    .from('document_versions')
    .select('*')
    .eq('document_id', documentId)
    .order('version_number', { ascending: false });

  if (error) {
    console.error('Fehler beim Abrufen der Dokumentversionen:', error);
    throw error;
  }

  return (data || []).map(mapVersionFromDB);
};

// Neue Version eines Dokuments hochladen
export const uploadNewVersion = async (
  file: File,
  documentId: string,
  currentVersion: number,
  changesDescription: string = ""
): Promise<DocumentVersion> => {
  // Aktuellen Benutzer abrufen
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('Benutzer nicht authentifiziert');
  }

  // Eindeutigen Dateinamen erstellen
  const uniqueId = uuidv4();
  const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_').replace(/_{2,}/g, '_');
  const uniqueFileName = `${uniqueId}-${sanitizedFileName}`;
  
  // Neue Versionsnummer berechnen
  const newVersionNumber = currentVersion + 1;
  
  // Datei hochladen
  const { data: fileData, error: uploadError } = await supabase
    .storage
    .from('tender_documents')
    .upload(uniqueFileName, file);

  if (uploadError) {
    console.error('Fehler beim Hochladen der Datei:', uploadError);
    throw uploadError;
  }

  // Öffentliche URL für die Datei abrufen
  const { data: urlData } = await supabase
    .storage
    .from('tender_documents')
    .getPublicUrl(uniqueFileName);

  const fileUrl = urlData.publicUrl;

  // Versionseintrag in der Datenbank erstellen
  const versionData = {
    document_id: documentId,
    version_number: newVersionNumber,
    file_url: fileUrl,
    file_type: file.type,
    file_size: file.size,
    upload_date: new Date().toISOString(),
    changes_description: changesDescription,
    user_id: user.id
  };

  const { data: version, error: versionError } = await supabase
    .from('document_versions')
    .insert(versionData)
    .select()
    .single();

  if (versionError) {
    console.error('Fehler beim Erstellen des Versionseintrags:', versionError);
    throw versionError;
  }

  // Dokumenteneintrag aktualisieren
  const { error: updateError } = await supabase
    .from('documents')
    .update({ 
      current_version: newVersionNumber,
      file_url: fileUrl,
      file_type: file.type,
      file_size: file.size
    })
    .eq('id', documentId);

  if (updateError) {
    console.error('Fehler beim Aktualisieren des Dokuments:', updateError);
    throw updateError;
  }

  return mapVersionFromDB(version);
};

// Eine bestimmte Version eines Dokuments abrufen
export const getSpecificVersion = async (documentId: string, versionNumber: number): Promise<DocumentVersion> => {
  const { data, error } = await supabase
    .from('document_versions')
    .select('*')
    .eq('document_id', documentId)
    .eq('version_number', versionNumber)
    .single();

  if (error) {
    console.error('Fehler beim Abrufen der Dokumentversion:', error);
    throw error;
  }

  return mapVersionFromDB(data);
};

// Eine bestimmte Version wiederherstellen
export const restoreVersion = async (documentId: string, versionNumber: number): Promise<void> => {
  // Zuerst die Versionsinformationen abrufen
  const { data: versionData, error: versionError } = await supabase
    .from('document_versions')
    .select('file_url, file_type, file_size')
    .eq('document_id', documentId)
    .eq('version_number', versionNumber)
    .single();

  if (versionError) {
    console.error('Fehler beim Abrufen der Versionsinformationen:', versionError);
    throw versionError;
  }

  // Dokumenteneintrag mit den Daten der ausgewählten Version aktualisieren
  const { error: updateError } = await supabase
    .from('documents')
    .update({ 
      file_url: versionData.file_url,
      file_type: versionData.file_type,
      file_size: versionData.file_size
    })
    .eq('id', documentId);

  if (updateError) {
    console.error('Fehler beim Wiederherstellen der Version:', updateError);
    throw updateError;
  }
};
