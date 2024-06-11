import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../utils/database';


export interface IFacilityMeasure {
    id: number | null;
    facility_id: number | null;
    measure_category: string | null;
    measure_install_cost: string | null;
    baseline_detail: string | null;
    measure_description: string | null;
    start_date: string | null;
    end_date: string | null;
    file_upload: string | null;
    file_description: string | null;
}

class FacilityMeasure extends Model<IFacilityMeasure> implements IFacilityMeasure {
    public id!: number | null;
    public facility_id: number;
    public measure_category!: string | null;
    public measure_install_cost!: string | null;
    public baseline_detail!: string | null;
    public measure_description!: string | null;
    public start_date!: string | null;
    public end_date!: string | null;
    public file_upload!: string | null;
    public file_description!: string | null;
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
        measure_category: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        measure_install_cost: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        baseline_detail: {
            type: DataTypes.STRING(255),
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
            type: DataTypes.STRING(255),
            allowNull: true,
        }
    },
    {
        sequelize,
        tableName: 'facility_measure',
        timestamps: false,
        underscored: true,
        modelName: 'FacilityMeasure',
    }
);

export { FacilityMeasure };
