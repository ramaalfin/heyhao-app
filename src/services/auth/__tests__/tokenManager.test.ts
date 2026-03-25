/**
 * Token Manager Unit Tests
 * 
 * Tests token retrieval, storage, clearing, and refresh logic
 */

import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import store from '@store/store';
import {
    clearAuth,
    selectAuthToken,
    selectRefreshToken,
    setAuthToken,
    setRefreshToken,
} from '@store/UserSlice';

import { tokenManager } from '../tokenManager';
import type { TokenResponse } from '../../api/auth/types';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => {
    let store: { [key: string]: string } = {};

    return {
        setItem: jest.fn((key: string, value: string) => {
            store[key] = value;
            return Promise.resolve();
        }),
        getItem: jest.fn((key: string) => {
            return Promise.resolve(store[key] || null);
        }),
        removeItem: jest.fn((key: string) => {
            delete store[key];
            return Promise.resolve();
        }),
        clear: jest.fn(() => {
            store = {};
            return Promise.resolve();
        }),
        getAllKeys: jest.fn(() => {
            return Promise.resolve(Object.keys(store));
        }),
        multiGet: jest.fn((keys: string[]) => {
            return Promise.resolve(keys.map(key => [key, store[key] || null]));
        }),
        multiSet: jest.fn((keyValuePairs: [string, string][]) => {
            keyValuePairs.forEach(([key, value]) => {
                store[key] = value;
            });
            return Promise.resolve();
        }),
        multiRemove: jest.fn((keys: string[]) => {
            keys.forEach(key => {
                delete store[key];
            });
            return Promise.resolve();
        }),
    };
});

// Mock axios
const mockAxios = new MockAdapter(axios);

