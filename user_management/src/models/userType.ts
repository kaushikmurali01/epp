import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../services/database';

interface UserTypeAttributes {
  id: number;
  user_type: string;
  created_by?: number;
  updated_by?: number;
  created_at?: Date;
  updated_at?: Date;
}

interface UserTypeCreationAttributes extends Optional<UserTypeAttributes, 'id'> {}

class UserType extends Model<UserTypeAttributes, UserTypeCreationAttributes> implements UserTypeAttributes {
  public id!: number;
  public user_type!: string;
  public created_by?: number;
  public updated_by?: number;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

UserType.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_type: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    created_by: {
      type: DataTypes.INTEGER,
    },
    updated_by: {
      type: DataTypes.INTEGER,
    },
  },
  {
    sequelize,
    tableName: 'user_type',
    modelName: 'UserType',
  }
);

export { UserType };
