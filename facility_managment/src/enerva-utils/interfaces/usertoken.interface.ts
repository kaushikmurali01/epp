//import { JwtPayload } from "jsonwebtoken";

export interface IUserToken {
  id: number;
  type?: string | null;
  company_id?: number | null;
  emails?: any;
}
