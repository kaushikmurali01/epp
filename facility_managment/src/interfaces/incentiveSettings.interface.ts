import { IFacilityAttributes } from "./facility.interface";

export interface IIncentiveSettingsAttributes {
  id: number | null;
  facility_id: number;
  p4pStartDate1: Date;
  p4pEndDate1: Date;
  p4pStartDate2: Date;
  p4pEndDate2: Date;
  incentive_cap: number;
  p4pStartDate3: Date;
  meter_type: number;
  p4pEndDate3: Date;
  preProjectIncentive: number;
  preProjectIncentiveStatus: string;
  p4pIncentiveStatus1: string;
  p4pIncentiveStatus2: string;
  p4pIncentiveStatus3: string;
  onPeakIncentiveRate: number;
  offPeakIncentiveRate: number;
  minimumSavings: number;
  created_at: Date;
  updated_at: Date | null;
  created_by: number;
  updated_by: number | null;
  facility?: IFacilityAttributes;
}
