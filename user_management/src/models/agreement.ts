import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../services/database';
import { isNumeric } from 'validator';

interface ParticipantAgreementAttributes {
  id: number;
  company_id: number;
  user_id: number;
  signed_by: number;
  agreement_file_url: string;
  is_active?: boolean;
  updated_by?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ParticipantAgreementCreationAttributes extends Optional<ParticipantAgreementAttributes, 'id'> {}

class ParticipantAgreement extends Model<ParticipantAgreementAttributes, ParticipantAgreementCreationAttributes> {
  public id!: number;
  public company_id!: number;
  public user_id!: number;
  public signed_by!: number;
  public agreement_file_url!: string;
  public is_active?: boolean;
  public updated_by?: number;
  public createdAt?: Date;
  public updatedAt?: Date;
}

ParticipantAgreement.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    company_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isNumeric: {
          msg: 'Company ID must be a number.',
        },
      },
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isNumeric: {
          msg: 'User ID must be a number.',
        },
      },
    },
    signed_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isNumeric: {
          msg: 'Signed by field must be a number.',
        },
      },
    },
    agreement_file_url: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Agreement file URL is required.',
        },
      },
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    updated_by: {
      type: DataTypes.INTEGER,
      validate: {
        isNumeric: {
          msg: 'Updated by field must be a number.',
        },
      },
    },
  },
  {
    sequelize,
    tableName: 'participant_agreement',
    modelName: 'ParticipantAgreement', // We can specify the model name explicitly if needed
  }
);

export { ParticipantAgreement };
