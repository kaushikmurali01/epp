import * as Yup from 'yup';
import { FACILITY_ID_GENERAL_STATUS, FACILITY_ID_SUBMISSION_STATUS } from '../enerva-utils/utils/facility_status';

export const cacilitySchema = Yup.object({
        facility_construction_status: Yup.string().required(),
        facility_name: Yup.string().required(),
        naic_code: Yup.string().required(),
        facility_category: Yup.string().required(),
        facility_type: Yup.string().required(),
        target_saving: Yup.number().required(),
        display_pic_url: Yup.string().url().required(),
        unit_number: Yup.string().required(),
        street_number: Yup.string().required(),
        street_name: Yup.string().required(),
        city: Yup.string().required(),
        country: Yup.string().required(),
        province: Yup.string().required(),
        postal_code: Yup.string().required(),
        address: Yup.string().required(),
        sector: Yup.string().required(),
        year_of_construction: Yup.number().required(),
        gross_floor_area: Yup.number().required(),
        number_of_storeys: Yup.number().required(),
        occupancy: Yup.string().required(),
        number_of_building: Yup.number().required(),
        company_id: Yup.string().required(),
        // facility_id_general_status: Yup.number().oneOf(
        //     Object.values(FACILITY_ID_GENERAL_STATUS)
        //   ).required(),
        // facility_id_submission_status:Yup.number().oneOf(
        //     Object.values(FACILITY_ID_SUBMISSION_STATUS)
        //   ).required(),
        ng_distribution_company: Yup.string().required(),
        ng_distribution_company_data_extraction: Yup.string().required(),
        longitude: Yup.number().required(),
        latitude: Yup.number().required(),
        facility_bas: Yup.string().required(),
        facility_bas_connectivity: Yup.string().required(),
      });

