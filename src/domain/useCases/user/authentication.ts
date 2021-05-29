export type TAuthenticationUserModel = {
  email: string,
  password: string,
}


export interface IAuthenticationUser {
  auth(authenticationParams: TAuthenticationUserModel): Promise<string>
}