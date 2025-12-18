import { ResponseApi } from "./api-types";

export interface User {
  uuid: string;
  name: string;
  email: string;
}

export interface UserProfile extends ResponseApi {
  accessToken: string;
  name: string;
  email: string;
}

export interface WalletType {
  uuid: string;
  name: string;
}
