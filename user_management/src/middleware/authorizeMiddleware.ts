import { Company } from "../models/company";
import { Permission } from "../models/permission";
import { User } from "../models/user";
import { UserCompanyRolePermission } from "../models/userCompanyRolePermission";
import { sequelize } from "../services/database";
import { Op } from 'sequelize';


class AuthorizationService {
  // Method to check the status of the company and user
  public static async checkCompanyAndUserStatus(companyId: number, userId: number): Promise<any> {
    const company = await Company.findByPk(companyId);
    if (!company) {
      return { status: 404, message: 'Company does not exist.' };
    }
    if (company.is_active === 0) {
      return { status: 403, message: 'The company is inactive.' };
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return { status: 404, message: 'User does not exist.' };
    }
    if (user.is_active === 0) {
      return { status: 403, message: 'The user is inactive.' };
    }
  }

  public static async check(companyId: number, userId: number, permissions: string[], role_id: number): Promise<any> {
    try {

        const company = await Company.findByPk(companyId);
        const user = await User.findByPk(userId);
        if (!company || company.is_active === 0 || !user || user.is_active === 0) {
            return false;
        } else if ([1, 2].includes(role_id)) {
            return true;
        } else {

        // Fetch the UserCompanyRolePermission records with the joined Permission records
        const userPermissions:any = await UserCompanyRolePermission.findAll({
          where: {
            user_id: userId,
            company_id: companyId
           // is_active: 1, // Assuming is_active 1 means active
          },
          include: [{
            model: Permission,
            where: {
              permission: {
                [Op.in]: permissions
              }
             // is_active: 1 // Assuming is_active 1 means active
            },
            attributes: ['permission']
          }],
          attributes: ['permission_id']
        });
    
        // Extract the permission strings that the user has
        const userPermissionStrings = userPermissions.map(up => up.Permission.permission);
    
        // Check if userPermissionStrings contains all the required permissions
        const hasAllPermissions = permissions.every(permission => userPermissionStrings.includes(permission));
    
        return hasAllPermissions;
    }
      } catch (error) {
        console.error('Error checking user permissions:', error);
        return false;
      }
    
  }
}

export { AuthorizationService};

