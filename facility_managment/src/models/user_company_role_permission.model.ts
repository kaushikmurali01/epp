import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../utils/database';
import { Company } from './company.model';
import { Permission } from './permission.model';
import { User } from './user.model';

// Define the attributes interface
interface UserCompanyRolePermissionAttributes {
  id: number;
  role_id: number;
  permission_id: number;
  user_id: number;
  is_active?: number;
  created_at?: Date;
  updated_at?: Date;
  created_by?: number;
  updated_by?: number;
  company_id?: number;
}

// Define the creation attributes interface
interface UserCompanyRolePermissionCreationAttributes extends Optional<UserCompanyRolePermissionAttributes, 'id'> {}

// Define the model class
class UserCompanyRolePermission extends Model<UserCompanyRolePermissionAttributes, UserCompanyRolePermissionCreationAttributes> {
  public id!: number;
  public role_id!: number;
  public permission_id!: number;
  public user_id!: number;
  public is_active?: number;
  public created_at?: Date;
  public updated_at?: Date;
  public created_by?: number;
  public updated_by?: number;
  public company_id?: number;
}

// Initialize the model
UserCompanyRolePermission.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isNumeric: {
          msg: 'Role ID must be a number.',
        },
      },
    },
    permission_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isNumeric: {
          msg: 'Permission ID must be a number.',
        },
      },
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isNumeric: {
          msg: 'User ID must be a number.',
        },
      },
    },
    is_active: {
      type: DataTypes.INTEGER,
      validate: {
        min: {
          args: [0],
          msg: 'is_active field must be either 0 (inactive) or 1 (active).',
        },
        max: {
          args: [1],
          msg: 'is_active field must be either 0 (inactive) or 1 (active).',
        },
      },
    },
    created_by: {
      type: DataTypes.INTEGER,
      validate: {
        isNumeric: {
          msg: 'Created by field must be a number.',
        },
      },
    },
    updated_by: {
      type: DataTypes.INTEGER,
      validate: {
        isNumeric: {
          msg: 'Updated by field must be a number.',
        },
      },
    },
    company_id: {
        type: DataTypes.INTEGER,
        validate: {
          isNumeric: {
            msg: 'Company Id field must be a number.',
          },
        },
      },
  },
  {
    sequelize,
    tableName: 'user_company_role_permission',
  }
);

UserCompanyRolePermission.belongsTo(Permission, { foreignKey: 'permission_id' }); // Define the role_id foreign key association
UserCompanyRolePermission.belongsTo(Company, { foreignKey: 'company_id' }); // Define the permission_id foreign key association
UserCompanyRolePermission.belongsTo(User, { foreignKey: 'user_id' });

// Export the model
export { UserCompanyRolePermission };
