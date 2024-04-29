import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../utils/database';


interface FacilityCreationAttributes extends Optional<any, 'id'> {}

class Facility extends Model<any, FacilityCreationAttributes> implements FacilityCreationAttributes  {
    public id!: number;
    public Facility_ID_General_Status!: number;
    public Facility_ID_Submission_Status!: number;
    public Facility_Name!: string;
    public Address!: string;
    public City!: string;
    public Postal_Code!: string;
    public Province!: string;
    public Sector!: string;
    public NG_distribution_Company!: string;
    public NG_distribution_Company_data_extraction!: string;
    public Primary_Facility_Type!: string;
    public All_Facility_Types!: string;
    public Year_Built!: number;
    public floor_count!: number;
    public Facility_GFA!: number;
    public Facility_Occupied_GFA!: number;
    public Facility_Unoccupied_GFA!: number;
    public Longitude!: number;
    public Latitude!: number;
    public Facility_BAS!: string;
    public Facility_BAS_Connectivity!: boolean;
    public is_approved!: boolean;
    public is_active!: number;
    public approved_by!: number;
    public total_facility!: number;
    public total_user!: number;
    public created_at!: Date;
    public updated_at!: Date;
    public created_by!: number;
    public updated_by!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

}

/**
 * Facility model definition.
 * 
 * Defines the structure and constraints for the 'Facilitys' table in the database.
 * 
 */

Facility.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        Facility_ID_General_Status: {
            type: DataTypes.INTEGER,
        },
        Facility_ID_Submission_Status: {
            type: DataTypes.INTEGER,
        },
        Facility_Name: {
            type: DataTypes.STRING(255),
        },
        Address: {
            type: DataTypes.STRING(255),
        },
        City: {
            type: DataTypes.STRING(255),
        },
        Postal_Code: {
            type: DataTypes.STRING(255),
        },
        Province: {
            type: DataTypes.STRING(255),
        },
        Sector: {
            type: DataTypes.STRING(255),
        },
        NG_distribution_Company: {
            type: DataTypes.STRING(255),
        },
        NG_distribution_Company_data_extraction: {
            type: DataTypes.TEXT,
        },
        Primary_Facility_Type: {
            type: DataTypes.STRING(255),
        },
        All_Facility_Types: {
            type: DataTypes.TEXT,
        },
        Year_Built: {
            type: DataTypes.INTEGER,
        },
        floor_count: {
            type: DataTypes.INTEGER,
        },
        Facility_GFA: {
            type: DataTypes.DECIMAL,
        },
        Facility_Occupied_GFA: {
            type: DataTypes.DECIMAL,
        },
        Facility_Unoccupied_GFA: {
            type: DataTypes.DECIMAL,
        },
        Longitude: {
            type: DataTypes.DECIMAL,
        },
        Latitude: {
            type: DataTypes.DECIMAL,
        },
        Facility_BAS: {
            type: DataTypes.TEXT,
        },
        Facility_BAS_Connectivity: {
            type: DataTypes.BOOLEAN,
        },
        is_approved: {
            type: DataTypes.BOOLEAN,
        },
        is_active: {
            type: DataTypes.INTEGER,
        },
        approved_by: {
            type: DataTypes.INTEGER,
        },
        total_facility: {
            type: DataTypes.INTEGER,
        },
        total_user: {
            type: DataTypes.INTEGER,
        },
        created_at: {
            type: DataTypes.DATE,
        },
        updated_at: {
            type: DataTypes.DATE,
        },
        created_by: {
            type: DataTypes.INTEGER,
        },
        updated_by: {
            type: DataTypes.INTEGER,
        }
    },
    {
        sequelize,
        tableName: 'facility', // Adjust table name as per your requirement
        timestamps: true,
        underscored: true, // Set to true if your column names use snake_case instead of camelCase
        modelName: 'Facility', // Adjust model name as per your requirement
    }
);

export { Facility };