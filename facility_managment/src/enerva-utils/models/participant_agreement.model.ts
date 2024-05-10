import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../utils/database';
import { IParticipantAgreementAttributes } from '../interfaces/participant_agreement.interface';

interface ParticipantAgreementCreationAttributes extends Optional<IParticipantAgreementAttributes, 'id'> {}

class ParticipantAgreement extends Model<IParticipantAgreementAttributes, ParticipantAgreementCreationAttributes> implements IParticipantAgreementAttributes {
    public id!: number;
    public company_id!: number;
    public unsigned_doc?: string | null;
    public upload_sign?: string | null;
    public is_signed?: boolean | null;
    public signed_doc?: string | null;
    public status?: number | null;
    public signed_on?: Date | null;
    public is_active?: number | null;
    public created_at?: Date | null;
    public updated_at?: Date | null;
    public created_by?: number | null;
    public updated_by?: number | null;
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
        },
        unsigned_doc: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        upload_sign: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        is_signed: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
        },
        signed_doc: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        signed_on: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        is_active: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        updated_at: {
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
        }
    },
    {
        sequelize,
        tableName: 'participant_agreement',
        timestamps: true,
        underscored: true, 
        modelName: 'ParticipantAgreement',
    }
);

export { ParticipantAgreement };
