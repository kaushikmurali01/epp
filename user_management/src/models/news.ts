import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../services/database';

interface NewsAttributes {
  id: number;
  title: string;
  description: string;
  image: string;
  created_by: string;
  updated_by: string;
  link: string;
  is_active: boolean;
}

interface NewsCreationAttributes extends Optional<NewsAttributes, 'id'> {}

class News extends Model<NewsAttributes, NewsCreationAttributes> implements NewsAttributes {
  public id!: number;
  public title!: string;
  public description!: string;
  public image!: string;
  public created_by!: string;
  public updated_by!: string;
  public link!: string;
  public is_active!: boolean;
}

News.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Title is required.',
        },
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Description is required.',
        },
      },
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Image URL is required.',
        },
        isUrl: {
          msg: 'Invalid image URL format.',
        },
      },
    },
    created_by: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Created by is required.',
        },
      },
    },
    updated_by: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Updated by is required.',
        },
      },
    },
    link: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'Link is required.',
          },
        },
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      }
  },
  
  
  {
    sequelize,
    tableName: 'news',
  }
);

export { News };
