import { IAuthenticationUser, TAuthenticationUserModel } from '../index';
import MissingParamError from '../../errors/missing-param-error'
import { THttpRequest } from '../../protocols';
import SigInController from './signin-controller';

type SutTypes = {
  sut: SigInController,
  authenticationStub: IAuthenticationUser
}

const makeAuthentication = () => {
  class AuthenticationStub implements IAuthenticationUser {
    async auth(authenticationParams: TAuthenticationUserModel): Promise<string> {
      return Promise.resolve("any_token")
    }
  }
  return new AuthenticationStub()
}


const makeSut = (): SutTypes => {
  const authenticationStub = makeAuthentication()
  const signInController = new SigInController(authenticationStub)
  return {
    sut: signInController,
    authenticationStub
  }
}

describe('SignIn Controller', () => {
  test('Should return MissingParamError if email field has not been passed', async () => {
    const { sut } = makeSut();
    const httpRequest: THttpRequest = { body: { password: 'any_password' } }
    const error = await sut.handle(httpRequest);
    expect(error).toEqual(new MissingParamError('email'));
  })
  test('Should return MissingParamError if password field has not been passed', async () => {
    const { sut } = makeSut();
    const httpRequest: THttpRequest = { body: { email: 'any_mail.com' } }
    const error = await sut.handle(httpRequest)
    expect(error).toEqual(new MissingParamError('password'))
  })
  test("Should call userAuthentication with values corrects", async () => {
    const { sut, authenticationStub } = makeSut()
    const httpRequest: THttpRequest = { body: { email: 'any_mail.com', password: 'any_password' } }
    const authSpy = jest.spyOn(authenticationStub, "auth")
    await sut.handle(httpRequest)
    expect(authSpy).toHaveBeenCalledWith({ email: 'any_mail.com', password: 'any_password' })
  })
})
