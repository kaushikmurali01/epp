import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../services/database';
import { isEmail, isNumeric } from 'validator'; // Importing validator library for validation
import { UserType } from './userType';

interface RoleAttributes {
  id: number;
  rolename: string;
  description?: string;
  is_active?: number;
  created_by?: number;
  updated_by?: number;
  user_type?: number;
}

interface RoleCreationAttributes extends Optional<RoleAttributes, 'id'> {}

class Role extends Model<RoleAttributes, RoleCreationAttributes> {
  public id!: number;
  public rolename!: string;
  public description?: string;
  public is_active?: number;
  public created_by?: number;
  public updated_by?: number;
  public user_type?: number;
}

Role.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    rolename: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Role name is required.',
        },
      },
    },
    description: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'Description cannot be empty.',
        },
      },
    },
    user_type: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
  },
  {
    sequelize,
    tableName: 'role',
  }
);

export { Role };
Role.belongsTo(UserType, { foreignKey: 'user_type' });