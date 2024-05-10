import { HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import * as jwt from 'jsonwebtoken';
import { sequelize } from "../services/database";
import { User } from "../enerva-utils/models/user.model";
import { Token } from "./toekn";
import { UserCompanyRole } from "../enerva-utils/models/user-company-role";
import { ResponseHandler } from "../enerva-utils/utils/responseHandler";
import { HTTP_STATUS_CODES, RESPONSE_MESSAGES } from "../enerva-utils/utils/status";

// Middleware to decode JWT token
export async function decodeToken(req: HttpRequest, context: InvocationContext, next: () => Promise<HttpResponseInit>): Promise<any> {
    try {
        const token = req.headers.get('Authorization');
        if (!token) {
            return { status: 401, body: 'Unauthorized: Token missing' };
        }else{
        const decodedToken:any = await Token.getDataFromToken(String(token.replace("Bearer ", "")));

        console.log(decodedToken,"111111");
        
        const user = await User.findOne({
            where: {
                email: decodedToken.emails[0]
            },
            attributes: ['id', 'email', 'type']
        });

        if(user){

            console.log(user,"ppppppp");
            // Make decoded token available for subsequent functions
            req['decodedToken'] = user.dataValues;
    
            // Call the next function
            return user.dataValues;

        }else{
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
