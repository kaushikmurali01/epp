import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../services/database';

interface StatusAttributes {
  id: number;
  name: string;
  description?: string | null;
  is_active: boolean;
}

interface StatusCreationAttributes extends Optional<StatusAttributes, 'id'> {}

class Status extends Model<StatusAttributes, StatusCreationAttributes> implements StatusAttributes {
  public id!: number;
  public name!: string;
  public description?: string | null;
  public is_active!: boolean;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Status.init(
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
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: 'status',
  }
);

export { Status };


