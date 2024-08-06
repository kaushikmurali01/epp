import { DataTypes, Model } from "sequelize";
import { sequelize } from "../utils/database";
import { User } from "./user.model";

export interface ISavingPlanRequest {
  id: number | null;
  facility_id: number | null;
  meter_id: number | null;
  measure_category: string | null;
  created_by: number | null;
  updated_by: number | null;
  created_date: Date | null;
  status: string | null;
  meter_type: number | null;
  created_at?: Date | null;
  updated_at?: Date | null;
}

class SavingPlanRequest
  extends Model<ISavingPlanRequest>
  implements ISavingPlanRequest
{
  public id!: number | null;
  public facility_id!: number | null;
  public meter_id!: number | null;
  public measure_category: string | null;
  public updated_by!: number | null;
  public created_by!: number | null;
  public created_date!: Date | null;
  public meter_type: number | null;
  public status!: string | null;
  public created_at?: Date | null;
  public updated_at?: Date | null;
}

SavingPlanRequest.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    measure_category: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    facility_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    meter_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    meter_type: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    updated_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    created_date: {
      type: DataTypes.DATE,
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
    tableName: "request_saving_plan",
    timestamps: true,
    underscored: true,
    modelName: "SavingPlanRequest",
  }
);

export { SavingPlanRequest };

SavingPlanRequest.belongsTo(User, {
  foreignKey: "created_by",
  as: "creator",
});
SavingPlanRequest.belongsTo(User, {
  foreignKey: "updated_by",
  as: "updater",
});
