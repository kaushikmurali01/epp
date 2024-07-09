export interface IEmailTemplateAttributes {
    id: number | null;
    facility_id: number;
    name: string;
    subject: string;
    body: string;
    created_at?: Date | null;
    updated_at?: Date | null;
    created_by?: number | null;
    updated_by?: number | null;
  }