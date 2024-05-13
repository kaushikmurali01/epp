import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../services/database';
import { Role } from './role';
import { Permission } from './permission';

class RolePermission extends Model {
    public id!: number;
    public role_id!: number;
    public permission_id!: number;
  //  public created_at!: Date;
   // public updated_at!: Date;
    public created_by!: number;
    public updated_by!: number;
}

RolePermission.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        role_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        permission_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        // created_at: {
        //     type: DataTypes.DATE,
        //     allowNull: false,
        //     defaultValue: DataTypes.NOW
        // },
        // updated_at: {
        //     type: DataTypes.DATE,
        //     allowNull: false,
        //     defaultValue: DataTypes.NOW
        // },
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
        tableName: 'role_permission'
    }
);

// Define associations
 RolePermission.belongsTo(Role, { foreignKey: 'role_id' }); // Define the role_id foreign key association
 RolePermission.belongsTo(Permission, { foreignKey: 'permission_id' }); // Define the permission_id foreign key association

export { RolePermission };
