import { Company } from "../models/company.model";
import { Permission } from "../models/permission.model";
import { UserCompanyRole } from "../models/user-company-role";
import { User } from "../models/user.model";
import { UserCompanyRolePermission } from "../models/user_company_role_permission.model";
import { sequelize } from "../services/database";
import { Op } from 'sequelize';


class AuthorizationService {
  public static async check(companyId: number, userId: number, permissions: string[], role_id: number): Promise<any> {
    try {

        const company = await Company.findByPk(companyId);
        const user = await User.findByPk(userId);
        const companyRole:any = await UserCompanyRole.findOne({where: {
          company_id: companyId,
          user_id: userId
      }});
        role_id = Number(companyRole?.role_id);
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
          },
          include: [{
            model: Permission,
            where: {
              permission: {
                [Op.in]: permissions
              }
            },
            attributes: ['permission']
          }],
          attributes: ['permission_id']
        });
        
        
    
        // Extract the permission strings that the user has
        const userPermissionStrings = userPermissions.map(up => up.Permission.permission);
        // Check if userPermissionStrings contains all the required permissions
        const hasAllPermissions = permissions.some(permission => userPermissionStrings.includes(permission));
        return hasAllPermissions;
    }
      } catch (error) {
        console.error('Error checking user permissions:', error);
        return false;
      }
    
  }
}

export { AuthorizationService};

