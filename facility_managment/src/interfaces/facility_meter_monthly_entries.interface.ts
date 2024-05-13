export interface IFacilityMeterMonthlyEntriesAttributes {
    id: number;
    facility_id: number;
    facility_meter_detail_id?: number | null;
    meter_id?: number | null;
    year?: number | null;
    start_date?: Date | null;
    end_date?: Date | null;
    usage?: number | null;
    demand?: number | null;
    total_cost?: number | null;
    last_updated?: string | null;
    is_active?: number | null;
    created_at?: Date | null;
    updated_at?: Date | null;
    created_by?: number | null;
    updated_by?: number | null;
}