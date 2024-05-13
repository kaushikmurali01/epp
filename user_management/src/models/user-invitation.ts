import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../services/database';
import { Role } from './role';
import { Company } from './company';
import { Status } from './status';

interface UserInvitationAttributes {
  id: number;
  email: string;
  role: number;
  invitation_sent_date: Date;
  invitation_sent_time: string;
  created_by: number;
  updated_by: number;
  status: number;
  company: number;
  type: number;
  permissions: number[];
  is_active?: number;
}

interface UserInvitationCreationAttributes extends Optional<UserInvitationAttributes, 'id'> {}

class UserInvitation extends Model<UserInvitationAttributes, UserInvitationCreationAttributes> implements UserInvitationAttributes {
  public id!: number;
  public email!: string;
  public role!: number;
  public invitation_sent_date!: Date;
  public invitation_sent_time!: string;
  public created_by!: number;
  public updated_by!: number;
  public status!: number;
  public company!: number;
  public type: number;
  public permissions: number[];
  public is_active?: number;
  
}

UserInvitation.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      // unique: {
      //   name: 'UniqueEmailConstraint',
      //   msg: 'Email address already exists.',
      // },
      validate: {
        isEmail: {
          msg: 'Invalid email format.',
        },
      },
    },
    role: {
      type: DataTypes.INTEGER,
    },
    company: {
      type: DataTypes.INTEGER,
    },
    invitation_sent_date: {
      type: DataTypes.DATE,
    },
    invitation_sent_time: {
      type: DataTypes.STRING,
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    updated_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    status: {
      type: DataTypes.INTEGER,
    },
    type: {
      type: DataTypes.INTEGER,
    },
    permissions: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
    },
    is_active: {
      type: DataTypes.INTEGER,
    },
  },
  {
    sequelize,
    tableName: 'user_invitation',
  }
);

// Define associations
UserInvitation.belongsTo(Role, { foreignKey: 'role' }); // Define the role_id foreign key association
UserInvitation.belongsTo(Company, { foreignKey: 'company' }); // Define the permission_id foreign key association
UserInvitation.belongsTo(Status, { foreignKey: 'status' });

export { UserInvitation };
