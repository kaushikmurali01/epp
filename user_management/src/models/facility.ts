import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../services/database';
 interface IFacilityAttributes {
    id: number | null;
    facility_construction_status?: number | null;
    facility_name?: string | null;
    naic_code?: string | null;
    facility_category?: string | null;
    facility_type?: string | null;
    target_saving?: string | null;
    display_pic_url?: string | null;
    unit_number?: string | null;
    street_number?: string | null;
    street_name?: string | null;
    city?: string | null;
    country?: string | null;
    province?: string | null;
    postal_code?: string | null;
    address?: string | null;
    sector?: string | null;
    year_of_construction?: number | null;
    gross_floor_area?: string | null;
    number_of_storeys?: number | null;
    occupancy?: number | null;
    number_of_building?: number | null;
    company_id?: number | null;
    facility_id_general_status?: number | null;
    facility_id_submission_status?: number | null;
    ng_distribution_company?: string | null;
    ng_distribution_company_data_extraction?: string | null;
    longitude?: number | null;
    latitude?: number | null;
    facility_bas?: string | null;
    facility_bas_connectivity?: boolean | null;
    is_approved?: boolean | null;
    approved_by?: number | null;
    is_active?: number | null;
    created_at?: Date | null;
    updated_at?: Date | null;
    created_by?: number | null;
    updated_by?: number | null;
    total_electricity_savings?: number | null;
    energy_savings?: number | null;
    total_incentive_earned?: number | null;
    benchmarking_eui?: number | null;
    facility_nickname?: string | null;
}
interface FacilityCreationAttributes extends Optional<IFacilityAttributes, 'id'> {}

class Facility extends Model<IFacilityAttributes, FacilityCreationAttributes> implements IFacilityAttributes  {
    public id!: number;
    public facility_construction_status!:number
    public facility_name!: string;
    public naic_code!: string;
    public facility_category!: string;
    public facility_type!: string;
    public target_saving!: string;
    public display_pic_url: string;
    public unit_number !: string;
    public street_number !: string;
    public street_name !: string;
	public city !: string;
	public country !: string;
	public province !: string;
    public postal_code !: string;
    public address !: string;
    public sector !: string;
    public year_of_construction !: number;
    public gross_floor_area !: string;
    public number_of_storeys !: number;
    public occupancy !: number;
    public number_of_building !: number;
    public company_id !: number;
    public facility_id_general_status !: number;
	public facility_id_submission_status !: number;
	public ng_distribution_company!: string;
	public ng_distribution_company_data_extraction!: string;
    public longitude!: number;
    public latitude!: number;
	public facility_bas!: string;
	public facility_bas_connectivity!: boolean;
	public is_approved!: boolean;
    public approved_by!: number;
	public is_active!: number;
	public created_at!: Date;
	public updated_at!: Date;
	public created_by!: number;
	public updated_by!: number;

    public total_electricity_savings!: number;
    public energy_savings!: number;
    public total_incentive_earned!: number;
    public benchmarking_eui!: number;
    public facility_nickname!: string;



    // public id!: number;
    // public facility_id_general_status!: number;
    // public facility_id_submission_status!: number;
    // public facility_name!: string;
    // public address!: string;
    // public city!: string;
    // public postal_code!: string;
    // public province!: string;
    // public sector!: string;
    // public ng_distribution_company!: string;
    // public ng_distribution_company_data_extraction!: string;
    // public primary_facility_type!: string;
    // public all_facility_types!: string;
    // public year_built!: number;
    // public floor_count!: number;
    // public facility_gfa!: number;
    // public facility_occupied_gfa!: number;
    // public facility_unoccupied_gfa!: number;
    // public longitude!: number;
    // public latitude!: number;
    // public facility_bas!: string;
    // public facility_bas_connectivity!: boolean;
    // public is_approved!: boolean;
    // public is_active!: number;
    // public approved_by!: number;
    // public total_facility!: number;
    // public total_user!: number;
    // public created_at!: Date;
    // public updated_at!: Date;
    // public created_by!: number;
    // public updated_by!: number;
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
        facility_construction_status: {
            type: DataTypes.INTEGER,
        },
        facility_name: {
            type: DataTypes.STRING(255),
        },
        naic_code: {
            type: DataTypes.STRING(255),
        },
        facility_category: {
            type: DataTypes.STRING(255),
        },
        facility_type: {
            type: DataTypes.STRING(255),
        },
        target_saving: {
            type: DataTypes.STRING(255),
        },
        display_pic_url: {
            type: DataTypes.STRING(255),
        },
        unit_number: {
            type: DataTypes.STRING(255),
        },
        street_number: {
            type: DataTypes.STRING(255),
        },
        street_name: {
            type: DataTypes.STRING(255),
        },
        city: {
            type: DataTypes.STRING(255),
        },
        country: {
            type: DataTypes.STRING(255),
        },
        province: {
            type: DataTypes.STRING(255),
        },
        postal_code: {
            type: DataTypes.STRING(255),
        },
        address: {
            type: DataTypes.STRING(255),
        },
        sector: {
            type: DataTypes.STRING(255),
        },
        year_of_construction: {
            type: DataTypes.INTEGER,
        },
        gross_floor_area: {
            type: DataTypes.STRING(255),
        },
        number_of_storeys: {
            type: DataTypes.INTEGER,
        },
        occupancy: {
            type: DataTypes.INTEGER,
        },
        number_of_building: {
            type: DataTypes.INTEGER,
        },
        company_id: {
            type: DataTypes.INTEGER,
        },
        facility_id_general_status: {
            type: DataTypes.INTEGER,
        },
        facility_id_submission_status: {
            type: DataTypes.INTEGER,
        },
        ng_distribution_company: {
            type: DataTypes.STRING(255),
        },
        ng_distribution_company_data_extraction: {
            type: DataTypes.TEXT,
        },
        longitude: {
            type: DataTypes.DECIMAL,
        },
        latitude: {
            type: DataTypes.DECIMAL,
        },
        facility_bas: {
            type: DataTypes.TEXT,
        },
        facility_bas_connectivity: {
            type: DataTypes.BOOLEAN,
        },
        is_approved: {
            type: DataTypes.BOOLEAN,
        },
        approved_by: {
            type: DataTypes.INTEGER,
        },
        is_active: {
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
        },

