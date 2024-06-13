import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../utils/database';
import { IFacilityMeterDetailAttributes } from '../interfaces/facility_meter_detail.interface';


interface FacilityMeterDetailCreationAttributes extends Optional<IFacilityMeterDetailAttributes, 'id'> { }

class FacilityMeterDetail extends Model<IFacilityMeterDetailAttributes, FacilityMeterDetailCreationAttributes> implements IFacilityMeterDetailAttributes {
    public id!: number;
    public facility_id!: number;
    public meter_name?: string | null;
    public meter_type?: number | null;
    public meter_id?: number | null;
    public meter_active?: Date | null;
    public meter_inactive?: Date | null;
    public stil_in_use?: boolean | null;
    public is_rg_meter?: boolean | null;
    public meter_spec_as_per_measurement?: string | null;
    public meter_specification_url?: string | null;
    public is_active?: number | null;
    public created_at?: Date | null;
    public updated_at?: Date | null;
    public created_by?: number | null;
    public updated_by?: number | null;
    public purchased_from_the_grid?: boolean | null;
    public unit?: string | null;
    
}

FacilityMeterDetail.init(
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
        meter_name: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        meter_type: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        meter_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        meter_active: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        meter_inactive: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        stil_in_use: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
        },
        meter_spec_as_per_measurement: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        is_rg_meter: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
        },
        meter_specification_url: {
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
        },
        purchased_from_the_grid: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
        },
        unit: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
    },
    {
        sequelize,
        tableName: 'facility_meter_detail',
        timestamps: true,
        underscored: true,
        modelName: 'FacilityMeterDetail',
    }
);

export { FacilityMeterDetail };
