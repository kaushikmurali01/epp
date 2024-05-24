//import { JwtPayload } from "jsonwebtoken";

export interface IUserToken {
  id: number;
  type?: number | null;
  company_id?: number | null;
  emails?: any;
}
