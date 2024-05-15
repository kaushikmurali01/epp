import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../services/database';
import { Role } from './role'; // Assuming you already have a Role model
import { UserType } from './userType'; // Assuming you already have a UserType model

interface RoleUserTypeAttributes {
  id: number;
  role_id: number;
  user_type_id: number;
}

interface RoleUserTypeCreationAttributes extends Optional<RoleUserTypeAttributes, 'id'> {}

class RoleUserType extends Model<RoleUserTypeAttributes, RoleUserTypeCreationAttributes> implements RoleUserTypeAttributes {
  public id!: number;
  public role_id!: number;
  public user_type_id!: number;

  // Timestamps
  //public readonly created_at!: Date;
  //public readonly updated_at!: Date;
}

RoleUserType.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Role,
        key: 'id',
      },
    },
    user_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: UserType,
        key: 'id',
      },
    },
  },
  {
    sequelize,
    tableName: 'role_user_type',
    
  }
);

export { RoleUserType };
