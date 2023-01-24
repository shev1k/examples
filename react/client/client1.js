import axios from 'axios';

import { API_URL } from 'src/constants';
import {
  setAccessTokenToCookie,
  getAccessTokenFromCookie,
  getRefreshTokenFromCookie,
} from 'src/utils/cookie';

const withAccess = (headers = {}) => ({
  ...headers,
  Authorization: `Bearer ${getAccessTokenFromCookie()}`,
});

const withRefresh = (headers = {}) => ({
  ...headers,
  Authorization: `Bearer ${getRefreshTokenFromCookie()}`,
});

const METHOD = {
  GET: 'get',
  POST: 'post',
  PUT: 'put',
  DELETE: 'delete',
};

class Client {
  constructor() {
    this._client = axios.create({
      baseURL: API_URL,
      headers: withAccess({}),
      validateStatus: (_status) => true,
    });
  }

  _refreshToken = async () => {
    const headers = withRefresh();

    try {
      const response = await this.post('/refresh_token', null, {
        headers,
      });

      if (response && response.status === 200) {
        const { access_token } = response.data;

        setAccessTokenToCookie(access_token);
        this._client.defaults.headers.Authorization = `Bearer ${access_token}`;
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.group('Refresh token error');
      console.log(error);
      console.groupEnd();
    }
  };

  _refreshAccessToken = () => {
    const access_token = getAccessTokenFromCookie();
    this._client.defaults.headers.Authorization = `Bearer ${access_token}`;
  };

  _makeRequest = async (method, { url, data, config }) => {
    const args = [url, data, config].filter((i) => i !== undefined);

    try {
      const response = await this._client[method].call(null, ...args);

      if (response.status === 200) {
        return Promise.resolve({
          data: response.data,
          status: response.status,
        });
      }

      throw response;
    } catch (response) {
      if (response.status === 401) {
        await this._refreshToken();
        return await this._client[method].call(null, ...args);
      }
    }
  };

  get = async (url, config = {}) => {
    return this._makeRequest(METHOD.GET, { url, config });
  };

  post = async (url, data = null, config = {}) => {
    return this._makeRequest(METHOD.POST, { url, data, config });
  };

  put = async (url, data = null, config = {}) => {
    return this._makeRequest(METHOD.PUT, { url, data, config });
  };

  delete = async (url, config = {}) => {
    return this._makeRequest(METHOD.DELETE, { url, config });
  };
}

const client = new Client();

export { client };
