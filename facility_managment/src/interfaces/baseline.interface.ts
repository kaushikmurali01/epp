import { IFacilityAttributes } from "./facility.interface";
import { IFacilityCharacteristicsAttributes } from "./facility_characteristics.interface";
import { IFacilityMeterDetailAttributes } from "./facility_meter_detail.interface";
import { IFacilityMeterMonthlyEntriesAttributes } from "./facility_meter_monthly_entries.interface";
import { IParticipantAgreementAttributes } from "./participant_agreement.interface";
import { IResponse } from "./response.interface";
import { IUserToken } from "./usertoken.interface";


export interface IBaseInterface
  extends IFacilityCharacteristicsAttributes,
    IFacilityMeterDetailAttributes,
    IFacilityMeterMonthlyEntriesAttributes,
    IFacilityAttributes,
    IFacilityCharacteristicsAttributes,
    IParticipantAgreementAttributes,
    IResponse,
    IUserToken,
    objects,
    SequelizeFunctionInterface {
  body: IBaseInterface;
  pathParameters: string;
}
export interface objects {
  [key: string]: any;
}
export interface SequelizeFunctionInterface {
  findAll(data: object): Promise<Array<IBaseInterface>>;
  findOne(data: object): Promise<IBaseInterface>;
  update(data: object, data2: object): Promise<IBaseInterface>;
  create(bodyParams: object, transaction?: object): Promise<IBaseInterface>;
  destroy(bodyParams: object, transaction?: object): Promise<IBaseInterface>;
}
export interface MySchema {
  validate: (data: object) => Promise<any>; // Define the type and signature of the validate method
}
