import MissingParamError from '../../errors/missing-param-error';
import { THttpRequest } from '../../protocols';
import SigInController from './signin-controller';

describe('SignIn Controller', () => {
  test('Should return MissingParamError if email field has not been passed', () => {
    const sut = new SigInController();
    const httpRequest: THttpRequest = { body: { password: 'any_password' } };
    const error = sut.handle(httpRequest);
    expect(error).toEqual(new MissingParamError('email'));
  });
});
