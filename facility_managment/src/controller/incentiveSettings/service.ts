import { IncentiveSettings } from '../../models/incentiveSettings.model';
import { IIncentiveSettingsAttributes } from '../../interfaces/incentiveSettings.interface';

export class IncentiveSettingsService {
    static async getIncentiveSettings(facilityId: number): Promise<Omit<IIncentiveSettingsAttributes, 'facility'> | null> {
      const result = await IncentiveSettings.findOne({
        where: { facility_id: facilityId },
        attributes: { exclude: ['facility'] },
      });
  
      return result ? result.get({ plain: true }) : null;
    }
  
    static async upsertIncentiveSettings(data: Partial<IIncentiveSettingsAttributes>): Promise<Omit<IIncentiveSettingsAttributes, 'facility'>> {
      const [incentiveSettings, created] = await IncentiveSettings.upsert(data, {
        returning: true,
      });
  
      const result = incentiveSettings.get({ plain: true });
      delete result.facility;
      return result;
    }
  }