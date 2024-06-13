import { HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import * as jwt from 'jsonwebtoken';
import { sequelize } from "../services/database";
import { User } from "../models/user.model";
import { Token } from "./toekn.helper";
import { UserCompanyRole } from "../models/user-company-role";
import { ResponseHandler } from "../utils/response-handler";
import { HTTP_STATUS_CODES, RESPONSE_MESSAGES } from "../utils/status";

// Middleware to decode JWT token
export async function decodeToken(req: HttpRequest, context: InvocationContext, next: () => Promise<HttpResponseInit>): Promise<any> {
    try {
        const token = req.headers.get('Authorization');
        if (!token) {
            return { status: 401, body: 'Unauthorized: Token missing' };
        } else {
            const decodedToken: any = await Token.getDataFromToken(String(token.replace("Bearer ", "")));
            context.log(decodedToken, "decoded token")
            const user = await User.findOne({
                where: {
                    email: decodedToken.emails[0]
                },
                attributes: ['id', 'email', 'type']
            });
            if (!decodedToken) {
                return { status: 401, body: 'Unauthorized: Invalid token' };
            }

            // const user = await User.findOne({
            //     where: {
            //         email: decodedToken.emails[0]
            //     },
            //     // include: [{
            //     //     model: UserCompanyRole,
            //     //     attributes: [],
            //     //     required: false
            //     // }],
            //     attributes: ['id', 'email', 'first_name', 'last_name', 'type']
            // });
            // console.log(user.id, "aaaaaaaaaaaaaaaaaaa")
            // const findCompany = await UserCompanyRole.findOne({
            //     where: { user_id: user.id }
            // })
            context.log(user, "check usrerr")
            if (user) {
                // Make decoded token available for subsequent functions
                req['decodedToken'] = user?.dataValues
                // Call the next function
                return user?.dataValues

            } else {
                const errorMessage = {
                    message: RESPONSE_MESSAGES.unauthorized,
                    statusCode: HTTP_STATUS_CODES.UNAUTHORIZED_ACCESS,
                };
                throw errorMessage;
            }

        }


    } catch (error) {
        return { status: 500, body: `${error.message}` };
    }
}

export async function decodeTokenMiddleware(req: HttpRequest, context: InvocationContext, next: () => Promise<HttpResponseInit>): Promise<any> {
    try {
        const token = req.headers.get('Authorization');
        if (!token) return { status: 401, body: 'Unauthorized: Token missing' };
        const tokenValue = token.substring('Bearer '.length); // Extracting token part without 'Bearer '
        const decodedToken: any = await Token.getDataFromToken(tokenValue);
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
            attributes: ['id', 'email', 'first_name', 'last_name', 'type', [sequelize.col('UserCompanyRole.role_id'), 'role_id'], [sequelize.col('UserCompanyRole.company_id'), 'company_id']]
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
