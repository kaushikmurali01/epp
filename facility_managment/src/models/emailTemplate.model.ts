import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../utils/database";
import { IEmailTemplateAttributes } from "../interfaces/emailTemplate.interface";
import { Facility } from "./facility.model";

interface EmailTemplateCreationAttributes
  extends Optional<IEmailTemplateAttributes, "id"> {}

class EmailTemplate
  extends Model<IEmailTemplateAttributes, EmailTemplateCreationAttributes>
  implements IEmailTemplateAttributes
{
  public id!: number;
  public facility_id!: number;
  public name!: string;
  public subject!: string;
  public body!: string;
  public created_at!: Date;
  public updated_at!: Date;
  public created_by!: number;
  public updated_by!: number;
}

EmailTemplate.init(
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
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    subject: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    body: {
      type: DataTypes.TEXT,
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
    },
    updated_by: {
      type: DataTypes.INTEGER,
    },
  },
  {
    sequelize,
    tableName: "email_templates",
    timestamps: true,
    underscored: true,
    modelName: "EmailTemplate",
  }
);

EmailTemplate.belongsTo(Facility, {
  foreignKey: "facility_id",
  as: "facility",
});

export { EmailTemplate };