import { UnauthorizedError } from "../../errors";
import { THttpResponse } from "../../protocols";

export const unauthorized = (): THttpResponse => {
  return {
    body: new UnauthorizedError(),
    statusCode: 401
  };
};