import { JwtPayload } from "jsonwebtoken";

export interface IUserToken extends JwtPayload {
  deviceId?: string | null;
  fcmToken?: string | null;
  loginToken?: string | null;
  userId?: number | null;
  role?: number | null;
  email?: string | null;
  status?: number | null;
  accountVerified?: number | null;
}
