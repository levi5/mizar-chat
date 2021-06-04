import { TAccountModel } from "../../model"
export interface IGetAccount {
  get(token: string): Promise<TAccountModel>
}