import { IUserToken } from '../enerva-utils/interfaces/usertoken.interface';
import { ResponseHandler } from '../enerva-utils/utils/responseHandler';
import { HTTP_STATUS_CODES, RESPONSE_MESSAGES, STATUS} from '../enerva-utils/utils/status';
import { FACILITY_APPROVAL_STATUS, FACILITY_ID_GENERAL_STATUS, FACILITY_ID_SUBMISSION_STATUS } from '../enerva-utils/utils/facility_status';
import { Facility } from '../enerva-utils/models/facility.model';
import { FacilityMeterMonthlyEntries } from '../enerva-utils/models/facility_meter_monthly_entries';
import { IBaseInterface } from '../enerva-utils/interfaces/baseline.interface';



export class FacilityMeterEntriesService {

  static async getFacilityMeterEntriesListing(userToken: IUserToken, offset:number, limit:number, colName:string, order:string, facilityMeterId:number): Promise<FacilityMeterMonthlyEntries[]> {
    try {
      const result = await FacilityMeterMonthlyEntries.findAndCountAll({where:{facility_meter_detail_id: facilityMeterId, is_active:STATUS.IS_ACTIVE},offset:offset, limit:limit, order: [[colName, order]]})    
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

  static async createNewMeterEntry(userToken: IUserToken, body:IBaseInterface): Promise<FacilityMeterMonthlyEntries[]> {
      try {
        const obj = {
            facility_id: body.facility_id,
            facility_meter_detail_id: body.facility_meter_detail_id,
            meter_id: body.meter_id,
            year: body.year,
            start_date: body.start_date,
            end_date: body.end_date,
            usage: body.usage,
            demand: body.demand,
            total_cost: body.total_cost,
            last_updated: body.last_updated,
            is_active: STATUS.IS_ACTIVE,
            created_by: userToken.id
        };
        console.log(obj)
        const result = await FacilityMeterMonthlyEntries.create(obj);
        return ResponseHandler.getResponse(HTTP_STATUS_CODES.SUCCESS, RESPONSE_MESSAGES.Success, result);
    
        
      } catch (error) {
        throw error;
      }
  
    }

  static async editMeterDetails(userToken: IUserToken, body:IBaseInterface, facilityId:number): Promise<FacilityMeterMonthlyEntries[]> {
    try {
      const obj = {
        facility_meter_detail_id: body.facility_meter_detail_id,
        meter_id: body.meter_id,
        year: body.year,
        start_date: body.start_date,
        end_date: body.end_date,
        usage: body.usage,
        demand: body.demand,
        total_cost: body.total_cost,
        last_updated: body.last_updated,
        is_active: STATUS.IS_ACTIVE,
        updated_by: userToken.id,
        updated_at: new Date(),
      };
      const result = await FacilityMeterMonthlyEntries.update(obj,{where:{id:facilityId}})
  
      
      const resp = ResponseHandler.getResponse(HTTP_STATUS_CODES.SUCCESS, RESPONSE_MESSAGES.Success, result);
      return resp;
      
    } catch (error) {
      throw error;
    }
   
  }

  static async removeMeter(userToken: IUserToken, facilityId:number): Promise<FacilityMeterMonthlyEntries[]> {
    try {
      const result = await FacilityMeterMonthlyEntries.update({is_active:STATUS.IS_DELETED} ,{where:{id:facilityId}})
      const resp = ResponseHandler.getResponse(HTTP_STATUS_CODES.SUCCESS, RESPONSE_MESSAGES.Success, result);
      return resp;
      
    } catch (error) {
      throw error
      
    }
   
  }






  
 


  
}