export interface IParticipantAgreementAttributes {
    id: number;
    company_id?: number | null;
    unsigned_doc?: string | null;
    upload_sign?: string | null;
    is_signed?: boolean | null;
    signed_doc?: string | null;
    status?: number | null;
    signed_on?: Date | null;
    is_active?: number | null;
    created_at?: Date | null;
    updated_at?: Date | null;
    created_by?: number | null;
    updated_by?: number | null;
}
 
 
 