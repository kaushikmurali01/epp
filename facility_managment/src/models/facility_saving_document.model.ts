import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../utils/database';


export interface IFacilitySavingDocument {
    id: number | null;
    facility_id: number | null;
    document_desc: string | null;
    document_name: string | null;
    file_upload: string | null;
    document_type: string | null;
    is_active?: number | null;
    created_at?: Date | null;
    updated_at?: Date | null;
    created_by?: number | null;
    updated_by?: number | null;
}

class FacilitySavingDocument extends Model<IFacilitySavingDocument> implements IFacilitySavingDocument {
    public id!: number | null;
    public facility_id: number;
    public document_desc!: string | null;
    public document_name!: string | null;
    public document_type: string | null;
    public file_upload!: string | null;
    public is_active?: number | null;
    public created_at?: Date | null;
    public updated_at?: Date | null;
    public created_by?: number | null;
    public updated_by?: number | null;
}

FacilitySavingDocument.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        facility_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        document_name: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        document_type: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        document_desc: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        file_upload: {
            type: DataTypes.STRING(255),
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
        tableName: 'facility_saving_document',
        timestamps: true,
        underscored: true,
        modelName: 'FacilitySavingDocument',
    }
);

export { FacilitySavingDocument };