describe('TokenManager', () => {
    beforeEach(() => {
        // Clear Redux store before each test
        store.dispatch(clearAuth());
        mockAxios.reset();
    });

    afterEach(() => {
        mockAxios.reset();
    });

    describe('getAccessToken', () => {
        it('should return null when no token is stored', () => {
            const token = tokenManager.getAccessToken();
            expect(token).toBeNull();
        });

        it('should retrieve access token from Redux store', () => {
            const testToken = 'test-access-token';
            store.dispatch(setAuthToken(testToken));

            const token = tokenManager.getAccessToken();
            expect(token).toBe(testToken);
        });

        it('should return updated token after token change', () => {
            store.dispatch(setAuthToken('old-token'));
            store.dispatch(setAuthToken('new-token'));

            const token = tokenManager.getAccessToken();
            expect(token).toBe('new-token');
        });
    });

    describe('getRefreshToken', () => {
        it('should return null when no refresh token is stored', () => {
            const token = tokenManager.getRefreshToken();
            expect(token).toBeNull();
        });

        it('should retrieve refresh token from Redux store', () => {
            const testToken = 'test-refresh-token';
            store.dispatch(setRefreshToken(testToken));

            const token = tokenManager.getRefreshToken();
            expect(token).toBe(testToken);
        });

        it('should return updated refresh token after token change', () => {
            store.dispatch(setRefreshToken('old-refresh-token'));
            store.dispatch(setRefreshToken('new-refresh-token'));

            const token = tokenManager.getRefreshToken();
            expect(token).toBe('new-refresh-token');
        });
    });

    describe('setTokens', () => {
        it('should dispatch setAuthToken action', () => {
            const accessToken = 'new-access-token';
            const refreshToken = 'new-refresh-token';

            tokenManager.setTokens(accessToken, refreshToken);

            const state = store.getState();
            expect(selectAuthToken(state)).toBe(accessToken);
        });

        it('should dispatch setRefreshToken action', () => {
            const accessToken = 'new-access-token';
            const refreshToken = 'new-refresh-token';

            tokenManager.setTokens(accessToken, refreshToken);

            const state = store.getState();
            expect(selectRefreshToken(state)).toBe(refreshToken);
        });

        it('should update both tokens in Redux store', () => {
            const accessToken = 'access-123';
            const refreshToken = 'refresh-456';

            tokenManager.setTokens(accessToken, refreshToken);

            const state = store.getState();
            expect(selectAuthToken(state)).toBe(accessToken);
            expect(selectRefreshToken(state)).toBe(refreshToken);
        });

        it('should replace existing tokens', () => {
            store.dispatch(setAuthToken('old-access'));
            store.dispatch(setRefreshToken('old-refresh'));

            tokenManager.setTokens('new-access', 'new-refresh');

            const state = store.getState();
            expect(selectAuthToken(state)).toBe('new-access');
            expect(selectRefreshToken(state)).toBe('new-refresh');
        });
    });

    describe('clearTokens', () => {
        it('should clear all tokens from Redux store', () => {
            store.dispatch(setAuthToken('access-token'));
            store.dispatch(setRefreshToken('refresh-token'));

            tokenManager.clearTokens();

            const state = store.getState();
            expect(selectAuthToken(state)).toBeNull();
            expect(selectRefreshToken(state)).toBeNull();
        });

        it('should dispatch clearAuth action', () => {
            store.dispatch(setAuthToken('access-token'));
            store.dispatch(setRefreshToken('refresh-token'));

            tokenManager.clearTokens();

            const state = store.getState();
            expect(state.UserSlice.isAuthenticated).toBe(false);
        });

        it('should work when no tokens are stored', () => {
            expect(() => tokenManager.clearTokens()).not.toThrow();

            const state = store.getState();
            expect(selectAuthToken(state)).toBeNull();
            expect(selectRefreshToken(state)).toBeNull();
        });
    });

    describe('isRefreshingToken', () => {
        it('should return false initially', () => {
            expect(tokenManager.isRefreshingToken()).toBe(false);
        });

        it('should return true during token refresh', async () => {
            store.dispatch(setRefreshToken('refresh-token'));

            const baseURL = process.env.BASE_URL_API || 'http://localhost:3000/api/v1';
            mockAxios.onPost(`${baseURL}/auth/refresh-token`).reply(() => {
                // Check isRefreshing during the request
                expect(tokenManager.isRefreshingToken()).toBe(true);
                return [200, {
                    data: {
                        token: 'new-access-token',
                        refreshToken: 'new-refresh-token',
                    },
                }];
            });

            await tokenManager.refreshAccessToken();
        });

        it('should return false after token refresh completes', async () => {
            store.dispatch(setRefreshToken('refresh-token'));

            const baseURL = process.env.BASE_URL_API || 'http://localhost:3000/api/v1';
            mockAxios.onPost(`${baseURL}/auth/refresh-token`).reply(200, {
                data: {
                    token: 'new-access-token',
                    refreshToken: 'new-refresh-token',
                },
            });

            await tokenManager.refreshAccessToken();

            expect(tokenManager.isRefreshingToken()).toBe(false);
        });
    });

    describe('refreshAccessToken', () => {
        const baseURL = process.env.BASE_URL_API || 'http://localhost:3000/api/v1';

        it('should throw error when no refresh token is available', async () => {
            await expect(tokenManager.refreshAccessToken()).rejects.toThrow(
                'No refresh token available'
            );
        });

        it('should call refresh token endpoint with refresh token', async () => {
            const refreshToken = 'test-refresh-token';
            store.dispatch(setRefreshToken(refreshToken));

            mockAxios.onPost(`${baseURL}/auth/refresh-token`).reply((config) => {
                const data = JSON.parse(config.data);
                expect(data.refreshToken).toBe(refreshToken);
                return [200, {
                    data: {
                        token: 'new-access-token',
                        refreshToken: 'new-refresh-token',
                    },
                }];
            });

            await tokenManager.refreshAccessToken();
        });

        it('should update tokens in Redux store on success', async () => {
            store.dispatch(setRefreshToken('old-refresh-token'));

            const newAccessToken = 'new-access-token';
            const newRefreshToken = 'new-refresh-token';

            mockAxios.onPost(`${baseURL}/auth/refresh-token`).reply(200, {
                data: {
                    token: newAccessToken,
                    refreshToken: newRefreshToken,
                },
            });

            await tokenManager.refreshAccessToken();

            const state = store.getState();
            expect(selectAuthToken(state)).toBe(newAccessToken);
            expect(selectRefreshToken(state)).toBe(newRefreshToken);
        });

        it('should return new access token on success', async () => {
            store.dispatch(setRefreshToken('refresh-token'));

            const newAccessToken = 'new-access-token';

            mockAxios.onPost(`${baseURL}/auth/refresh-token`).reply(200, {
                data: {
                    token: newAccessToken,
                    refreshToken: 'new-refresh-token',
                },
            });

            const token = await tokenManager.refreshAccessToken();

            expect(token).toBe(newAccessToken);
        });

        it('should clear tokens on refresh failure', async () => {
            store.dispatch(setAuthToken('access-token'));
            store.dispatch(setRefreshToken('refresh-token'));

            mockAxios.onPost(`${baseURL}/auth/refresh-token`).reply(401, {
                success: false,
                message: 'Invalid refresh token',
            });

            await expect(tokenManager.refreshAccessToken()).rejects.toThrow();

            const state = store.getState();
            expect(selectAuthToken(state)).toBeNull();
            expect(selectRefreshToken(state)).toBeNull();
        });

        it('should throw error on refresh failure', async () => {
            store.dispatch(setRefreshToken('invalid-token'));

            mockAxios.onPost(`${baseURL}/auth/refresh-token`).reply(401, {
                success: false,
                message: 'Invalid refresh token',
            });

            await expect(tokenManager.refreshAccessToken()).rejects.toThrow();
        });
    });

    describe('request queue during refresh', () => {
        const baseURL = process.env.BASE_URL_API || 'http://localhost:3000/api/v1';

        it('should queue subsequent refresh requests while one is in progress', async () => {
            store.dispatch(setRefreshToken('refresh-token'));

            let requestCount = 0;
            mockAxios.onPost(`${baseURL}/auth/refresh-token`).reply(() => {
                requestCount++;
                return new Promise((resolve) => {
                    setTimeout(() => {
                        resolve([200, {
                            data: {
                                token: 'new-access-token',
                                refreshToken: 'new-refresh-token',
                            },
                        }]);
                    }, 100);
                });
            });

            // Start multiple refresh requests simultaneously
            const promise1 = tokenManager.refreshAccessToken();
            const promise2 = tokenManager.refreshAccessToken();
            const promise3 = tokenManager.refreshAccessToken();

            const [token1, token2, token3] = await Promise.all([promise1, promise2, promise3]);

            // All should receive the same token
            expect(token1).toBe('new-access-token');
            expect(token2).toBe('new-access-token');
            expect(token3).toBe('new-access-token');

            // Only one request should have been made
            expect(requestCount).toBe(1);
        });

        it('should resolve all queued requests with new token', async () => {
            store.dispatch(setRefreshToken('refresh-token'));

            mockAxios.onPost(`${baseURL}/auth/refresh-token`).reply(() => {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        resolve([200, {
                            data: {
                                token: 'new-access-token',
                                refreshToken: 'new-refresh-token',
                            },
                        }]);
                    }, 50);
                });
            });

            const promises = [
                tokenManager.refreshAccessToken(),
                tokenManager.refreshAccessToken(),
                tokenManager.refreshAccessToken(),
            ];

            const tokens = await Promise.all(promises);

            tokens.forEach(token => {
                expect(token).toBe('new-access-token');
            });
        });

        it('should reject all queued requests on refresh failure', async () => {
            store.dispatch(setRefreshToken('invalid-token'));

            mockAxios.onPost(`${baseURL}/auth/refresh-token`).reply(() => {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        resolve([401, {
                            success: false,
                            message: 'Invalid refresh token',
                        }]);
                    }, 50);
                });
            });

            const promises = [
                tokenManager.refreshAccessToken(),
                tokenManager.refreshAccessToken(),
                tokenManager.refreshAccessToken(),
            ];

            await expect(Promise.all(promises)).rejects.toThrow();
        });

        it('should allow new refresh after previous one completes', async () => {
            store.dispatch(setRefreshToken('refresh-token-1'));

            mockAxios.onPost(`${baseURL}/auth/refresh-token`).replyOnce(200, {
                data: {
                    token: 'access-token-1',
                    refreshToken: 'refresh-token-2',
                },
            });

            const token1 = await tokenManager.refreshAccessToken();
            expect(token1).toBe('access-token-1');

            // Second refresh with new token
            mockAxios.onPost(`${baseURL}/auth/refresh-token`).replyOnce(200, {
                data: {
                    token: 'access-token-2',
                    refreshToken: 'refresh-token-3',
                },
            });

            const token2 = await tokenManager.refreshAccessToken();
            expect(token2).toBe('access-token-2');
        });
    });

    describe('subscribeTokenRefresh', () => {
        const baseURL = process.env.BASE_URL_API || 'http://localhost:3000/api/v1';

        it('should notify subscribers when refresh completes', async () => {
            store.dispatch(setRefreshToken('refresh-token'));

            const subscriber = jest.fn();
            tokenManager.subscribeTokenRefresh(subscriber);

            mockAxios.onPost(`${baseURL}/auth/refresh-token`).reply(200, {
                data: {
                    token: 'new-access-token',
                    refreshToken: 'new-refresh-token',
                },
            });

            // Start refresh in background
            const refreshPromise = tokenManager.refreshAccessToken();

            await refreshPromise;

            expect(subscriber).toHaveBeenCalledWith('new-access-token');
        });

        it('should clear subscribers after notification', async () => {
            store.dispatch(setRefreshToken('refresh-token'));

            const subscriber = jest.fn();
            tokenManager.subscribeTokenRefresh(subscriber);

            mockAxios.onPost(`${baseURL}/auth/refresh-token`).reply(200, {
                data: {
                    token: 'new-access-token',
                    refreshToken: 'new-refresh-token',
                },
            });

            await tokenManager.refreshAccessToken();

            // Second refresh should not notify the same subscriber
            subscriber.mockClear();

            mockAxios.onPost(`${baseURL}/auth/refresh-token`).reply(200, {
                data: {
                    token: 'another-token',
                    refreshToken: 'another-refresh-token',
                },
            });

            await tokenManager.refreshAccessToken();

            expect(subscriber).not.toHaveBeenCalled();
        });
    });
});
