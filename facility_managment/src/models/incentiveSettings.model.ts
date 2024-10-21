import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../utils/database";
import { IIncentiveSettingsAttributes } from "../interfaces/incentiveSettings.interface";
import { Facility } from "./facility.model";

interface IncentiveSettingsCreationAttributes
  extends Optional<IIncentiveSettingsAttributes, "id"> {}

class IncentiveSettings
  extends Model<IIncentiveSettingsAttributes, IncentiveSettingsCreationAttributes>
  implements IIncentiveSettingsAttributes
{
  public id!: number;
  public facility_id!: number;
  public p4pStartDate1!: Date;
  public p4pEndDate1!: Date;
  public p4pStartDate2!: Date;
  public p4pEndDate2!: Date;
  public p4pStartDate3!: Date;
  public p4pEndDate3!: Date;
  public preProjectIncentive!: number;
  public incentive_cap!: number;
  public preProjectIncentiveStatus!: string;
  public p4pIncentiveStatus1!: string;
  public p4pIncentiveStatus2!: string;
  public p4pIncentiveStatus3!: string;
  public onPeakIncentiveRate!: number;
  public offPeakIncentiveRate!: number;
  public minimumSavings!: number;
  public created_at!: Date;
  public updated_at!: Date | null;
  public created_by!: number;
  public updated_by!: number | null;
}

IncentiveSettings.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    facility_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Facility,
        key: 'id',
      },
    },
    p4pStartDate1: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    p4pEndDate1: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    p4pStartDate2: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    p4pEndDate2: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    p4pStartDate3: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    p4pEndDate3: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    preProjectIncentive: {
      type: DataTypes.FLOAT,
    },
    preProjectIncentiveStatus: {
      type: DataTypes.STRING,
    },
    p4pIncentiveStatus1: {
      type: DataTypes.STRING,
    },
    p4pIncentiveStatus2: {
      type: DataTypes.STRING,
    },
    incentive_cap: {
      type: DataTypes.FLOAT,
    },
    p4pIncentiveStatus3: {
      type: DataTypes.STRING,
    },
    onPeakIncentiveRate: {
      type: DataTypes.FLOAT,
    },
    offPeakIncentiveRate: {
      type: DataTypes.FLOAT,
    },
    minimumSavings: {
      type: DataTypes.FLOAT,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
    },
    created_by: {
      type: DataTypes.INTEGER,
    },
    updated_by: {
      type: DataTypes.INTEGER,
    },
  },
  {
    sequelize,
    tableName: "incentive_settings",
    timestamps: true,
    underscored: true,
    modelName: "IncentiveSettings",
  }
);

IncentiveSettings.belongsTo(Facility, {
  foreignKey: "facility_id",
  as: "facility",
});

export { IncentiveSettings };