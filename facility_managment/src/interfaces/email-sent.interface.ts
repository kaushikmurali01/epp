export interface IEmailSentAttributes {
  id: number | null;
  to: string;
  cc: string;
  subject: string;
  body: string;
  facility_id: number | null;
  created_at?: Date | null;
  updated_at?: Date | null;
  created_by?: number | null;
  updated_by?: number | null;
  is_system_generated: boolean;
}
