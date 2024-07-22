export interface IContactAttributes {
    id: number | null;
    facility_id: number; 
    name: string;
    company_name: string;
    email: string;
    role: string;
    phone: string;
    unit_number: string;
    street_number: string;
    street_name: string;
    city: string;
    province: string;
    country: string;
    postal_code: string;
    created_at?: Date | null;
    updated_at?: Date | null;
    created_by: number;
    updated_by?: number | null;
  }