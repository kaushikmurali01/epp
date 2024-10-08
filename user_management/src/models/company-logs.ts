import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../services/database';

interface CompanyLogAttributes {
  id: number;
  event?: string;
  company_id: number;
  user_id: number;
  facility_id: number;
  created_at?: Date;
  updated_at?: Date;
  created_by?: number;
  updated_by?: number;
}

interface CompanyLogCreationAttributes extends Optional<CompanyLogAttributes, 'id'> {}

class CompanyLog extends Model<CompanyLogAttributes, CompanyLogCreationAttributes> implements CompanyLogAttributes {
  public id!: number;
  public event?: string;
  public company_id!: number;
  public user_id!: number;
  public facility_id!: number;
  public created_at?: Date;
  public updated_at?: Date;
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
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    updated_at: {
      type: DataTypes.DATE,
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
  },
  {
    sequelize,
    tableName: 'company_logs',
    timestamps: false, 
  }
);

export { CompanyLog };
