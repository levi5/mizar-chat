import { IAuthenticationUser } from '..';
import MissingParamError from '../../errors/missing-param-error';
import { IController, THttpRequest } from '../../protocols';

export default class SigInController implements IController {
  constructor(private readonly authentication: IAuthenticationUser) {
    this.authentication = authentication
  }
  async handle(httpRequest: THttpRequest): Promise<any> {
    const { body } = httpRequest

    const requiredFields = ['email', 'password'];
    for (const fieldName of requiredFields) {
      if (!body[fieldName])
        return new Promise(resolve => resolve(new MissingParamError(fieldName)))
    }
    const { email, password } = body
    await this.authentication.auth({ email, password })
    return Promise.resolve({ body: '', statusCode: 200 });
  }
};
