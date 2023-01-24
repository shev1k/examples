import axios from "axios";
import createAuthRefreshInterceptor from "axios-auth-refresh";

import { cookieService } from "services";
import { customHistory } from "router";

export const CORS_ANYWHERE = "http://0.0.0.0:8080";

export const BASE_URL =
  process.env.NODE_ENV === "production"
    ? ""
    : `${CORS_ANYWHERE}/${process.env.BASE_URL}`;
export const API_URL = `${BASE_URL}/api`;

const client = axios.create({
  baseURL: API_URL,
});

client.interceptors.request.use((request) => {
  request.headers["Authorization"] = `Bearer ${cookieService.getAuthCookie()}`;
  return request;
});

client.interceptors.response.use(null, (error) => {
  const { response = {}, config = {} } = error;
  const { status } = response;
  const { url } = config;

  // If refresh token expired
  if (url === "/auth/refresh" && status === 401) {
    cookieService.deleteAuthCookie();
    customHistory.push("/login");
  }

  throw error;
});

const refreshToken = async () => {
  const { data } = await client.post("/auth/refresh");
  const { access_token, expires_in } = data;

  cookieService.setAuthCookie({ access_token, expires_in });
};

createAuthRefreshInterceptor(client, refreshToken, { retryInstance: client });

export { client };
