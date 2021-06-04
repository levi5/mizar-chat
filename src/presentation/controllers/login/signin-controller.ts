import { IAuthenticationUser, IGetAccount } from '..';
import { MissingParamError } from '../../errors/missing-param-error';
import { serverError, success, unauthorized } from '../../helpers';
import { IController, THttpRequest } from '../../protocols';

export default class SigInController implements IController {
  constructor(
    private readonly authentication: IAuthenticationUser,
    private readonly getAccount: IGetAccount
  ) {
    this.authentication = authentication
    this.getAccount = getAccount
  }
  async handle(httpRequest: THttpRequest): Promise<any> {
    try {
      const { body } = httpRequest

      const requiredFields = ['email', 'password'];
      for (const fieldName of requiredFields) {
        if (!body[fieldName])
          return new Promise(resolve => resolve(new MissingParamError(fieldName)))
      }
      const { email, password } = body
      const token = await this.authentication.auth({ email, password })

      if (!token)
        return unauthorized()

      await this.getAccount.get(token as string)
      return success(token)

    } catch (error) {
      return serverError(error.stack)
    }
  }
}