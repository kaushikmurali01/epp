import { HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { Token } from "../common/token";
import * as jwt from 'jsonwebtoken';
import { User } from "../models/user";
import { UserCompanyRole } from "../models/user-company-role";
import { sequelize } from "../services/database";

// Middleware to decode JWT token
export async function decodeTokenMiddleware(req: HttpRequest, context: InvocationContext, next: () => Promise<HttpResponseInit>): Promise<any> {
    try {
        const token = req.headers.get('Authorization');
        if (!token) return { status: 401, body: 'Unauthorized: Token missing' };
        const tokenValue = token.substring('Bearer '.length); // Extracting token part without 'Bearer '
        const decodedToken:any = await Token.getDataFromToken(tokenValue);
        const user = await User.findOne({
            where: {
                email: decodedToken.emails[0]
            },
            include: [{
                model: UserCompanyRole,
                attributes: [],
                required: false
            }],
            attributes: ['id', 'email', 'type',[sequelize.col('UserCompanyRole.role_id'), 'role_id'],[sequelize.col('UserCompanyRole.company_id'), 'company_id']]
        });
        if (!decodedToken) {
            return { status: 401, body: 'Unauthorized: Invalid token' };
        }

        // Make decoded token available for subsequent functions
       // req['decodedToken'] = user.dataValues;

        // Call the next function
        return user.dataValues;
    } catch (error) {
        return { status: 500, body: `${error.message}` };
    }
}
