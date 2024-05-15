import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../services/database';

interface CompanyAttributes {
  id: number | any;
  source_of_discovery: string;
  company_type: number;
  company_name: string;
  website: string;
  address1: string;
  address2: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  total_facility: number;
  portal_agreement_accepted: number;
  information_commercial_accepted: number;
  unit_number: string;
  street_number: string;
  street_name: string;
}

interface CompanyCreationAttributes extends Optional<CompanyAttributes, 'id'> { }

class Company extends Model<CompanyAttributes, CompanyCreationAttributes> implements CompanyAttributes {
  public id!: number;
  public source_of_discovery!: string;
  public company_type: number;
  public company_name!: string;
  public website!: string;
  public address1!: string;
  public address2!: string | null;
  public city!: string;
  public state!: string;
  public postal_code!: string;
  public country!: string;
  public total_facility!: number;
  public portal_agreement_accepted: number;
  public information_commercial_accepted: number;
  public unit_number: string;
  public street_number: string;
  public street_name: string;

}

Company.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    source_of_discovery: {
      type: DataTypes.STRING,
      allowNull: true
      
    },
    company_type: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    company_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Company name is required.',
        },
      },
    },
    website: {
      type: DataTypes.STRING,
      allowNull: true
      // validate: {
      //   isUrl: {
      //     msg: 'Website must be a valid URL.',
      //   },
      // },
    },
    address1: {
      type: DataTypes.STRING,
      allowNull: true
    },
    address2: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true
    },
    state: {
      type: DataTypes.STRING,
      allowNull: true
    },
    postal_code: {
      type: DataTypes.STRING,
      allowNull: true
    },
    country: {
      type: DataTypes.STRING,
      allowNull: true
    },
    total_facility: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    portal_agreement_accepted: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    information_commercial_accepted: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    unit_number: {
      type: DataTypes.STRING,
      allowNull: true
    },
    street_number: {
      type: DataTypes.STRING,
      allowNull: true
    },
    street_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
  },
  {
    sequelize,
    tableName: 'company',
  }
);


export { Company };
