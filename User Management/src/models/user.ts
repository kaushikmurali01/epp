import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../services/database';
import { UserAttributes } from '../interfaces/user';

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public first_name!: string;
  public last_name!: string;
  public email!: string;
  public password!: string;
  public address!: string;
  public azure_ad_id: string;
}

/**
 * User model definition.
 * 
 * Defines the structure and constraints for the 'users' table in the database.
 * 
 */
User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    azure_ad_id: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
    }
  },
  {
    sequelize,
    tableName: 'users',
  }
);


export { User };
