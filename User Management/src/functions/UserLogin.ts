import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { message } from "../utils/message";

export async function UserLogin(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    let resp = {status: 200, message: "Logged in successfully"};
    return { body:JSON.stringify(resp) };
};

app.http('UserLogin', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: UserLogin
});
