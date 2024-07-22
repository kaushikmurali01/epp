import { DataTypes, Model } from "sequelize";
import { sequelize } from "../utils/database";
import { User } from "./user.model";
import { NonRoutineModel } from "./facility_non_routine_event.model";

export interface INonRoutineDataEntryModel {
  id: number | null;
  non_routine_id: number | null;
  file_url: string | null;
  non_routine_adjustment: string | null;
  created_by: number | null;
  updated_by: number | null;
  start_date: Date | null;
  end_date: Date | null;
  type: number | null;
  status: string | null;
  created_at?: Date | null;
  updated_at?: Date | null;
}

class NonRoutineDataEntryModel
  extends Model<INonRoutineDataEntryModel>
  implements INonRoutineDataEntryModel
{
  public id!: number | null;
  public non_routine_id!: number | null;
  public file_url!: string | null;
  public non_routine_adjustment!: string | null;
  public type: number | null;
  public updated_by!: number | null;
  public created_by!: number | null;
  public start_date!: Date | null;
  public end_date!: Date | null;
  public status!: string | null;
  public created_at?: Date | null;
  public updated_at?: Date | null;
}

NonRoutineDataEntryModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    non_routine_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    file_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    type: {
      type: DataTypes.NUMBER,
      allowNull: true,
    },
    non_routine_adjustment: {
      type: DataTypes.TEXT,
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
    start_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    end_date: {
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
    tableName: "non_routine_data_entry_model",
    timestamps: true,
    underscored: true,
    modelName: "NonRoutineDataEntryModel",
  }
);

export { NonRoutineDataEntryModel };

NonRoutineDataEntryModel.belongsTo(NonRoutineModel, {
  foreignKey: "non_routine_id",
});
NonRoutineDataEntryModel.belongsTo(User, {
  foreignKey: "created_by",
  as: "creator",
});
NonRoutineDataEntryModel.belongsTo(User, {
  foreignKey: "updated_by",
  as: "updater",
});
