import { HTTP_STATUS_CODES, RESPONSE_MESSAGES, STATUS } from "../../../utils/status";
import { ResponseHandler } from '../../../utils/responseHandler';
import { Facility } from "../../../models/facility.model";
import { HttpRequest } from "@azure/functions";
import { IBaseInterface } from "../../../interfaces/baseline.interface";
import { decodeToken } from "../../../helper/authantication";
import { IUserToken } from "../../../interfaces/usertoken.interface";
import { FACILITY_APPROVAL_STATUS, FACILITY_ID_GENERAL_STATUS, FACILITY_ID_SUBMISSION_STATUS } from "../../../utils/facility_status";
import { Company } from "../../../models/company.model";
import { ParticipantAgreement } from "../../../models/participant_agreement.model";
import { User } from "../../../models/user.model";
import { creatSignDocumentUrlForUser } from "../../../helper/create-doc";

export class AdminFacilityService {


  static async getFacility(userToken: IUserToken, offset:number, limit:number, status:number, colName:string, order:string): Promise<Facility[]> {
    try {
      const result = await Facility.findAndCountAll({where:{facility_id_submission_status:status, is_active: STATUS.IS_ACTIVE} ,offset:offset, limit:limit, order: [[colName, order]]}) 
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
        facility_id_submission_status: Number(FACILITY_ID_SUBMISSION_STATUS.DRAFT),
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

  static async getFacilityStats(userToken: IUserToken): Promise<Facility[]> {
    try {
      
      const allFacility = await Facility.count({where:{is_active:STATUS.IS_ACTIVE}})
      const allCompany = await Company.count()
      const allPaSigned = await ParticipantAgreement.count({where:{is_signed:true}})
      const allFacilityWithBaselineApproval = await Facility.count({where:{is_active:STATUS.IS_ACTIVE, facility_id_submission_status:FACILITY_ID_SUBMISSION_STATUS.BASELINE_APPROVED}})
      const allFacilityEndrolled = await Facility.count({where:{is_active:STATUS.IS_ACTIVE, facility_id_submission_status:FACILITY_ID_SUBMISSION_STATUS.APPROVED}})
      const allFacilityInY1 = await Facility.count({where:{is_active:STATUS.IS_ACTIVE}})
      const allFacilityInY2 = await Facility.count({where:{is_active:STATUS.IS_ACTIVE}})
      const allFacilityInY3 = await Facility.count({where:{is_active:STATUS.IS_ACTIVE}})

      const result = { all_pa_signed: allPaSigned, all_company: allCompany, all_facility: allFacility, all_acility_with_baseline_approval: allFacilityWithBaselineApproval,  all_facility_endrolled: allFacilityEndrolled, all_facility_in_y1: allFacilityInY1, all_facility_in_y2: allFacilityInY2, all_facility_in_y3: allFacilityInY3}

      const resp = ResponseHandler.getResponse(HTTP_STATUS_CODES.SUCCESS, RESPONSE_MESSAGES.Success, result);
      return resp;
    } catch (error) {
      throw error;
      
    }
  }

  static async getPaData(userToken: IUserToken, body:IBaseInterface): Promise<Facility[]> {
    try {

      const oldData = await ParticipantAgreement.findOne({where:{company_id: body.company_id, is_active:STATUS.IS_ACTIVE}})
      let result;

      if(oldData){

        // const obj = {
        //   company_id : body.company_id,
        //   unsigned_doc : body.unsigned_doc,
        //   is_signed : false,
        //   signed_on : new Date(),
        //   is_active : STATUS.IS_ACTIVE
        // }
        
         result = oldData;


      }else{
        const obj = {

          company_id : body.company_id,
          unsigned_doc : body.unsigned_doc,
          is_signed : false,
          signed_on : new Date(),
          is_active : STATUS.IS_ACTIVE
        }
        
         result = await ParticipantAgreement.create(obj)

      }
      

      const resp = ResponseHandler.getResponse(HTTP_STATUS_CODES.SUCCESS, RESPONSE_MESSAGES.Success, result);
      return resp;
    } catch (error) {
      throw error;
      
    }
  }

  static async getDashboardStats(userToken: IUserToken): Promise<Facility[]> {
    try {
      
      const allFacility = await Facility.count({where:{is_active:STATUS.IS_ACTIVE}})
      const allUser = await User.count()
      const allCompany = await Company.count()
      const allPaSigned = await ParticipantAgreement.count({where:{is_signed:true}})
      const allpa = await ParticipantAgreement.count({where:{is_active:STATUS.IS_ACTIVE}})
     

      const result = {all_user: allUser,  all_facility: allFacility, all_company: allCompany, all_pa_signed: allPaSigned, all_pa: allpa}

      const resp = ResponseHandler.getResponse(HTTP_STATUS_CODES.SUCCESS, RESPONSE_MESSAGES.Success, result);
      return resp;
    } catch (error) {
      throw error;
      
    }
  }

  static async signPaById(userToken: IUserToken, body:IBaseInterface, companyId:number): Promise<Facility[]> {
    try {

      const olResult = await ParticipantAgreement.findOne({where:{company_id:companyId}})

      if(olResult.is_signed === true){
        const resp = ResponseHandler.getResponse(HTTP_STATUS_CODES.SUCCESS, RESPONSE_MESSAGES.paAlreadySigned, []);
      return resp;
      }else if(olResult.is_signed === false)
      {
        if(body.signed_doc){
          const obj = {
            signed_doc: body.signed_doc,
            is_signed: true,
            is_active: STATUS.IS_ACTIVE,
            updated_by: userToken.id,
            updated_at : new Date()
            };
            
          const result = await ParticipantAgreement.update(obj,{where:{company_id:companyId}})
          
          const resp = ResponseHandler.getResponse(HTTP_STATUS_CODES.SUCCESS, RESPONSE_MESSAGES.Success, result);
          return resp;
  
        }else if(body.upload_sign && body.username){
  
          const originalPdfPath = body.unsigned_doc ? body.unsigned_doc : "https://eppdevstorage.blob.core.windows.net/agreement-docs/Energy-Performance-Program-Participant-Agreement.pdf"
          const signatureImagePath = body.upload_sign
    
          const signURL = await creatSignDocumentUrlForUser(originalPdfPath, signatureImagePath, body.username, body.rolename)
  
          const obj = {
            upload_sign: body.upload_sign,
            signed_doc: signURL,
            is_signed: true,
            is_active: STATUS.IS_ACTIVE,
            updated_by: userToken.id,
            updated_at : new Date()
            };
    
          const result =  await ParticipantAgreement.update(obj,{where:{company_id:companyId}})
          const resp = ResponseHandler.getResponse(HTTP_STATUS_CODES.SUCCESS, RESPONSE_MESSAGES.Success, result);
          return resp;
        }else{
          const resp = ResponseHandler.getResponse(HTTP_STATUS_CODES.CONFLICT_ERROR, RESPONSE_MESSAGES.invalidJson, []);
          return resp;
        }
      }
    } catch (error) {
      throw error;
    }
   
  }

  static async getPaDataById(userToken: IUserToken, conpanyId:number): Promise<Facility[]> {
    try {
      const result = await ParticipantAgreement.findOne({where:{company_id:conpanyId}})
      
      const resp = ResponseHandler.getResponse(HTTP_STATUS_CODES.SUCCESS, RESPONSE_MESSAGES.Success, result);
      return resp;
      
    } catch (error) {
      throw error;
    }
   
  }

  

  
  
}