        total_electricity_savings: {
            type: DataTypes.INTEGER,
        },
        energy_savings: {
            type: DataTypes.INTEGER,
        },
        total_incentive_earned: {
            type: DataTypes.INTEGER,
        },
        benchmarking_eui: {
            type: DataTypes.INTEGER,
        },
        facility_nickname: {
            type: DataTypes.STRING(255)
        }

    },
    {
        sequelize,
        tableName: 'facility', 
        timestamps: true,
        underscored: true, 
        modelName: 'Facility', 
    }
);



export { Facility };




// Facility.init(
//     {
//         id: {
//             type: DataTypes.INTEGER,
//             autoIncrement: true,
//             primaryKey: true,
//         },
//         facility_id_general_status: {
//             type: DataTypes.INTEGER,
//         },
//         facility_id_submission_status: {
//             type: DataTypes.INTEGER,
//         },
//         facility_name: {
//             type: DataTypes.STRING(255),
//         },
//         address: {
//             type: DataTypes.STRING(255),
//         },
//         city: {
//             type: DataTypes.STRING(255),
//         },
//         postal_code: {
//             type: DataTypes.STRING(255),
//         },
//         province: {
//             type: DataTypes.STRING(255),
//         },
//         sector: {
//             type: DataTypes.STRING(255),
//         },
//         ng_distribution_company: {
//             type: DataTypes.STRING(255),
//         },
//         ng_distribution_company_data_extraction: {
//             type: DataTypes.TEXT,
//         },
//         primary_facility_type: {
//             type: DataTypes.STRING(255),
//         },
//         all_facility_types: {
//             type: DataTypes.TEXT,
//         },
//         year_built: {
//             type: DataTypes.INTEGER,
//         },
//         floor_count: {
//             type: DataTypes.INTEGER,
//         },
//         facility_gfa: {
//             type: DataTypes.DECIMAL,
//         },
//         facility_occupied_gfa: {
//             type: DataTypes.DECIMAL,
//         },
//         facility_unoccupied_gfa: {
//             type: DataTypes.DECIMAL,
//         },
//         longitude: {
//             type: DataTypes.DECIMAL,
//         },
//         latitude: {
//             type: DataTypes.DECIMAL,
//         },
//         facility_bas: {
//             type: DataTypes.TEXT,
//         },
//         facility_bas_connectivity: {
//             type: DataTypes.BOOLEAN,
//         },
//         is_approved: {
//             type: DataTypes.BOOLEAN,
//         },
//         is_active: {
//             type: DataTypes.INTEGER,
//         },
//         approved_by: {
//             type: DataTypes.INTEGER,
//         },
//         total_facility: {
//             type: DataTypes.INTEGER,
//         },
//         total_user: {
//             type: DataTypes.INTEGER,
//         },
//         created_at: {
//             type: DataTypes.DATE,
//         },
//         updated_at: {
//             type: DataTypes.DATE,
//         },
//         created_by: {
//             type: DataTypes.INTEGER,
//         },
//         updated_by: {
//             type: DataTypes.INTEGER,
//         }
//     },
//     {
//         sequelize,
//         tableName: 'facility', // Adjust table name as per your requirement
//         timestamps: true,
//         underscored: true, // Set to true if your column names use snake_case instead of camelCase
//         modelName: 'Facility', // Adjust model name as per your requirement
//     }
// );