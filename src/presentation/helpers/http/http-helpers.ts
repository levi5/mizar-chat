import { ServerError, UnauthorizedError } from "../../errors";
import { THttpRequest, THttpResponse } from "../../protocols";

export const unauthorized = (): THttpResponse => {
  return {
    body: new UnauthorizedError(),
    statusCode: 401
  }
}

export const success = (response: any) => {
  return {
    body: response,
    statusCode: 200
  }
}

export const serverError = (error: Error) => {
  return {
    body: new ServerError(error.stack),
    statusCode: 500
  }
}