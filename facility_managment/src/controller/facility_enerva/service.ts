import { IUserToken } from '../../interfaces/usertoken.interface';
import { ResponseHandler } from '../../utils/responseHandler';
import { HTTP_STATUS_CODES, RESPONSE_MESSAGES, STATUS} from '../../utils/status';
import { FACILITY_APPROVAL_STATUS, FACILITY_ID_GENERAL_STATUS, FACILITY_ID_SUBMISSION_STATUS } from '../../utils/facility_status';
import { Facility } from '../../models/facility.model';


export class FacilityEnervaService {

    static async enervaApproveFacilitieById(userToken: IUserToken, facilityId:number): Promise<Facility[]> {
        try {
          
          const obj = {
            facility_id_submission_status: FACILITY_ID_SUBMISSION_STATUS.APPROVED, 
            is_approved: Boolean(FACILITY_APPROVAL_STATUS.APPROVED),
            is_active: Number(STATUS.IS_ACTIVE),
            approved_by: userToken.id, 
          }
          const result = await Facility.update(obj,{where:{id:facilityId}})
          const resp = ResponseHandler.getResponse(HTTP_STATUS_CODES.SUCCESS, RESPONSE_MESSAGES.Success, result);
          return resp;
        } catch (error) {
          throw error;
          
        }
       
      }
  
}