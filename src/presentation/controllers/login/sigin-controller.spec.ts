import SigInController from './signin-controller'
import { THttpRequest } from '../../protocols'
import { IAuthenticationUser, IGetAccount, TAuthenticationUserModel } from '../index'
import { MissingParamError, UnauthorizedError } from '../../errors/index'
import { serverError, success, unauthorized } from '../../helpers'
import { TAccountModel } from '../../../domain/model'


type SutTypes = {
  sut: SigInController,
  authenticationStub: IAuthenticationUser,
  getAccountStub: IGetAccount
}

const makeHttpRequest = () => ({
  body: { email: 'any_mail.com', password: 'any_password' }
})
const makeGetAccount = () => {
  class GetAccount implements IGetAccount {
    get(token: string): Promise<TAccountModel> {
      return Promise.resolve({ user: {} })
    }
  }
  return new GetAccount()
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
  const getAccountStub = makeGetAccount()
  const signInController = new SigInController(authenticationStub, getAccountStub)
  return {
    sut: signInController,
    authenticationStub,
    getAccountStub
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
    const authSpy = jest.spyOn(authenticationStub, "auth")
    await sut.handle(makeHttpRequest())
    expect(authSpy).toHaveBeenCalledWith({ email: 'any_mail.com', password: 'any_password' })
  })

  test("Should return unauthorized if userAuthentication fails", async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, "auth").mockImplementationOnce(() => {
      return Promise.resolve(false)
    })
    const httpError = await sut.handle(makeHttpRequest())
    expect(httpError).toEqual(unauthorized())
  })

  test("Should return success if userAuthentication not fails", async () => {
    const { sut } = makeSut()
    const httpError = await sut.handle(makeHttpRequest())
    expect(httpError).toEqual(success('any_token'))
  })

  test("Should return 500 if Authentication throws", async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error)))
    const httpError = await sut.handle(makeHttpRequest())
    expect(httpError).toEqual(serverError(new Error()))
  })

  test("Should call getAccount with value correct", async () => {
    const { sut, getAccountStub } = makeSut()
    const spyGetAccount = jest.spyOn(getAccountStub, 'get')
    await sut.handle(makeHttpRequest())
    const token = 'any_token'
    expect(spyGetAccount).toHaveBeenCalledWith(token)
  })
})
