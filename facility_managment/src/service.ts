import { IUserToken } from './enerva-utils/interfaces/usertoken.interface';
import { ResponseHandler } from './enerva-utils/utils/responseHandler';
import { HTTP_STATUS_CODES, RESPONSE_MESSAGES, STATUS} from './enerva-utils/utils/status';
import { FACILITY_APPROVAL_STATUS, FACILITY_ID_GENERAL_STATUS, FACILITY_ID_SUBMISSION_STATUS } from './enerva-utils/utils/facility_status';
import { Facility } from './enerva-utils/models/facility.model';


export class FacilityService {


  static async getFacilities(userToken: IUserToken, offset:number, limit:number): Promise<Facility[]> {
    try {
      const result = await Facility.findAll({offset:offset, limit:limit})    
    const resp = ResponseHandler.getResponse(HTTP_STATUS_CODES.SUCCESS, RESPONSE_MESSAGES.Success, result);
    return resp;
      
    } catch (error) {
      throw error;
      
    }
    
  }

  static async getFacilitieById(userToken: IUserToken, facilityId:number): Promise<Facility[]> {
    try {
      const result = await Facility.findOne({where:{id:facilityId, is_active: STATUS.IS_ACTIVE}})
      const resp = ResponseHandler.getResponse(HTTP_STATUS_CODES.SUCCESS, RESPONSE_MESSAGES.Success, result);
      return resp;
      
    } catch (error) {
      throw error;
      
    }
   
  }

  static async createFacilitie(userToken: IUserToken, body:any): Promise<Facility[]> {
    try {
      const obj = {
        facility_construction_status: body.facility_construction_status,
        facility_name: body.facility_name,
        naic_code: body.naic_code,
        facility_category: body.facility_category,
        facility_type: body.facility_type,
        target_saving: body.target_saving,
        display_pic_url: body.display_pic_url,
        unit_number: body.unit_number,
        street_number: body.street_number,
        street_name: body.street_name,
        city: body.city,
        country: body.country,
        province: body.province,
        postal_code: body.postal_code,
        address: body.address,
        sector: body.sector,
        year_of_construction: body.year_of_construction,
        gross_floor_area: body.gross_floor_area,
        number_of_storeys: body.number_of_storeys,
        occupancy: body.occupancy,
        number_of_building: body.number_of_building,
        company_id: body.company_id,
        facility_id_general_status: Number(FACILITY_ID_GENERAL_STATUS.INITIAL),
        facility_id_submission_status: Number(FACILITY_ID_SUBMISSION_STATUS.INITIAL),
        ng_distribution_company: body.ng_distribution_company,
        ng_distribution_company_data_extraction:body.ng_distribution_company_data_extraction,
        longitude: body.longitude,
        latitude: body.latitude,
        facility_bas: body.facility_bas,
        facility_bas_connectivity: body.facility_bas_connectivity,
        is_approved: Boolean(FACILITY_APPROVAL_STATUS.INITIAL),
        is_active: STATUS.IS_ACTIVE,
        created_by: userToken.userId,
        updated_by: userToken.userId
  
        // facility_id_general_status: Number(FACILITY_ID_GENERAL_STATUS.INITIAL),
        // facility_id_submission_status: Number(FACILITY_ID_SUBMISSION_STATUS.INITIAL),
        // facility_name: body.facility_name,
        // address: body.address,
        // city: body.city,
        // postal_code: body.postalcode,
        // province: body.province,
        // sector: body.sector,
        // ng_distribution_company: body.ng_distribution_company,
        // ng_distribution_company_data_extraction: body.ng_distribution_company_data_extraction,
        // primary_facility_type: body.facility_type,
        // all_facility_types: body.all_facility_types,
        // year_built: body.year_built,
        // floor_count: body.floor_count,
        // facility_gfa: body.facility_gfa,
        // facility_occupied_gfa: body.facility_occupied_gfa,
        // facility_unoccupied_gfa: body.facility_unoccupied_gfa,
        // longitude: body.longitude,
        // latitude: body.latitude,
        // facility_bas: body.facility_bas,
        // facility_bas_connectivity: body.facility_bas_connectivity,
        // is_approved: Boolean(FACILITY_APPROVAL_STATUS.INITIAL),
        // is_active: STATUS.IS_ACTIVE,
        // created_by: userToken.userId,
        // updated_by: userToken.userId
      };
  
      
   
      const result = await Facility.create(obj);
      return ResponseHandler.getResponse(HTTP_STATUS_CODES.SUCCESS, RESPONSE_MESSAGES.Success, result);
  
      
    } catch (error) {
      throw error;
    }

  }

  static async editFacilitie(userToken: IUserToken, body:any, facilityId:number): Promise<Facility[]> {
    try {
      const obj = {
        facility_construction_status: body.facility_construction_status,
        facility_name: body.facility_name,
        naic_code: body.naic_code,
        facility_category: body.facility_category,
        facility_type: body.facility_type,
        target_saving: body.target_saving,
        display_pic_url: body.display_pic_url,
        unit_number: body.unit_number,
        street_number: body.street_number,
        street_name: body.street_name,
        city: body.city,
        country: body.country,
        province: body.province,
        postal_code: body.postal_code,
        address: body.address,
        sector: body.sector,
        year_of_construction: body.year_of_construction,
        gross_floor_area: body.gross_floor_area,
        number_of_storeys: body.number_of_storeys,
        occupancy: body.occupancy,
        number_of_building: body.number_of_building,
        company_id: body.company_id,
        facility_id_general_status: Number(FACILITY_ID_GENERAL_STATUS.INITIAL),
        facility_id_submission_status: Number(FACILITY_ID_SUBMISSION_STATUS.INITIAL),
        ng_distribution_company: body.ng_distribution_company,
        ng_distribution_company_data_extraction:body.ng_distribution_company_data_extraction,
        longitude: body.longitude,
        latitude: body.latitude,
        facility_bas: body.facility_bas,
        facility_bas_connectivity: body.facility_bas_connectivity,
        is_approved: Boolean(FACILITY_APPROVAL_STATUS.INITIAL),
        is_active: STATUS.IS_ACTIVE,
        updated_by: userToken.userId,
        updated_at : new Date()
        };
      const result = await Facility.update(obj,{where:{id:facilityId}})
  
      
      const resp = ResponseHandler.getResponse(HTTP_STATUS_CODES.SUCCESS, RESPONSE_MESSAGES.Success, result);
      return resp;
      
    } catch (error) {
      throw error;
    }
   
  }

  static async deleteFacilitie(userToken: IUserToken, facilityId:number): Promise<Facility[]> {
    try {
      const result = await Facility.update({is_active:0} ,{where:{id:facilityId}})
      const resp = ResponseHandler.getResponse(HTTP_STATUS_CODES.SUCCESS, RESPONSE_MESSAGES.Success, result);
      return resp;
      
    } catch (error) {
      throw error
      
    }
   
  }

  static async enervaApproveFacilitieById(userToken: IUserToken, facilityId:number): Promise<Facility[]> {
    try {
      
      const obj = {
        facility_id_submission_status: FACILITY_ID_SUBMISSION_STATUS.APPROVED, 
        is_approved: Boolean(FACILITY_APPROVAL_STATUS.INITIAL),
        is_active: Number(STATUS.IS_ACTIVE),
        approved_by: userToken.userId, 
      }
      const result = await Facility.update(obj,{where:{id:facilityId}})
      const resp = ResponseHandler.getResponse(HTTP_STATUS_CODES.SUCCESS, RESPONSE_MESSAGES.Success, result);
      return resp;
    } catch (error) {
      throw error;
      
    }
   
  }


  
}