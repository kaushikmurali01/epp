import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../services/database';

interface PermissionAttributes {
  id: number;
  permission: string;
  permission_type: string;
  permission_description: string;
  is_active: number;
  created_at: Date;
  updated_at: Date;
  created_by: number;
  updated_by: number;
}

interface PermissionCreationAttributes extends Optional<PermissionAttributes, 'id'> {}

class Permission extends Model<PermissionAttributes, PermissionCreationAttributes> implements PermissionAttributes {
  public id!: number;
  public permission!: string;
  public permission_type!: string;
  public permission_description!: string;
  public is_active!: number;
  public created_at!: Date;
  public updated_at!: Date;
  public created_by!: number;
  public updated_by!: number;
}

Permission.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    permission: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Permission is required.',
        },
      },
    },
    permission_type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Permission type is required.',
        },
      },
    },
    permission_description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Permission description is required.',
        },
      },
    },
    is_active: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: {
          msg: 'Is active must be a valid integer.',
        },
      },
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: {
          msg: 'Created by must be a valid integer.',
        },
      },
    },
    updated_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: {
          msg: 'Updated by must be a valid integer.',
        },
      },
    },
  },
  {
    sequelize,
    tableName: 'permission',
    timestamps: false, // Set to true if you want sequelize to handle timestamps automatically
  }
);

export { Permission };
