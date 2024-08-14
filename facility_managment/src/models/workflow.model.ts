import { DataTypes, Model } from "sequelize";
import { sequelize } from "../services/database";

class Workflow extends Model {
  public id!: number;
  public facility_id!: number;
  public detail!: boolean;
  public weather_iv!: boolean;
  public savings!: boolean;
  public baseline!: boolean;
  public performance!: boolean;
  public ew!: boolean;
  public is_active: boolean;
  public createdAt!: Date;
  public updatedAt!: Date;
}

Workflow.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    facility_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "facility", // Ensure this matches your table name
        key: "id",
      },
    },
    detail: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    ew: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    weather_iv: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    savings: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    baseline: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    performance: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
  },
  {
    sequelize,
    tableName: "workflow",
    timestamps: true,
    underscored: true,
    modelName: "Workflow",
  }
);

export { Workflow };
