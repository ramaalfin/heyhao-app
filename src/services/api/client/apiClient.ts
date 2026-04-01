/* eslint-disable @typescript-eslint/no-explicit-any */
import type { AxiosInstance, AxiosRequestConfig } from "axios";
import axios from "axios";

import AuthApi from "../auth/authApi";
import GroupApi from "../group/groupApi";
import TransactionApi from "../transaction/transactionApi";
import { setupAuthInterceptors } from "../interceptors/authInterceptor";

const BASE_URL = (process.env as any).BASE_URL_API || "http://localhost:3000/api/v1";

/**
 * ApiClient — wrapper Axios yang mengelompokkan semua API berdasarkan domain.
 *
 * Digunakan via singleton `apiClient` (lihat export di bawah).
 * Jangan buat instance baru di setiap hook/komponen.
 */
export class ApiClient {
	public client: AxiosInstance;
	public auth: AuthApi;
	public group: GroupApi;
	public transaction: TransactionApi;

	constructor(config: AxiosRequestConfig = {}) {
		this.client = axios.create({
			baseURL: BASE_URL,
			timeout: 10000,
			headers: {
				"content-type": "application/json",
				...config.headers,
			},
			...config,
		});

		// Setup interceptor token otomatis (inject + refresh)
		setupAuthInterceptors(this.client);

		this.auth = new AuthApi(this.client);
		this.group = new GroupApi(this.client);
		this.transaction = new TransactionApi(this.client);
	}

	/** Set token JWT manual (biasanya setelah login) */
	setBearerToken(token: string) {
		this.client.defaults.headers.common.Authorization = `JWT ${token}`;
	}
}

// Singleton — pakai ini di seluruh app, jangan buat instance baru
const apiClient = new ApiClient();
export default apiClient;
