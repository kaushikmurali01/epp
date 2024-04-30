import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../services/database';
//import { UserAttributes } from 'enerva-utils/interfaces/user';
import { isStrongPassword } from 'validator'; // Importing validator library for password complexity check

interface UserAttributes {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  landline: number | null;
  phonenumber: number;
  address: string;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

class User extends Model<UserCreationAttributes>{
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
      allowNull: true,
      
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
    }
    
  },
  {
    sequelize,
    tableName: 'users',
  }
);

export { User };
