import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../utils/database';
import { IFacilityMeterHourlyEntriesAttributes } from '../interfaces/facility_meter_hourly_entries.interface';


interface FacilityMeterHourlyEntriesCreationAttributes
  extends Optional<IFacilityMeterHourlyEntriesAttributes, 'id'> {}

class FacilityMeterHourlyEntries
  extends Model<IFacilityMeterHourlyEntriesAttributes, FacilityMeterHourlyEntriesCreationAttributes>
  implements IFacilityMeterHourlyEntriesAttributes {
  public id!: number;
  public facility_id!: number;
  public facility_meter_detail_id!: number | null;
  public meter_id!: number | null;
  public year!: number | null;
  public month!: number | null;
  public usage!: number | null;
  public media_url!: string | null;
  public demand!: number | null;
  public total_cost!: number | null;
  public last_updated!: string | null;
  public is_active!: number | null;
  public created_at!: Date | null;
  public updated_at!: Date | null;
  public created_by!: number | null;
  public updated_by!: number | null;
}

FacilityMeterHourlyEntries.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    facility_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    facility_meter_detail_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    meter_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    month: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    usage: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    media_url: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    demand: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    total_cost: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    last_updated: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    is_active: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    updated_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'facility_meter_hourly_entries',
    underscored: true, 
    timestamps: true, // Assuming you handle timestamps manually
  }
);

export { FacilityMeterHourlyEntries };
