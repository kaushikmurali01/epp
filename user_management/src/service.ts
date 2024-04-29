import { IUserToken } from 'enerva-utils/interfaces/usertoken.interface';
import { ResponseHandler } from 'enerva-utils/utils/responseHandler';
import { HTTP_STATUS_CODES, RESPONSE_MESSAGES, STATUS} from 'enerva-utils/utils/status';
import { FACILITY_APPROVAL_STATUS, FACILITY_ID_GENERAL_STATUS, FACILITY_ID_SUBMISSION_STATUS } from 'enerva-utils/utils/facility_status';
import { Facility } from 'enerva-utils/models/facility.model';
 
 
export class FacilityService {
 
 
  static async getFacilities(userToken: IUserToken): Promise<Facility[]> {
    const result = await Facility.findAll()
    const resp = ResponseHandler.getResponse(HTTP_STATUS_CODES.SUCCESS, RESPONSE_MESSAGES.Success, result);
    return resp ;
  }
 
  static async getFacilitieById(userToken: IUserToken, facilityId:number): Promise<Facility[]> {
    const result = await Facility.findOne({where:{id:facilityId, is_active: STATUS.IS_ACTIVE}})
    const resp = ResponseHandler.getResponse(HTTP_STATUS_CODES.SUCCESS, RESPONSE_MESSAGES.Success, result);
    return resp;
  }
 
  static async createFacilitie(userToken: IUserToken, body:any): Promise<Facility[]> {
    const obj = {
      Facility_ID_General_Status: Number(FACILITY_ID_GENERAL_STATUS.INITIAL),
      Facility_ID_Submission_Status: Number(FACILITY_ID_SUBMISSION_STATUS.INITIAL),
      Facility_Name: body.facility_name,
      Address: body.address,
      City: body.city,
      Postal_Code: body.postalcode,  
      Province: body.province,  
      Sector: body.sector,  
      NG_distribution_Company: body.ng_distribution_company,
      NG_distribution_Company_data_extraction: body.ng_distribution_company_data_extraction,
      Primary_Facility_Type: body.facility_type,
      All_Facility_Types: body.all_facility_types,
      Year_Built: body.year_built,
      floor_count: body.floor_count,
      Facility_GFA: body.facility_gfa,
      Facility_Occupied_GFA: body.facility_occupied_gfa,
      Facility_Unoccupied_GFA: body.facility_unoccupied_gfa,
      Longitude: body.longitude,
      Latitude: body.latitude,
      Facility_BAS: body.facility_bas,
      Facility_BAS_Connectivity: body.facility_bas_connectivity,
      is_approved: Boolean(FACILITY_APPROVAL_STATUS.INITIAL),
      is_active: STATUS.IS_ACTIVE,
      created_by: userToken.userId,
      updated_by: userToken.userId,
    }
    const result = await Facility.create(obj);
    const resp = ResponseHandler.getResponse(HTTP_STATUS_CODES.SUCCESS, RESPONSE_MESSAGES.Success, result);
    return resp;
  }
 
  static async editFacilitie(userToken: IUserToken, body:any, facilityId:number): Promise<Facility[]> {
    const obj = {
      Facility_ID_General_Status: Number(FACILITY_ID_GENERAL_STATUS.INITIAL),
      Facility_ID_Submission_Status: Number(FACILITY_ID_SUBMISSION_STATUS.INITIAL),
      Facility_Name: body.facility_name,
      Address: body.address,
      City: body.city,
      Postal_Code: body.postalcode,  
      Province: body.province,  
      Sector: body.sector,  
      NG_distribution_Company: body.ng_distribution_company,
      NG_distribution_Company_data_extraction: body.ng_distribution_company_data_extraction,
      Primary_Facility_Type: body.facility_type,
      All_Facility_Types: body.all_facility_types,
      Year_Built: body.year_built,
      floor_count: body.floor_count,
      Facility_GFA: body.facility_gfa,
      Facility_Occupied_GFA: body.facility_occupied_gfa,
      Facility_Unoccupied_GFA: body.facility_unoccupied_gfa,
      Longitude: body.longitude,
      Latitude: body.latitude,
      Facility_BAS: body.facility_bas,
      Facility_BAS_Connectivity: body.facility_bas_connectivity,
      is_approved: Boolean(FACILITY_APPROVAL_STATUS.INITIAL),
      is_active: Number(STATUS.IS_ACTIVE),
      created_by: userToken.userId,
      updated_by: userToken.userId,
 
    }
    const result = await Facility.update(obj,{where:{id:facilityId}})
    const resp = ResponseHandler.getResponse(HTTP_STATUS_CODES.SUCCESS, RESPONSE_MESSAGES.Success, result);
    return resp;
  }
 
  static async deleteFacilitie(userToken: IUserToken, facilityId:number): Promise<Facility[]> {
    const result = await Facility.update({is_active:0} ,{where:{id:facilityId}})
    const resp = ResponseHandler.getResponse(HTTP_STATUS_CODES.SUCCESS, RESPONSE_MESSAGES.Success, result);
    return resp;
  }
 
  static async enervaApproveFacilitieById(userToken: IUserToken, facilityId:number): Promise<Facility[]> {
    const obj = {
      Facility_ID_Submission_Status: FACILITY_ID_SUBMISSION_STATUS.APPROVED,
      is_approved: Boolean(FACILITY_APPROVAL_STATUS.INITIAL),
      is_active: Number(STATUS.IS_ACTIVE),
      approved_by: userToken.userId,
    }
    const result = await Facility.update(obj,{where:{id:facilityId}})
    const resp = ResponseHandler.getResponse(HTTP_STATUS_CODES.SUCCESS, RESPONSE_MESSAGES.Success, result);
    return resp;
  }
}