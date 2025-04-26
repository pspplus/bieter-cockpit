
export interface Client {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  createdAt: Date;
  quick_check_info?: string;
  besichtigung_info?: string;
  konzept_info?: string;
  kalkulation_info?: string;
  dokumente_pruefen_info?: string;
  ausschreibung_einreichen_info?: string;
  aufklaerung_info?: string;
  implementierung_info?: string;
}
