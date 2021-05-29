import MissingParamError from '../../errors/missing-param-error'
import { THttpRequest } from '../../protocols';
import SigInController from './signin-controller';

type SutTypes = {
  sut: SigInController
}
const makeSut = (): SutTypes => {
  const signInController = new SigInController()
  return {
    sut: signInController
  }
}

describe('SignIn Controller', () => {
  test('Should return MissingParamError if email field has not been passed', () => {
    const { sut } = makeSut();
    const httpRequest: THttpRequest = { body: { password: 'any_password' } }
    const error = sut.handle(httpRequest);
    expect(error).toEqual(new MissingParamError('email'));
  })

  test('Should return MissingParamError if password field has not been passed', () => {
    const { sut } = makeSut();
    const httpRequest: THttpRequest = { body: { email: 'any_mail.com' } }
    const error = sut.handle(httpRequest)
    expect(error).toEqual(new MissingParamError('password'))
  })
})
