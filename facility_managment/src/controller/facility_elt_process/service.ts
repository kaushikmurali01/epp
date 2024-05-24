import { IUserToken } from '../../interfaces/usertoken.interface';
import { ResponseHandler } from '../../utils/response-handler';
import { HTTP_STATUS_CODES, RESPONSE_MESSAGES, STATUS} from '../../utils/status';
import { FacilityMeterMonthlyEntries } from '../../models/facility_meter_monthly_entries';
import { IBaseInterface } from '../../interfaces/baseline.interface';
import { FacilityMeterHourlyEntries } from '../../models/facility_meter_hourly_entries.model';



export class FacilityEtlService {

  static async getFacilityMeterMonthlyEntriesListing(userToken: IUserToken, offset:number, limit:number, colName:string, order:string, facilityId:number): Promise<FacilityMeterMonthlyEntries[]> {
    try {
      const result = await FacilityMeterMonthlyEntries.findAndCountAll({where:{facility_id: facilityId, is_active:STATUS.IS_ACTIVE},offset:offset, limit:limit, order: [[colName, order]]})    
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

  static async getFacilityMeterMonthlyEntryById(userToken: IUserToken, Id:number): Promise<FacilityMeterHourlyEntries[]> {
    try {
      const result = await FacilityMeterMonthlyEntries.findOne({where:{id: Id, is_active:STATUS.IS_ACTIVE}})    
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


  static async getFacilityMeterHourlyEntriesListing(userToken: IUserToken, offset:number, limit:number, colName:string, order:string, facilityId:number): Promise<FacilityMeterHourlyEntries[]> {
    try {
      const result = await FacilityMeterHourlyEntries.findAndCountAll({where:{facility_id: facilityId, is_active:STATUS.IS_ACTIVE},offset:offset, limit:limit, order: [[colName, order]]})    
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


  static async getFacilityMeterHourlyEntryById(userToken: IUserToken, Id:number): Promise<FacilityMeterHourlyEntries[]> {
    try {
      const result = await FacilityMeterHourlyEntries.findOne({where:{id: Id, is_active:STATUS.IS_ACTIVE}})    
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
 






  
 


  
}