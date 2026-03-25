/**
 * API Client Tests
 * 
 * Tests for the API client configuration including:
 * - Base configuration (URL, timeout, headers)
 * - Request interceptor (token injection)
 * - Response interceptor (401 handling)
 */

import * as tokenManager from "@services/auth/tokenManager";
import store from "@store/store";
import { setAuthToken,setUser } from "@store/UserSlice";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";

import apiClient from "./apiClient";

// Mock the token manager
jest.mock("@services/auth/tokenManager", () => ({
	getToken: jest.fn(),
	setToken: jest.fn(),
	clearToken: jest.fn(),
	hasToken: jest.fn(),
}));

// Mock the Redux store
jest.mock("@store/store", () => ({
	__esModule: true,
	default: {
		dispatch: jest.fn(),
		getState: jest.fn(),
	},
}));

describe("API Client Configuration", () => {
	let mock: MockAdapter;
	const mockToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test.token";

	beforeEach(() => {
		// Create a new mock adapter for each test
		mock = new MockAdapter(apiClient);
		jest.clearAllMocks();
	});

	afterEach(() => {
		mock.restore();
	});

	describe("Base Configuration", () => {
		it("should have correct base URL configured", () => {
			expect(apiClient.defaults.baseURL).toBe("/api");
		});

		it("should have correct timeout configured", () => {
			expect(apiClient.defaults.timeout).toBe(30000);
		});

		it("should have correct default Content-Type header", () => {
			expect(apiClient.defaults.headers["Content-Type"]).toBe("application/json");
		});
	});

	describe("Request Interceptor - Token Injection", () => {
		it("should inject JWT token into Authorization header when token exists", async () => {
			(tokenManager.getToken as jest.Mock).mockResolvedValue(mockToken);
			mock.onGet("/test").reply(200, { success: true });

			await apiClient.get("/test");

			const request = mock.history.get[0];
			expect(request.headers?.Authorization).toBe(`JWT ${mockToken}`);
		});

		it("should not add Authorization header when token does not exist", async () => {
			(tokenManager.getToken as jest.Mock).mockResolvedValue(null);
			mock.onGet("/test").reply(200, { success: true });

			await apiClient.get("/test");

			const request = mock.history.get[0];
			expect(request.headers?.Authorization).toBeUndefined();
		});

		it("should handle token retrieval errors gracefully", async () => {
			const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
			(tokenManager.getToken as jest.Mock).mockRejectedValue(new Error("Storage error"));
			mock.onGet("/test").reply(200, { success: true });

			await apiClient.get("/test");

			expect(consoleErrorSpy).toHaveBeenCalledWith(
				"Error in request interceptor:",
				expect.any(Error)
			);
			consoleErrorSpy.mockRestore();
		});
	});

	describe("Response Interceptor - 401 Handling", () => {
		it("should clear token and auth state on 401 Unauthorized response", async () => {
			(tokenManager.getToken as jest.Mock).mockResolvedValue(mockToken);
			(tokenManager.clearToken as jest.Mock).mockResolvedValue(undefined);
			mock.onGet("/protected").reply(401, { success: false, message: "Token Invalid" });

			try {
				await apiClient.get("/protected");
			} catch (error) {
				// Expected to throw
			}

			expect(tokenManager.clearToken).toHaveBeenCalled();
			expect(store.dispatch).toHaveBeenCalledWith(setUser(null));
			expect(store.dispatch).toHaveBeenCalledWith(setAuthToken(null));
		});

		it("should pass through successful responses without modification", async () => {
			(tokenManager.getToken as jest.Mock).mockResolvedValue(mockToken);
			const responseData = { success: true, data: { id: "123", name: "Test User" } };
			mock.onGet("/user/profile/123").reply(200, responseData);

			const response = await apiClient.get("/user/profile/123");

			expect(response.status).toBe(200);
			expect(response.data).toEqual(responseData);
		});

		it("should pass through non-401 errors without clearing auth state", async () => {
			(tokenManager.getToken as jest.Mock).mockResolvedValue(mockToken);
			mock.onGet("/test").reply(500, { success: false, message: "Server error" });

			try {
				await apiClient.get("/test");
			} catch (error) {
				// Expected to throw
			}

			expect(tokenManager.clearToken).not.toHaveBeenCalled();
			expect(store.dispatch).not.toHaveBeenCalled();
		});

		it("should handle errors during auth state clearing gracefully", async () => {
			const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
			(tokenManager.getToken as jest.Mock).mockResolvedValue(mockToken);
			(tokenManager.clearToken as jest.Mock).mockRejectedValue(new Error("Clear error"));
			mock.onGet("/protected").reply(401, { success: false, message: "Token Invalid" });

			try {
				await apiClient.get("/protected");
			} catch (error) {
				// Expected to throw
			}

			expect(consoleErrorSpy).toHaveBeenCalledWith(
				"Error clearing auth state on 401:",
				expect.any(Error)
			);
			consoleErrorSpy.mockRestore();
		});

		it("should reject promise with error after handling 401", async () => {
			(tokenManager.getToken as jest.Mock).mockResolvedValue(mockToken);
			(tokenManager.clearToken as jest.Mock).mockResolvedValue(undefined);
			mock.onGet("/protected").reply(401, { success: false, message: "Token Invalid" });

			await expect(apiClient.get("/protected")).rejects.toThrow();
		});
	});

	describe("HTTP Methods", () => {
		beforeEach(() => {
			(tokenManager.getToken as jest.Mock).mockResolvedValue(mockToken);
		});

		it("should support GET requests", async () => {
			mock.onGet("/test").reply(200, { success: true });

			const response = await apiClient.get("/test");

			expect(response.status).toBe(200);
			expect(response.data).toEqual({ success: true });
		});

		it("should support POST requests", async () => {
			const postData = { email: "test@example.com", password: "password123" };
			mock.onPost("/auth/sign-in", postData).reply(200, { success: true });

			const response = await apiClient.post("/auth/sign-in", postData);

			expect(response.status).toBe(200);
			expect(response.data).toEqual({ success: true });
		});

		it("should support PUT requests", async () => {
			const putData = { password: "newpassword123", confirmPassword: "newpassword123" };
			mock.onPut("/auth/forgot-password/token123", putData).reply(200, { success: true });

			const response = await apiClient.put("/auth/forgot-password/token123", putData);

			expect(response.status).toBe(200);
			expect(response.data).toEqual({ success: true });
		});

		it("should support DELETE requests", async () => {
			mock.onDelete("/user/123").reply(200, { success: true });

			const response = await apiClient.delete("/user/123");

			expect(response.status).toBe(200);
			expect(response.data).toEqual({ success: true });
		});
	});

	describe("Content-Type Handling", () => {
		beforeEach(() => {
			(tokenManager.getToken as jest.Mock).mockResolvedValue(mockToken);
		});

		it("should use default application/json Content-Type", async () => {
			mock.onPost("/test").reply(200, { success: true });

			await apiClient.post("/test", { data: "test" });

			const request = mock.history.post[0];
			expect(request.headers?.["Content-Type"]).toBe("application/json");
		});

		it("should allow Content-Type override for multipart/form-data", async () => {
			mock.onPost("/auth/sign-up").reply(200, { success: true });

			const formData = new FormData();
			formData.append("name", "Test User");

			await apiClient.post("/auth/sign-up", formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});

			const request = mock.history.post[0];
			expect(request.headers?.["Content-Type"]).toBe("multipart/form-data");
		});
	});
});
