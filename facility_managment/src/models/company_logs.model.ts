import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../services/database";
import { User } from "./user.model";
import { Company } from "./company.model";
import { number } from 'yup';

interface CompanyLogAttributes {
  id: number;
  event?: string;
  event_type?: string;
  event_id?: number;
  company_id: number;
  user_id: number;
  facility_id: number;

  created_by?: number;
  updated_by?: number;
}

interface CompanyLogCreationAttributes
  extends Optional<CompanyLogAttributes, "id"> {}

class CompanyLog
  extends Model<CompanyLogAttributes, CompanyLogCreationAttributes>
  implements CompanyLogAttributes
{
  public id!: number;
  public event?: string;
  public company_id!: number;
  public user_id!: number;
  public facility_id!: number;
  public event_type?: string;
  public event_id?: number;
  public created_by?: number;
  public updated_by?: number;
}

CompanyLog.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    event: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    event_type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    event_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    company_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    facility_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
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
    tableName: "company_logs",
    timestamps: true,
  }
);
// CompanyLog model
CompanyLog.belongsTo(User, { foreignKey: "user_id", as: "user" });
CompanyLog.belongsTo(Company, { foreignKey: "company_id", as: "company" });

export { CompanyLog };
