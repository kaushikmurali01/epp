import { DataTypes, Model } from "sequelize";
import { sequelize } from "../utils/database";

export interface IFacilityChecklist {
  id: number | null;
  facility_id: number | null;
  company_id: number | null;
  master_checklist_id: number | null;
  answer: string | null;
  created_at?: Date | null;
  updated_at?: Date | null;
}

class FacilityChecklist
  extends Model<IFacilityChecklist>
  implements IFacilityChecklist
{
  public id!: number | null;
  public facility_id: number | null;
  public company_id: number | null;
  public master_checklist_id: number | null;
  public answer: string | null;
  public created_at?: Date | null;
  public updated_at?: Date | null;
}

FacilityChecklist.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    answer: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    company_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    facility_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    master_checklist_id: {
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
    tableName: "facility_checklist",
    timestamps: true,
    underscored: true,
    modelName: "FacilityChecklist",
  }
);

export { FacilityChecklist };
