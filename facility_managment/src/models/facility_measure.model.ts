import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../utils/database';


export interface IFacilityMeasure {
    id: number | null;
    facility_id: number | null;
    measure_name: string | null;
    measure_category: string | null;
    measure_install_cost: string | null;
    baseline_detail: string | null;
    measure_description: string | null;
    start_date?: string | null;
    end_date?: string | null;
    file_upload: string | null;
    file_description: string | null;
    is_active?: number | null;
    created_at?: Date | null;
    updated_at?: Date | null;
    created_by?: number | null;
    updated_by?: number | null;
}

class FacilityMeasure extends Model<IFacilityMeasure> implements IFacilityMeasure {
    public id!: number | null;
    public facility_id: number;
    public measure_name: string | null;
    public measure_category!: string | null;
    public measure_install_cost!: string | null;
    public baseline_detail!: string | null;
    public measure_description!: string | null;
    public start_date!: string | null;
    public end_date!: string | null;
    public file_upload!: string | null;
    public file_description!: string | null;
    public is_active?: number | null;
    public created_at?: Date | null;
    public updated_at?: Date | null;
    public created_by?: number | null;
    public updated_by?: number | null;
}

FacilityMeasure.init(
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
        measure_name: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        measure_category: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        measure_install_cost: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        baseline_detail: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        measure_description: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        start_date: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        end_date: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        file_upload: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        file_description: {
            type: DataTypes.TEXT,
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
        tableName: 'facility_measure',
        timestamps: true,
        underscored: true,
        modelName: 'FacilityMeasure',
    }
);

export { FacilityMeasure };
