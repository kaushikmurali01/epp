import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../utils/database";
import { IContactAttributes } from "../interfaces/contact.interface";
import { Facility } from "./facility.model";
import { User } from "./user.model";



interface ContactCreationAttributes extends Optional<IContactAttributes, "id"> {}

class Contact extends Model<IContactAttributes, ContactCreationAttributes> implements IContactAttributes {
  public id!: number;
  public facility_id: number;      
  public name!: string;
  public company_name!: string;
  public email!: string;
  public role!: string;
  public phone!: string;
  public unit_number!: string;
  public street_number!: string;
  public street_name!: string;
  public city!: string;
  public province!: string;
  public country!: string;
  public postal_code!: string;
  public created_at!: Date;
  public updated_at!: Date;
  public created_by!: number;
  public updated_by!: number;
}

Contact.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    facility_id: { 
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    company_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    unit_number: {
      type: DataTypes.STRING,
    },
    street_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    street_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    province: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    postal_code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    updated_by: {
      type: DataTypes.INTEGER,
    },
  },
  {
    sequelize,
    tableName: "contacts",
    timestamps: true,
    underscored: true,
    modelName: "Contact",
  }
);
  Contact.belongsTo(Facility, {
    foreignKey: "facility_id",
    as: "facility",
  });
  Contact.belongsTo(User, {
    foreignKey: "created_by",
    as: "user",
  });
export { Contact };