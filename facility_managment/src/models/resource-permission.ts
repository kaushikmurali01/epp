import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../services/database';

class ResourcePermission extends Model {
    public id!: number;
    public permission_name: string;
    public permission_type: string;
    public createdAt!: Date;
    public updatedAt!: Date;
    public created_by!: number;
    public updated_by!: number;
}

ResourcePermission.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        permission_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        permission_type: {
            type: DataTypes.STRING,
            allowNull: false,
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
        tableName: 'resource_permission'
    }
);

export { ResourcePermission };
