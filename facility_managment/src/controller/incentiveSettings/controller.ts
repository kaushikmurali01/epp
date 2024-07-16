import { IncentiveSettingsService } from './service';
import { IIncentiveSettingsAttributes } from '../../interfaces/incentiveSettings.interface';

export class IncentiveSettingsController {
  static async getIncentiveSettings(facilityId: number): Promise<IIncentiveSettingsAttributes | null> {
    return IncentiveSettingsService.getIncentiveSettings(facilityId);
  }

  static async upsertIncentiveSettings(data: IIncentiveSettingsAttributes): Promise<IIncentiveSettingsAttributes> {
    return IncentiveSettingsService.upsertIncentiveSettings(data);
  }
}