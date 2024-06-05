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
        console.log("DecodedToken", decodedToken);
        const user = await User.findOne({
            where: {
                email: decodedToken.emails[0]
            },
            include: [{
                model: UserCompanyRole,
                attributes: [],
                required: false
            }],
            attributes: ['id', 'email', 'first_name', 'last_name', 'type',[sequelize.col('UserCompanyRole.role_id'), 'role_id'],[sequelize.col('UserCompanyRole.company_id'), 'company_id']]
        });
        if (!decodedToken) {
            return { status: 401, body: 'Unauthorized: Invalid token' };
        }

        // const userData = {
        //     id: user.dataValues.id,
        //     email: user.dataValues.email,
        //     type: user.dataValues.type,
        //     role_id: user.get('role_id') || null,
        //     company_id: user.get('company_id') || null
        // };
       // return userData;

        console.log("values", user?.dataValues)

        // Call the next function
        return user?.dataValues;
    } catch (error) {
        return { status: 500, body: `${error.message}` };
    }
}
