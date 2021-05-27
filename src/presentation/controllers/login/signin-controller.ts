import MissingParamError from '../../errors/missing-param-error';
import { IController, THttpRequest } from '../../protocols';

export default class SigInController implements IController {
  handle(httpRequest: THttpRequest): any {
    const input = httpRequest.body;

    const requiredFields = ['email', 'password'];
    for (const fieldName of requiredFields) {
      if (!input[fieldName]) {
        return new MissingParamError(fieldName);
      }
    }
    return Promise.resolve({ body: '', statusCode: 200 });
  }
};
