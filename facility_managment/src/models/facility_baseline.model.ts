import { DataTypes, Model } from "sequelize";
import { sequelize } from "../utils/database";
import { User } from "./user.model";

export interface IBaseline {
  id: number | null;
  facility_id: number | null;
  parameter_data: string | null;
  created_by: number | null;
  updated_by: number | null;
  created_date: Date | null;
  submit_date: Date | null;
  status: string | null;
  meter_type: number | null;
  assign_to: number | null;
  created_at?: Date | null;
  updated_at?: Date | null;
}

class Baseline extends Model<IBaseline> implements IBaseline {
  public id!: number | null;
  public facility_id!: number | null;
  public parameter_data!: string | null;
  public updated_by!: number | null;
  public created_by!: number | null;
  public created_date!: Date | null;
  public meter_type: number | null;
  public submit_date!: Date | null;
  public status!: string | null;
  public assign_to!: number | null;
  public created_at?: Date | null;
  public updated_at?: Date | null;
}

Baseline.init(
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
    parameter_data: {
      type: DataTypes.JSON,
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
    submit_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING(255),
      // ENUM('CREATED', 'REJECTED', 'SUBMITTED', 'REQUESTED'),
      allowNull: true,
    },
    assign_to: {
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
  },
  {
    sequelize,
    tableName: "baseline_model",
    timestamps: true,
    underscored: true,
    modelName: "Baseline",
  }
);

export { Baseline };

Baseline.belongsTo(User, { foreignKey: "assign_to", as: "assignedUser" });
Baseline.belongsTo(User, { foreignKey: "created_by", as: "creator" });
Baseline.belongsTo(User, { foreignKey: "updated_by", as: "updater" });
