import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../utils/database";
import { IEmailSentAttributes } from "../interfaces/email-sent.interface";
import { Facility } from "./facility.model";
import { User } from "./user.model";

interface EmailSentCreationAttributes extends Optional<IEmailSentAttributes, "id"> {}

class EmailSent extends Model<IEmailSentAttributes, EmailSentCreationAttributes> implements IEmailSentAttributes {
  public id!: number;
  public to!: string;
  public cc!: string;
  public subject!: string;
  public body!: string;
  public facility_id!: number;
  public created_at!: Date;
  public updated_at!: Date;
  public created_by!: number;
  public updated_by!: number;
  public is_system_generated!: boolean;
}

EmailSent.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    to: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    cc: {
      type: DataTypes.TEXT,
    },
    subject: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    facility_id: {
      type: DataTypes.INTEGER,
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
    is_system_generated: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    tableName: "email_sent",
    timestamps: true,
    underscored: true,
    modelName: "EmailSent",
  }
);

EmailSent.belongsTo(Facility, {
  foreignKey: "facility_id",
  as: "facility",
});

EmailSent.belongsTo(User, {
  foreignKey: "created_by",
  as: "sender",
});

export { EmailSent };