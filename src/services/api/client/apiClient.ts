/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Enhanced HTTP API client with authentication support
 */
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import axios, { AxiosError } from "axios";
import { cloneDeep, defaults, mapKeys } from "lodash";

import AuthApi from "../auth/authApi";
import GroupApi from "../group/groupApi";
import { setupAuthInterceptors } from "../interceptors/authInterceptor";
import { example } from "./example";

/**
 * API client for interacting with the API.
 */
export class ApiClient {
	public client: AxiosInstance;
	public auth: AuthApi;
	public group: GroupApi;

	// constructor for the API client
	constructor(
		authToken: string | undefined | null = " ",
		config: AxiosRequestConfig = {}
	) {
		this.client = this._setupClient(config);

		// Setup authentication interceptors
		setupAuthInterceptors(this.client);

		// Initialize auth API
		this.auth = new AuthApi(this.client);

		// Initialize group API
		this.group = new GroupApi(this.client);

		if (authToken) {
			this.setBearerToken(authToken);
		}
	}

	// Example API methods. Replace with your own API methods.
	public example = {
		get: () => this._parseResponse(example.get(this)),
	};

	// sets up the client with the given configuration
	private _setupClient(appConfig: AxiosRequestConfig) {
		const config: AxiosRequestConfig = cloneDeep(appConfig);

		config.headers = mapKeys(config.headers, (_, key) => key.toLowerCase());

		defaults(config.headers, {
			"content-type": "application/json",
		});

		// Set base URL from environment or default
		config.baseURL = (process.env as any).BASE_URL_API || "http://localhost:3000/api/v1";
		config.timeout = 10000;

		return axios.create(config);
	}

	// sets the bearer token for the client
	public setBearerToken(token: string) {
		this.client.defaults.headers.common.Authorization = `JWT ${token}`;
	}

	// parses the response from the API
	private _parseResponse(
		response: Promise<AxiosResponse<any>>
	): Promise<any> {
		return response
			.then(resp => {
				return {
					data: resp.data?.data ?? resp.data,
					message: resp.data?.message,
					success: resp.data?.success,
				};
			})
			.catch((error: AxiosError) => {
				throw error;
			});
	}

	// Proxy methods for HTTP requests
	public get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
		return this.client.get<T>(url, config);
	}

	public post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
		return this.client.post<T>(url, data, config);
	}

	public put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
		return this.client.put<T>(url, data, config);
	}

	public delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
		return this.client.delete<T>(url, config);
	}
}

// Export singleton instance
const apiClient = new ApiClient();
export default apiClient;
