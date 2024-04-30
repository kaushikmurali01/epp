import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../services/database';

interface ContactAttributes {
  id: number;
  name: string;
  company: string;
  email: string;
  phone: string;
  message: string;
}

interface ContactCreationAttributes extends Optional<ContactAttributes, 'id'> {}

class Contact extends Model<ContactCreationAttributes> implements ContactAttributes {
  public id!: number;
  public name!: string;
  public company!: string;
  public email!: string;
  public phone!: string;
  public message!: string;
}

Contact.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Name is required.',
        },
      },
    },
    company: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Company name is required.',
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: {
          msg: 'Invalid email format.',
        },
      },
    },
    phone: {
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
    message: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Message is required.',
        },
      },
    }
  },
  {
    sequelize,
    tableName: 'contact',
  }
);

export { Contact };
