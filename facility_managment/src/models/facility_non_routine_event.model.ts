import { DataTypes, Model } from "sequelize";
import { sequelize } from "../utils/database";
import { User } from "./user.model";
import { Facility } from "./facility.model";

export interface INonRoutineModel {
  id: number | null;
  facility_id: number | null;
  meter_type: number | null;
  event_name: string | null;
  event_description: string | null;
  created_by: number | null;
  updated_by: number | null;
  event_to_period: Date | null;
  event_from_period: Date | null;
  status: string | null;
  created_at?: Date | null;
  updated_at?: Date | null;
}

class NonRoutineModel extends Model<INonRoutineModel> implements INonRoutineModel {
  public id!: number | null;
  public facility_id!: number | null;
  public event_name!: string | null;
  public event_description!: string | null;
  public updated_by!: number | null;
  public created_by!: number | null;
  public event_to_period!: Date | null;
  public meter_type: number | null;
  public event_from_period!: Date | null;
  public status!: string | null;
  public created_at?: Date | null;
  public updated_at?: Date | null;
}

NonRoutineModel.init(
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
    event_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    event_description: {
      type: DataTypes.TEXT,
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
    event_to_period: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    event_from_period: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING(255),
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
    tableName: "non_routine_model",
    timestamps: true,
    underscored: true,
    modelName: "NonRoutineModel",
  }
);

export { NonRoutineModel };

NonRoutineModel.belongsTo(Facility, { foreignKey: "facility_id" });
NonRoutineModel.belongsTo(User, { foreignKey: "created_by", as: "creator" });
NonRoutineModel.belongsTo(User, { foreignKey: "updated_by", as: "updater" });
