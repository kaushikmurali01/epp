import { DataTypes, Model } from "sequelize";
import { sequelize } from "../utils/database";

export interface IMasterChecklist {
  id: number | null;
  name: string | null;
  question: string | null;
  question_type: string | null;
  options: any | null;
  sequence_order: number | null;
  dependent_id: number | null;
  performance_type: number | null;
  created_at?: Date | null;
  updated_at?: Date | null;
}

class MasterChecklist
  extends Model<IMasterChecklist>
  implements IMasterChecklist
{
  public id!: number | null;
  public name: string | null;
  public question: string | null;
  public question_type: string | null;
  public options: any | null;
  public sequence_order: number | null;
  public dependent_id: number | null;
  public performance_type: number | null;
  public created_at?: Date | null;
  public updated_at?: Date | null;
}

MasterChecklist.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    question: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    question_type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    options: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    sequence_order: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    performance_type: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    dependent_id: {
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
    tableName: "master_checklist",
    timestamps: true,
    underscored: true,
    modelName: "MasterChecklist",
  }
);

export { MasterChecklist };
