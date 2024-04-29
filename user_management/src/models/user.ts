import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../services/database';
import { UserAttributes } from 'enerva-utils/interfaces/user';
import { isStrongPassword } from 'validator'; // Importing validator library for password complexity check

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public first_name!: string;
  public last_name!: string;
  public email!: string;
  public password!: string;
  public landline!: number | null;
  public phonenumber!: number;
  public address!: string;
}

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
      validate: {
        notEmpty: {
          msg: 'First name is required.',
        },
      },
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Last name is required.',
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        name: 'UniqueEmailConstraint',
        msg: 'Email address already exists.',
      },
      validate: {
        isEmail: {
          msg: 'Invalid email format.',
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Password is required.',
        },
        len: {
          args: [8, 255],
          msg: 'Password must be between 8 and 255 characters long.',
        },
        isStrongPassword(value: string) {
          if (!isStrongPassword(value, { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 })) {
            throw new Error('Password must have at least one uppercase, one lowercase, one number, and one special character.');
          } else {
            return true;
          }
        },
      },
    },
    landline: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        isNumeric: {
          msg: 'Landline must be a number.',
        },
      },
    },
    phonenumber: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isNumeric: {
          msg: 'Phone number must be numeric.',
        },
        len: {
          args: [10, 15],
          msg: 'Phone number must be between 10 and 15 digits.',
        },
      },
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Address is required.',
        },
      },
    },
  },
  {
    sequelize,
    tableName: 'users',
  }
);

export { User };
