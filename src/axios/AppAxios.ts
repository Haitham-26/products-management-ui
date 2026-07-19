import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";

type RetriableAxiosRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

const AppAxios = axios.create({
  baseURL: import.meta.env.VITE_BASE_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

let refreshRequest: Promise<string> | null = null;

const onLogout = () => {
  window.location.href = "/login";
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("persist:root");
};

AppAxios.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

AppAxios.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as
      | RetriableAxiosRequestConfig
      | undefined;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      originalRequest.url !== "/auth/refresh-token"
    ) {
      originalRequest._retry = true;

      try {
        if (!refreshRequest) {
          refreshRequest = AppAxios.post<{
            accessToken: string;
          }>(
            "/auth/refresh-token",
            {},
            {
              withCredentials: true,
            },
          )
            .then(({ data }) => {
              localStorage.setItem("accessToken", data.accessToken);
              return data.accessToken;
            })
            .finally(() => {
              refreshRequest = null;
            });
        }

        const accessToken = await refreshRequest;

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        return AppAxios(originalRequest);
      } catch (refreshError) {
        console.error("Unauthorized.");
        onLogout();
        return Promise.reject(refreshError);
      }
    }

    if (error.response?.status === 401) {
      console.error("Unauthorized.");
      onLogout();
    }

    return Promise.reject(error);
  },
);
export default AppAxios;
