export interface IFacilityMeterDetailAttributes {
    id: number;
    facility_id: number;
    meter_name?: string | null;
    meter_type?: number | null; // 1 => electricity, 2 => natural gas, 3 => water
    meter_id?: number | null;
    meter_active?: Date | null;
    meter_inactive?: Date | null;
    stil_in_use?: boolean | null;
    is_rg_meter?: boolean | null;
    meter_spec_as_per_measurement?: string | null
    meter_specification_url?: string | null;
    is_active?: number | null;
    created_at?: Date | null;
    updated_at?: Date | null;
    created_by?: number | null;
    updated_by?: number | null;
    purchased_from_the_grid?: boolean | null;
    unit?: string | null;
}
