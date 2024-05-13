import { IUserToken } from '../../interfaces/usertoken.interface';
import { ResponseHandler } from '../../utils/responseHandler';
import { HTTP_STATUS_CODES, RESPONSE_MESSAGES, STATUS} from '../../utils/status';
import { FACILITY_APPROVAL_STATUS, FACILITY_ID_GENERAL_STATUS, FACILITY_ID_SUBMISSION_STATUS, FACILITY_METER_TYPE, FACILITY_METER_TYPE_TEXT } from '../../utils/facility_status';
import { Facility } from '../../models/facility.model';
import { FacilityMeterDetail } from '../../models/facility_meter_details.model';
import { IBaseInterface } from '../../interfaces/baseline.interface';


export class FacilityMeterService {

  static async getFacilityMeterListing(userToken: IUserToken, offset:number, limit:number, colName:string, order:string, facilityId:number): Promise<FacilityMeterDetail[]> {
    try {
      const result = await FacilityMeterDetail.findAndCountAll({ where:{ facility_id: facilityId, is_active:STATUS.IS_ACTIVE} ,offset:offset, limit:limit, order: [[colName, order]]})    
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

  static async createNewMeterInFacility(userToken: IUserToken, body:IBaseInterface): Promise<FacilityMeterDetail[]> {
      try {
        const obj = {
          facility_id: body.facility_id,
          meter_name: body.meter_name,
          meter_type: body.meter_type,
          meter_id: body.meter_id,
          meter_active: body.meter_active,
          meter_inactive: body.meter_inactive,
          stil_in_use: body.stil_in_use,
          is_rg_meter: body.is_rg_meter,
          meter_specification_url: body.meter_specification_url,
          is_active: STATUS.IS_ACTIVE,
          created_by: userToken.id,
          purchased_from_the_grid: body.purchased_from_the_grid
        };
        const result = await FacilityMeterDetail.create(obj);
        return ResponseHandler.getResponse(HTTP_STATUS_CODES.SUCCESS, RESPONSE_MESSAGES.Success, result);
    
        
      } catch (error) {
        throw error;
      }
  
    }

  static async editMeterDetails(userToken: IUserToken, body:IBaseInterface, id:number): Promise<FacilityMeterDetail[]> {
    try {
      const obj = {
        meter_name: body.meter_name,
        meter_type: body.meter_type,
        meter_id: body.meter_id,
        meter_active: body.meter_active,
        meter_inactive: body.meter_inactive,
        stil_in_use: body.stil_in_use,
        is_rg_meter: body.is_rg_meter,
        meter_specification_url: body.meter_specification_url,
        is_active: STATUS.IS_ACTIVE,
        updated_by: userToken.id,
        updated_at : new Date(),
        purchased_from_the_grid: body.purchased_from_the_grid
        };
      const result = await FacilityMeterDetail.update(obj,{where:{id:id}})
  
      
      const resp = ResponseHandler.getResponse(HTTP_STATUS_CODES.SUCCESS, RESPONSE_MESSAGES.Success, result);
      return resp;
      
    } catch (error) {
      throw error;
    }
   
  }

  static async removeMeter(userToken: IUserToken, id:number): Promise<FacilityMeterDetail[]> {
    try {
      const result = await FacilityMeterDetail.update({is_active:STATUS.IS_DELETED} ,{where:{id:id}})
      const resp = ResponseHandler.getResponse(HTTP_STATUS_CODES.SUCCESS, RESPONSE_MESSAGES.Success, result);
      return resp;
      
    } catch (error) {
      throw error
      
    }
   
  }

  static async getFacilitieMeterById(userToken: IUserToken, facilityId:number): Promise<FacilityMeterDetail[]> {
    try {
      const result = await FacilityMeterDetail.findOne({where:{id:facilityId, is_active: STATUS.IS_ACTIVE}})
      const resp = ResponseHandler.getResponse(HTTP_STATUS_CODES.SUCCESS, RESPONSE_MESSAGES.Success, result);
      return resp;
      
    } catch (error) {
      throw error;
      
    }
   
  }

  static async getMeterStatistics(userToken: IUserToken, facilityId:number): Promise<FacilityMeterDetail[]> {
    try {

      const totalElectricMeter = await FacilityMeterDetail.count({where:{meter_type: FACILITY_METER_TYPE.ELECTRICITY}})
      const totalWaterMeter = await FacilityMeterDetail.count({where:{meter_type: FACILITY_METER_TYPE.WATER}})
      const totalNGMeter = await FacilityMeterDetail.count({where:{meter_type: FACILITY_METER_TYPE.NATURAL_GAS}})
      const result = [
        {"Meter type": FACILITY_METER_TYPE_TEXT.ELECTRICITY, "Total meters": totalElectricMeter, "Current energy date": new Date()},
        {"Meter type": FACILITY_METER_TYPE_TEXT.WATER, "Total meters": totalWaterMeter, "Current energy date": new Date()},
        {"Meter type": FACILITY_METER_TYPE_TEXT.NATURAL_GAS, "Total meters": totalNGMeter, "Current energy date": new Date()},
      ]
      const resp = ResponseHandler.getResponse(HTTP_STATUS_CODES.SUCCESS, RESPONSE_MESSAGES.Success, result);
      return resp;
      
    } catch (error) {
      throw error;
      
    }
   
  }





  
 


  
}