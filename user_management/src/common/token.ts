/**
 * Token class provides methods for handling JWT tokens.
 */
import * as jwt from 'jsonwebtoken';

export class Token {
    /**
     * Asynchronously decodes the JWT token and returns the decoded payload.
     * @param token The JWT token to decode.
     * @returns A promise that resolves to the decoded payload if decoding is successful, otherwise null.
     */
    static async getDataFromToken(token: string): Promise<any | null> {
        
        // Decode the token
        const decodedToken = jwt.decode(token);

        // Return the decoded payload
        return decodedToken;
    }
}
