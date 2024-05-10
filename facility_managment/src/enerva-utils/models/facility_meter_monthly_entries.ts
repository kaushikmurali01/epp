import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../utils/database';
import { IFacilityMeterMonthlyEntriesAttributes } from '../interfaces/facility_meter_monthly_entries.interface';


interface FacilityMeterMonthlyEntriesCreationAttributes extends Optional<IFacilityMeterMonthlyEntriesAttributes, 'id'> {}

class FacilityMeterMonthlyEntries extends Model<IFacilityMeterMonthlyEntriesAttributes, FacilityMeterMonthlyEntriesCreationAttributes> implements IFacilityMeterMonthlyEntriesAttributes  {
    public id!: number;
    public facility_id!: number;
    public facility_meter_detail_id?: number | null;
    public meter_id?: number | null;
    public year?: number | null;
    public start_date?: Date | null;
    public end_date?: Date | null;
    public usage?: number | null;
    public demand?: number | null;
    public total_cost?: number | null;
    public last_updated?: string | null;
    public is_active?: number | null;
    public created_at?: Date | null;
    public updated_at?: Date | null;
    public created_by?: number | null;
    public updated_by?: number | null;
}

FacilityMeterMonthlyEntries.init(
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
        facility_meter_detail_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        meter_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        year: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        start_date: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        end_date: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        usage: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        demand: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        total_cost: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        last_updated: {
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
        tableName: 'facility_meter_monthly_entries',
        timestamps: true,
        underscored: true, 
        modelName: 'FacilityMeterMonthlyEntries',
    }
);

export { FacilityMeterMonthlyEntries };
