import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../services/database';
import { Company } from './company.model';
import { User } from './user.model';
import { Role } from './role.model';
interface UserCompanyRoleAttributes {
  id: number;
  user_id: number;
  company_id: number;
  role_id: number;
  is_active: number;
  created_by?: number;
  updated_by?: number;
  status?: string;
}
 
interface UserCompanyRoleCreationAttributes extends Optional<UserCompanyRoleAttributes, 'id'> {}
 
class UserCompanyRole extends Model<UserCompanyRoleAttributes, UserCompanyRoleCreationAttributes> {
  public id!: number;
  public user_id!: number;
  public company_id!: number;
  public role_id!: number;
  public is_active!: number;
  public created_by?: number;
  public updated_by?: number;
  public status?: string;
}
 
UserCompanyRole.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    company_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    is_active: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 1,
    },
    created_by: {
      type: DataTypes.INTEGER,
    },
    updated_by: {
      type: DataTypes.INTEGER,
    },
    status: {
        type: DataTypes.STRING,
      },
  },
  {
    sequelize,
    tableName: 'user_company_role',
  }
);
 
export { UserCompanyRole, UserCompanyRoleAttributes };
 
UserCompanyRole.belongsTo(User, { foreignKey: 'user_id' });
UserCompanyRole.belongsTo(Role, { foreignKey: 'role_id' });
UserCompanyRole.belongsTo(Company, { foreignKey: 'company_id' });