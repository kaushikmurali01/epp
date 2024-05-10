import { IUserToken } from '../enerva-utils/interfaces/usertoken.interface';
import { ResponseHandler } from '../enerva-utils/utils/responseHandler';
import { HTTP_STATUS_CODES, RESPONSE_MESSAGES, STATUS} from '../enerva-utils/utils/status';
import { FACILITY_APPROVAL_STATUS, FACILITY_ID_GENERAL_STATUS, FACILITY_ID_SUBMISSION_STATUS } from '../enerva-utils/utils/facility_status';
import { Facility } from '../enerva-utils/models/facility.model';
import { IBaseInterface } from '../enerva-utils/interfaces/baseline.interface';
import { Op } from 'sequelize';


export class FacilityService {


  static async getFacility(userToken: IUserToken, offset:number, limit:number, colName:string, order:string, searchPromt:string): Promise<Facility[]> {

    try {
    // const result = await Facility.findAndCountAll({where:{is_active:STATUS.IS_ACTIVE},offset:offset, limit:limit, order: [[colName, order]]})  
    const result = await Facility.findAndCountAll({
      where: {
          created_by: userToken.id,
          is_active: STATUS.IS_ACTIVE,
          [Op.or]: [
              { facility_name: { [Op.iLike]: `%${searchPromt}%` } },
              { street_number: { [Op.iLike]: `%${searchPromt}%` } },
              { street_name: { [Op.iLike]: `%${searchPromt}%` } },
              { city: { [Op.iLike]: `%${searchPromt}%` } },
              { country: { [Op.iLike]: `%${searchPromt}%` } }
          ]
      },
      offset: offset,
      limit: limit,
      order: [[colName, order]]
  });  

  if(result){
    const resp = ResponseHandler.getResponse(HTTP_STATUS_CODES.SUCCESS, RESPONSE_MESSAGES.Success, result);
    return resp;
  }else{
    const resp = ResponseHandler.getResponse(HTTP_STATUS_CODES.SUCCESS, RESPONSE_MESSAGES.noContent, []);
    return resp;
  }
   
      
    } catch (error) {
      throw error;
      
    }
    
  }

  static async getFacilityById(userToken: IUserToken, facilityId:number): Promise<Facility[]> {
    try {
      const result = await Facility.findOne({where:{id:facilityId, is_active: STATUS.IS_ACTIVE}})
      const resp = ResponseHandler.getResponse(HTTP_STATUS_CODES.SUCCESS, RESPONSE_MESSAGES.Success, result);
      return resp;
      
    } catch (error) {
      throw error;
      
    }
   
  }

  static async createFacility(userToken: IUserToken, body:IBaseInterface): Promise<Facility[]> {
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
        facility_id_general_status: Number(FACILITY_ID_GENERAL_STATUS.DRAFT),
        facility_id_submission_status: Number(FACILITY_ID_SUBMISSION_STATUS.READY_FOR_SUBMISSION),
        ng_distribution_company: body.ng_distribution_company,
        ng_distribution_company_data_extraction:body.ng_distribution_company_data_extraction,
        longitude: body.longitude,
        latitude: body.latitude,
        facility_bas: body.facility_bas,
        facility_bas_connectivity: body.facility_bas_connectivity,
        is_approved: Boolean(FACILITY_APPROVAL_STATUS.INITIAL),
        is_active: STATUS.IS_ACTIVE,
        created_by: userToken.id,
        updated_by: userToken.id
      };
      const result = await Facility.create(obj);
      return ResponseHandler.getResponse(HTTP_STATUS_CODES.SUCCESS, RESPONSE_MESSAGES.Success, result);
    } catch (error) {
      throw error;
    }

  }

  static async editFacility(userToken: IUserToken, body:IBaseInterface, facilityId:number): Promise<Facility[]> {
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
        facility_id_general_status: Number(FACILITY_ID_GENERAL_STATUS.DRAFT),
        facility_id_submission_status: Number(FACILITY_ID_SUBMISSION_STATUS.DRAFT),
        ng_distribution_company: body.ng_distribution_company,
        ng_distribution_company_data_extraction:body.ng_distribution_company_data_extraction,
        longitude: body.longitude,
        latitude: body.latitude,
        facility_bas: body.facility_bas,
        facility_bas_connectivity: body.facility_bas_connectivity,
        is_approved: Boolean(FACILITY_APPROVAL_STATUS.INITIAL),
        is_active: STATUS.IS_ACTIVE,
        updated_by: userToken.id,
        updated_at : new Date()
        };
      const result = await Facility.update(obj,{where:{id:facilityId}})
  
      
      const resp = ResponseHandler.getResponse(HTTP_STATUS_CODES.SUCCESS, RESPONSE_MESSAGES.Success, result);
      return resp;
      
    } catch (error) {
      throw error;
    }
   
  }

  static async deleteFacility(userToken: IUserToken, facilityId:number): Promise<Facility[]> {
    try {
      const result = await Facility.update({is_active:STATUS.IS_DELETED} ,{where:{id:facilityId}})
      const resp = ResponseHandler.getResponse(HTTP_STATUS_CODES.SUCCESS, RESPONSE_MESSAGES.Success, result);
      return resp;
      
    } catch (error) {
      throw error
      
    }
   
  }
  
  static async submitForapprovalByUser(userToken: IUserToken, facilityId:number): Promise<Facility[]> {
    try {
      
      const obj = {
        facility_id_submission_status: FACILITY_ID_SUBMISSION_STATUS.SUBMITTED, 
        is_approved: Boolean(FACILITY_APPROVAL_STATUS.INITIAL),
        is_active: Number(STATUS.IS_ACTIVE),
      }
      const result = await Facility.update(obj,{where:{id:facilityId}})
      const resp = ResponseHandler.getResponse(HTTP_STATUS_CODES.SUCCESS, RESPONSE_MESSAGES.Success, result);
      return resp;
    } catch (error) {
      throw error;
      
    }
   
  }

  static async getCurrentStatusOfFacility(userToken: IUserToken, facilityId:number): Promise<Facility[]> {
    try {
      
      const result = await Facility.findOne({where:{id:facilityId}, attributes: ['id', 'naic_code', 'facility_id_general_status']})
      const resp = ResponseHandler.getResponse(HTTP_STATUS_CODES.SUCCESS, RESPONSE_MESSAGES.Success, result);
      return resp;
    } catch (error) {
      throw error;
      
    }
  }

  static async editStatusOfFacility(userToken: IUserToken, body:IBaseInterface, facilityId:number): Promise<Facility[]> {
    try {
      const obj = {
        facility_id_general_status: Number(body.facility_id_general_status),
        updated_by: userToken.id,
        updated_at : new Date()
        };
      const result =  await Facility.update(obj,{where:{id:facilityId}} )
  
      const resp = ResponseHandler.getResponse(HTTP_STATUS_CODES.SUCCESS, RESPONSE_MESSAGES.Success, result);
      return resp;
      
    } catch (error) {
      throw error;
    }
   
  }


 
  
}