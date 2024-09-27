import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../utils/database";
import { Facility } from "./facility.model";
import { FacilityMeterDetail } from "./facility_meter_details.model";

interface IMeterHourlyEntriesAttributes {
  id?: number;
  start_date?: Date;
  end_date?: Date;
  meter_id?: number;
  meter_type?: number;
  is_independent_variable?: boolean;
  meter_name?: string;
  start_year?: number;
  start_month?: number;
  end_year?: number;
  independent_variable_id?: number;
  end_month?: number;
  purchased_from_grid?: boolean;
  facility_id?: number;
  is_active?: boolean;
  reading?: number;
  reading_og?: number;
}

interface MeterHourlyEntriesCreationAttributes
  extends Optional<IMeterHourlyEntriesAttributes, "id"> {}

class MeterHourlyEntries
  extends Model<
    IMeterHourlyEntriesAttributes,
    MeterHourlyEntriesCreationAttributes
  >
  implements IMeterHourlyEntriesAttributes
{
  public id!: number;
  public start_date!: Date;
  public end_date!: Date;
  public reading_og?: number;
  public meter_id!: number;
  public independent_variable_id?: number;
  public meter_type!: number;
  public is_independent_variable!: boolean;
  public meter_name!: string;
  public start_year!: number;
  public start_month!: number;
  public end_year!: number;
  public end_month!: number;
  public purchased_from_grid!: boolean;
  public facility_id!: number;
  public is_active!: boolean;
  public reading!: number;
}

MeterHourlyEntries.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    start_date: {
      type: DataTypes.DATE,
    },
    end_date: {
      type: DataTypes.DATE,
    },
    meter_id: {
      type: DataTypes.INTEGER,
    },
    meter_type: {
      type: DataTypes.INTEGER,
    },
    is_independent_variable: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    independent_variable_id: {
      type: DataTypes.INTEGER,
    },
    meter_name: {
      type: DataTypes.STRING,
    },
    start_year: {
      type: DataTypes.INTEGER,
    },
    start_month: {
      type: DataTypes.INTEGER,
    },
    end_year: {
      type: DataTypes.INTEGER,
    },
    end_month: {
      type: DataTypes.INTEGER,
    },
    purchased_from_grid: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    facility_id: {
      type: DataTypes.INTEGER,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    reading: {
      type: DataTypes.FLOAT,
    },
    reading_og: {
      type: DataTypes.FLOAT,
    },
  },
  {
    sequelize,
    tableName: "meter_hourly_entries",
    timestamps: false, // assuming there are no created_at and updated_at columns
    underscored: true,
    modelName: "MeterHourlyEntries",
    indexes: [
      {
        fields: ["facility_id"],
      },
      {
        fields: ["facility_id", "reading", "is_independent_variable"],
      },
      {
        fields: ["meter_name", "meter_type"],
      },
      {
        fields: ["reading", "is_independent_variable"],
      },
    ],
  }
);

MeterHourlyEntries.belongsTo(Facility, {
  foreignKey: "facility_id",
  as: "facility",
});

MeterHourlyEntries.belongsTo(FacilityMeterDetail, {
  foreignKey: "meter_id",
  as: "meterDetail",
});

export { MeterHourlyEntries };
