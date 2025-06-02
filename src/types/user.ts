
import { ChargingHistory } from "./station";

export interface UserCar {
  model: string;
  year: string;
  chargeType: string;
  id?: string;
}

export interface UserProfile {
  username: string;
  avatarUrl: string;
  id?: string;
  email?: string;
}

export interface ErrorResponse {
  message: string;
  status?: number;
  code?: string;
}
