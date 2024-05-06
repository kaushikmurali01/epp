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
        if (!token) {
            return { status: 401, body: 'Unauthorized: Token missing' };
        }

        // Decode token
        const decodedToken:any = await Token.getDataFromToken(token);
        console.log("DecodedToken", decodedToken.emails[0]);
        const user = await User.findOne({
            where: {
                email: decodedToken.emails[0]
            },
            include: [{
                model: UserCompanyRole,
                attributes: []
            }],
            attributes: ['id', 'email', 'type',[sequelize.col('UserCompanyRole.company_id'), 'company_id']]
        });
        context.log("User",user.dataValues);
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
