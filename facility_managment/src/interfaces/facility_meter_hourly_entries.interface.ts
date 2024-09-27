export interface IFacilityMeterHourlyEntriesAttributes {
    id: number;
    facility_id: number;
    facility_meter_detail_id?: number | null;
    meter_id?: string | null;
    year?: number | null;
    month?: number | null;
    usage?: number | null;
    media_url?: string | null;
    demand?: number | null;
    total_cost?: number | null;
    last_updated?: string | null;
    is_active?: number | null;
    created_at?: Date | null;
    updated_at?: Date | null;
    created_by?: number | null;
    updated_by?: number | null;
  }
  