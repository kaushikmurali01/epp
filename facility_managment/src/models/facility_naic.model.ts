import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../utils/database';
import { IFacilityNAICAttributes } from '../interfaces/facility_naic.interface';



interface FacilityNAICCreationAttributes extends Optional<IFacilityNAICAttributes, "id"> {}

class FacilityNAIC extends Model<IFacilityNAICAttributes, FacilityNAICCreationAttributes> implements IFacilityNAICAttributes {
    public id!: number;
    public facility_category!: string | null;
    public facility_type!: string | null;
    public naic_code!: string | null;
    public property_definition!: string | null;
    public use_details!: string | null;
}

FacilityNAIC.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        facility_category: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        facility_type: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        naic_code: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        property_definition: {
            type: DataTypes.STRING(2048),
            allowNull: true,
        },
        use_details: {
            type: DataTypes.STRING(1024),
            allowNull: true,
        }
    },
    {
        sequelize,
        tableName: 'facility_naic_new',
        timestamps: false,
        underscored: true,
        modelName: 'FacilityNAIC',
    }
);

export { FacilityNAIC };
