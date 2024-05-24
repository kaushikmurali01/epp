import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../utils/database';
import { IFacilityCharacteristicsAttributes } from '../interfaces/facility_characteristics.interface';



interface FacilityCharacteristicsCreationAttributes extends Optional<IFacilityCharacteristicsAttributes, 'id'> {}

class FacilityCharacteristics extends Model<IFacilityCharacteristicsAttributes, FacilityCharacteristicsCreationAttributes> implements IFacilityCharacteristicsAttributes  {
    public id!: number;
    public facility_id!: number;
    public operational_hours?: string | null;
    public year_of_construction?: Date | null;
    public gross_floor_area?: string | null;
    public number_of_storeys?: number | null;
    public conditioned_gross_floor_area_including_common_area?: string | null;
    public unonditioned_gross_floor_area?: string | null;
    public unique_features_that_impact_energy_usage?: boolean | null;
    public unique_features_of_facility?: string | null;
    public space_cooling_fuel_source?: string | null;
    public space_cooling_technology?: string | null;
    public space_heating_fuel_source?: string | null;
    public water_heating_fuel_source?: string | null;
    public water_heating_technology?: string | null;
    public not_standard_hvac_equipment?: string | null;
    public space_cooling_technology_description?: string | null;
    public space_cooling_technology_age?: number | null;
    public space_cooling_technology_capacity?: string | null;
    public space_cooling_efficiency?: string | null;
    public space_heating_technology_description?: string | null;
    public space_heating_technology_age?: number | null;
    public space_heating_technology_capacity?: string | null;
    public space_heating_efficiency?: string | null;
    public water_heating_technology_description?: string | null;
    public water_heating_technology_age?: number | null;
    public water_heating_technology_capacity?: string | null;
    public water_heating_efficiency?: string | null;
    public maximum_number_of_occupants?: number | null;
    public average_number_of_occupants?: number | null;
    public year_round_or_seasonal?: number | null;
    public occupants_months_detail?: string | null;
    public is_lighting_controlled_for_occupancy?: boolean | null;
    public is_space_heating_controlled_for_occupancy?: boolean | null;
    public is_space_cooling_controlled_for_occupancy?: boolean | null;
    public facility_site_layout_media_url?: string | null;
    public facility_wall_assembly_and_ceiling_assembly_media_url?: string | null;
    public is_active?: number | null;
    public created_at?: Date | null;
    public updated_at?: Date | null;
    public created_by?: number | null;
    public updated_by?: number | null;
}

FacilityCharacteristics.init(
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
        operational_hours: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        year_of_construction: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        space_cooling_fuel_source: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        space_cooling_technology: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        space_heating_fuel_source: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        water_heating_fuel_source: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        water_heating_technology: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        not_standard_hvac_equipment: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        space_cooling_technology_description: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        space_cooling_technology_age: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        space_cooling_technology_capacity: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        space_cooling_efficiency: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        space_heating_technology_description: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        space_heating_technology_age: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        space_heating_technology_capacity: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        space_heating_efficiency: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        water_heating_technology_description: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        water_heating_technology_age: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        water_heating_technology_capacity: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        water_heating_efficiency: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        maximum_number_of_occupants: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        average_number_of_occupants: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        year_round_or_seasonal: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        occupants_months_detail: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        is_lighting_controlled_for_occupancy: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
        },
        is_space_heating_controlled_for_occupancy: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
        },
        is_space_cooling_controlled_for_occupancy: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
        },
        facility_site_layout_media_url: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        facility_wall_assembly_and_ceiling_assembly_media_url: {
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
        gross_floor_area: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        number_of_storeys: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        conditioned_gross_floor_area_including_common_area: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        unonditioned_gross_floor_area: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        unique_features_that_impact_energy_usage: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
        },
        unique_features_of_facility: {
            type: DataTypes.STRING(255),
            allowNull: true,
        }
        
    },
    {
        sequelize,
        tableName: 'facility_characterstics', // Adjust table name as per your requirement
        timestamps: true,
        underscored: true, // Set to true if your column names use snake_case instead of camelCase
        modelName: 'FacilityCharacteristics', // Adjust model name as per your requirement
    }
);

export { FacilityCharacteristics };
