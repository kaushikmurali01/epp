import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../services/database';
import { User } from './user'; // Import User model if needed
import { Company } from './company'; // Import Company model if needed
import { Role } from './role';

interface UserRequestAttributes {
  id: number;
  company_id: number;
  role: number;
  date_of_request_sent?: Date;
  time_of_request_sent?: string;
  created_by: number;
  updated_by: number;
  createdAt?: Date;
  updatedAt?: Date;
  status: string;
  user_id?: number;
  is_active?: number;
}

interface UserRequestCreationAttributes extends Optional<UserRequestAttributes, 'id'> {}

class UserRequest extends Model<UserRequestAttributes, UserRequestCreationAttributes> implements UserRequestAttributes {
  public id!: number;
  public company_id!: number;
  public role!: number;
  public date_of_request_sent!: Date;
  public time_of_request_sent!: string;
  public created_by!: number;
  public updated_by!: number;
  public createdAt!: Date;
  public updatedAt!: Date;
  public status!: string;
  public user_id?: number;
  public is_active?: number;
}

UserRequest.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    company_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    role: {
      type: DataTypes.INTEGER,
      allowNull: false,
      
    },
    date_of_request_sent: {
      type: DataTypes.DATE,
    },
    time_of_request_sent: {
      type: DataTypes.TIME,
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    updated_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
    },
    is_active: {
      type: DataTypes.INTEGER,
    },
  },
  {
    sequelize,
    tableName: 'user_request',
  }
);

export { UserRequest };

// Define associations
UserRequest.belongsTo(Role, { foreignKey: 'role' }); 
UserRequest.belongsTo(Company, { foreignKey: 'company_id' }); 
