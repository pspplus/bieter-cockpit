
import { Vertragsart, Zertifikat } from "@/types/tender";

export const displayZertifikate = (zertifikate?: Zertifikat[]) => {
  if (!zertifikate || zertifikate.length === 0) return "-";
  
  return zertifikate.map(zertifikat => {
    switch(zertifikat) {
      case 'din_iso_9001': return "DIN ISO 9001";
      case 'din_iso_14001': return "DIN ISO 14001";
      case 'din_iso_45001': return "DIN ISO 45001";
      default: return zertifikat;
    }
  }).join(", ");
};

export const displayObjektarten = (objektarten?: string[]) => {
  if (!objektarten || objektarten.length === 0) return "-";
  
  return objektarten.map(objektart => {
    switch(objektart) {
      case 'grundschule': return "Grundschule";
      case 'kindergarten': return "Kindergarten";
      case 'buero': return "Büro";
      case 'keine_angabe': return "-";
      default: return objektart;
    }
  }).join(", ");
};

export const displayVertragsart = (vertragsart?: Vertragsart) => {
  if (!vertragsart || vertragsart === 'keine_angabe') return "-";
  
  switch(vertragsart) {
    case 'werkvertrag': return "Werkvertrag";
    case 'dienstleistungsvertrag': return "Dienstleistungsvertrag";
    case 'mischvertrag': return "Mischvertrag";
    default: return vertragsart;
  }
};
