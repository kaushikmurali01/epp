import { DataTypes, Model } from "sequelize";
import { sequelize } from "../utils/database";
import { User } from "./user.model";
import { number } from "yup";

export interface IFacilityThreshold {
  id: number | null;
  facility_id: number | null;
  created_by: number | null;
  daily_coverage_threshold: number | null;
  hourly_coverage_threshold: number | null;
  monthly_covergae_threshold: number | null;
  nmbe: number | null;
  rmse: number | null;
  updated_by: number | null;
  status: string | null;
  created_at?: Date | null;
  updated_at?: Date | null;
}

class FacilityThreshold
  extends Model<IFacilityThreshold>
  implements IFacilityThreshold
{
  public id!: number | null;
  public facility_id!: number | null;
  public daily_coverage_threshold!: number | null;
  public hourly_coverage_threshold: number | null;
  public monthly_covergae_threshold: number | null;
  public nmbe: number | null;
  public rmse: number | null;
  public updated_by!: number | null;
  public created_by!: number | null;
  public status!: string | null;
  public created_at?: Date | null;
  public updated_at?: Date | null;
}

FacilityThreshold.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    facility_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    nmbe: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
    rmse: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
    daily_coverage_threshold: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
    hourly_coverage_threshold: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
    monthly_covergae_threshold: {
      type: DataTypes.DECIMAL,
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
    status: {
      type: DataTypes.STRING(255),
      // ENUM('CREATED', 'REJECTED', 'SUBMITTED', 'REQUESTED'),
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
  },
  {
    sequelize,
    tableName: "facility_threshold",
    timestamps: true,
    underscored: true,
    modelName: "FacilityThreshold",
  }
);

export { FacilityThreshold };

FacilityThreshold.belongsTo(User, { foreignKey: "created_by", as: "creator" });
FacilityThreshold.belongsTo(User, { foreignKey: "updated_by", as: "updater" });
