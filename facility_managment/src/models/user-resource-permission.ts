import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../services/database';
import { ResourcePermission } from './resource-permission';

class UserResourceFacilityPermission extends Model {
    public id!: number;
    public email: string;
    public resource_permission_id: number;
    public facility_id: number;
    public company_id: number;
    public createdAt!: Date;
    public updatedAt!: Date;
}

UserResourceFacilityPermission.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        resource_permission_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        facility_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        company_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    },
    {
        sequelize,
        tableName: 'user_resource_facility_permission'
    }
);
UserResourceFacilityPermission.belongsTo(ResourcePermission, { foreignKey: 'resource_permission_id' }); // Define the resource_permission_id foreign key association
export { UserResourceFacilityPermission };
