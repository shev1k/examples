import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosError,
  AxiosResponse,
} from 'axios';
import * as R from 'ramda';

import { cookieService } from 'services';
import { IResponseBody, IError } from 'interfaces';

interface ISpecificFieldError {
  [key: string]: {
    msg: string;
  };
}

interface ICommonError {
  message?: string;
}

interface IResponseError {
  errors: ISpecificFieldError & ICommonError;
}

enum METHOD {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  DELETE = 'delete',
}

type URL = string;
type Data = any;
type Config = AxiosRequestConfig;

class Client {
  private client: AxiosInstance;

  constructor() {
    const client = axios.create({
      baseURL: `http://localhost:${process.env.REACT_APP_NODE_PORT || 9000}/api`,
    });

    client.interceptors.request.use((request) => {
      if (request?.headers) {
        const { accessToken } = cookieService.getTokens();
        if (accessToken) request.headers['Authorization'] = `Bearer ${accessToken}`;
      }
      return request;
    });

    this.client = client;
  }

  public get = async <T = IResponseBody<any>>(
    url: URL,
    config?: Config,
  ): Promise<T> => {
    return await this.request(METHOD.GET, url, undefined, config);
  };

  public post = async <T = IResponseBody<any>>(
    url: URL,
    data?: Data,
    config?: Config,
  ): Promise<T> => {
    return await this.request(METHOD.POST, url, data, config);
  };

  public put = async <T = IResponseBody<any>>(
    url: URL,
    data?: Data,
    config?: Config,
  ): Promise<IResponseBody<T>> => {
    return await this.request(METHOD.PUT, url, data, config);
  };

  public delete = async <T = IResponseBody<any>>(
    url: URL,
    config?: Config,
  ): Promise<IResponseBody<T>> => {
    return await this.request(METHOD.DELETE, url, undefined, config);
  };

  private request = async (
    method: METHOD,
    url: URL,
    data?: Data,
    config?: Config,
  ) => {
    if (method in this.client) {
      const requestArgs = [url, data, config].filter((value) => value !== undefined);

      try {
        // @ts-ignore
        const response = await this.client[method](...requestArgs);
        return this.getResponseData(response);
      } catch (error) {
        if (error.response.status === 401) {
          try {
            await this.refreshToken();

            // @ts-ignore
            const response = await this.client[method](...requestArgs);
            return this.getResponseData(response);
          } catch (error) {
            throw this.formatError(error);
          }
        }
        throw this.formatError(error);
      }
    } else {
      throw new Error(`Method: "${method}" doesn't exists on the client instance`);
    }
  };

  private refreshToken = async () => {
    try {
      const { refreshToken } = cookieService.getTokens();
      if (!refreshToken) {
        throw Object.assign(new Error(), { status: 401 });
      }

      const {
        data: { data },
      } = await this.client.put('/auth/refreshToken', { refreshToken });
      const { accessToken, expiresIn } = data;

      cookieService.setAuthCookie({ accessToken, expiresIn });
    } catch (response) {
      // refresh token expired
      if (response?.status === 401) {
        cookieService.deleteAuthCookies();
      }
    }
  };

  private getResponseData(response: AxiosResponse) {
    return R.pathOr(null, ['data'], response);
  }

  private formatError(error: AxiosError<IResponseError>): IError {
    const { errors } = error.response.data;
    return Object.entries(errors).reduce((errors, [key, value]) => {
      errors[key] = R.pathOr(value, ['msg'], value);
      return errors;
    }, {});
  }
}

const client = new Client();

export default client;
