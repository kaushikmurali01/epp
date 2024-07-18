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
      const existingSettings = await IncentiveSettings.findOne({
        where: { facility_id: data.facility_id },
      });

      let result: IIncentiveSettingsAttributes;

      if (existingSettings) {
        // Update existing record
        await existingSettings.update(data);
        result = existingSettings.toJSON();
      } else {
        // Create new record
        const newSettings = await IncentiveSettings.create(data);
        result = newSettings.toJSON();
      }
      return result;
    }
  }