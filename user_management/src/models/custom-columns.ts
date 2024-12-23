import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../services/database';

interface CustomColumnAttributes {
  id: number;
  field_slug: string | null;
  field_name: string | null;
  field_type: string | null;
  module_type: string | null;
  createdat: Date | null;
  updatedat: Date | null;
  created_by: number | null;
  updated_by: number | null;
  is_checked: number;
  order_id: number;
  is_search: number;
  is_sort: number;
}

interface CustomColumnCreationAttributes extends Optional<CustomColumnAttributes, 'id'> {}

class CustomColumn extends Model<CustomColumnAttributes, CustomColumnCreationAttributes> implements CustomColumnAttributes {
  public id!: number;
  public field_slug!: string | null;
  public field_name!: string | null;
  public field_type!: string | null;
  public module_type!: string | null;
  public createdat!: Date | null;
  public updatedat!: Date | null;
  public created_by!: number | null;
  public updated_by!: number | null;
  public is_checked!: number;
  public order_id!: number;
  public is_search!: number;
  public is_sort!: number;
}

CustomColumn.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    field_slug: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    field_name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    field_type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    module_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdat: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    updatedat: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    updated_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    is_checked: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      defaultValue: 0,
    },
    order_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      is_search: {
        type: DataTypes.SMALLINT,
        allowNull: true,
      },
      is_sort: {
        type: DataTypes.SMALLINT,
        allowNull: true,
      },
  },
  {
    sequelize,
    tableName: 'custom_columns',
    timestamps: false,  
  }
);

export { CustomColumn };
