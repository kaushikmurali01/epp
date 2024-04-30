import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../services/database';
import { User } from './user'; 

interface UserInvitationAttributes {
  id: number;
  email: string;
  role: string;
  invitation_sent_date: Date;
  invitation_sent_time: string;
  created_by: number;
  updated_by: number;
  //updated_at: Date;
  //created_at: Date;
  status: string;
}

interface UserInvitationCreationAttributes extends Optional<UserInvitationAttributes, 'id'> {}

class UserInvitation extends Model<UserInvitationAttributes, UserInvitationCreationAttributes> implements UserInvitationAttributes {
  public id!: number;
  public email!: string;
  public role!: string;
  public invitation_sent_date!: Date;
  public invitation_sent_time!: string;
  public created_by!: number;
  public updated_by!: number;
 // public updated_at!: Date;
//  public created_at!: Date;
  public status!: string;
}

UserInvitation.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING(50),
    },
    invitation_sent_date: {
      type: DataTypes.DATE,
    },
    invitation_sent_time: {
      type: DataTypes.TIME,
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id'
      }
    },
    updated_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id'
      }
    },
    status: {
      type: DataTypes.STRING(20),
    }
  },
  {
    sequelize,
    tableName: 'user_invitation',
  }
);

export { UserInvitation };
