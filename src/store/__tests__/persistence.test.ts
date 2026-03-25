import AsyncStorage from "@react-native-async-storage/async-storage";
import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";

import UserSlice, {
    setUser,
    setAuthToken,
    setRefreshToken,
    clearAuth,
    User,
} from "../UserSlice";

// Mock AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () => {
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

/**
 * Test suite for Redux Persist configuration
 * Validates Requirements 8.3, 8.4, 8.5, 8.6
 */
describe("Redux Persist Configuration", () => {
    let store: any;
    let persistor: any;

    const mockUser: User = {
        id: "test-user-id",
        name: "Test User",
        email: "test@example.com",
        photo: "test-photo.jpg",
    };

    const mockAuthToken = "mock-auth-token-12345";
    const mockRefreshToken = "mock-refresh-token-67890";

    const createTestStore = () => {
        const reducers = combineReducers({
            UserSlice,
        });

        const persistConfig = {
            key: "root",
            storage: AsyncStorage,
            whitelist: ["UserSlice"],
        };

        const persistedReducer = persistReducer(persistConfig, reducers);

        const testStore = configureStore({
            reducer: persistedReducer,
            middleware: (getDefaultMiddleware) =>
                getDefaultMiddleware({
                    serializableCheck: {
                        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
                    },
                }),
        });

        const testPersistor = persistStore(testStore);

        return { testStore, testPersistor };
    };

    beforeEach(async () => {
        // Clear AsyncStorage before each test
        await AsyncStorage.clear();

        // Create a fresh store with persistence for each test
        const result = createTestStore();
        store = result.testStore;
        persistor = result.testPersistor;

        // Wait for rehydration to complete
        await new Promise<void>((resolve) => {
            const unsubscribe = persistor.subscribe(() => {
                const { bootstrapped } = persistor.getState();
                if (bootstrapped) {
                    unsubscribe();
                    resolve();
                }
            });
        });
    });

    afterEach(async () => {
        // Clean up
        if (persistor) {
            persistor.pause();
            await persistor.flush();
            await persistor.purge();
        }
        await AsyncStorage.clear();
        jest.clearAllMocks();
    });

    /**
     * Requirement 8.3: Tokens are persisted to AsyncStorage
     */
    describe("Token Persistence", () => {
        it("should persist access token to AsyncStorage", async () => {
            // Dispatch action to set auth token
            store.dispatch(setAuthToken(mockAuthToken));

            // Flush persistence to ensure data is written
            await persistor.flush();

            // Verify setItem was called
            expect(AsyncStorage.setItem).toHaveBeenCalled();

            // Verify token is in AsyncStorage
            const persistedData = await AsyncStorage.getItem("persist:root");
            expect(persistedData).toBeTruthy();

            const parsedData = JSON.parse(persistedData!);
            const userSliceData = JSON.parse(parsedData.UserSlice);

            expect(userSliceData.authToken).toBe(mockAuthToken);
        });

        it("should persist refresh token to AsyncStorage", async () => {
            // Dispatch action to set refresh token
            store.dispatch(setRefreshToken(mockRefreshToken));

            // Flush persistence to ensure data is written
            await persistor.flush();

            // Verify token is in AsyncStorage
            const persistedData = await AsyncStorage.getItem("persist:root");
            expect(persistedData).toBeTruthy();

            const parsedData = JSON.parse(persistedData!);
            const userSliceData = JSON.parse(parsedData.UserSlice);

            expect(userSliceData.refreshToken).toBe(mockRefreshToken);
        });

        it("should persist both tokens together", async () => {
            // Dispatch actions to set both tokens
            store.dispatch(setAuthToken(mockAuthToken));
            store.dispatch(setRefreshToken(mockRefreshToken));

            // Flush persistence to ensure data is written
            await persistor.flush();

            // Verify both tokens are in AsyncStorage
            const persistedData = await AsyncStorage.getItem("persist:root");
            expect(persistedData).toBeTruthy();

            const parsedData = JSON.parse(persistedData!);
            const userSliceData = JSON.parse(parsedData.UserSlice);

            expect(userSliceData.authToken).toBe(mockAuthToken);
            expect(userSliceData.refreshToken).toBe(mockRefreshToken);
        });
    });

    /**
     * Requirement 8.4: User data is persisted to AsyncStorage
     */
    describe("User Data Persistence", () => {
        it("should persist user data to AsyncStorage", async () => {
            // Dispatch action to set user
            store.dispatch(setUser(mockUser));

            // Flush persistence to ensure data is written
            await persistor.flush();

            // Verify user data is in AsyncStorage
            const persistedData = await AsyncStorage.getItem("persist:root");
            expect(persistedData).toBeTruthy();

            const parsedData = JSON.parse(persistedData!);
            const userSliceData = JSON.parse(parsedData.UserSlice);

            expect(userSliceData.user).toEqual(mockUser);
            expect(userSliceData.isAuthenticated).toBe(true);
        });

        it("should persist complete authentication state", async () => {
            // Dispatch actions to set complete auth state
            store.dispatch(setUser(mockUser));
            store.dispatch(setAuthToken(mockAuthToken));
            store.dispatch(setRefreshToken(mockRefreshToken));

            // Flush persistence to ensure data is written
            await persistor.flush();

            // Verify complete state is in AsyncStorage
            const persistedData = await AsyncStorage.getItem("persist:root");
            expect(persistedData).toBeTruthy();

            const parsedData = JSON.parse(persistedData!);
            const userSliceData = JSON.parse(parsedData.UserSlice);

            expect(userSliceData.user).toEqual(mockUser);
            expect(userSliceData.authToken).toBe(mockAuthToken);
            expect(userSliceData.refreshToken).toBe(mockRefreshToken);
            expect(userSliceData.isAuthenticated).toBe(true);
        });
    });

    /**
     * Requirements 8.5, 8.6: Rehydration on app restart
     */
    describe("State Rehydration", () => {
        it("should rehydrate tokens from AsyncStorage on app restart", async () => {
            // First session: Set tokens
            store.dispatch(setAuthToken(mockAuthToken));
            store.dispatch(setRefreshToken(mockRefreshToken));
            await persistor.flush();

            // Pause and clean up first persistor
            persistor.pause();

            // Simulate app restart by creating a new store
            const { testStore: newStore, testPersistor: newPersistor } = createTestStore();

            // Wait for rehydration to complete
            await new Promise<void>((resolve) => {
                const unsubscribe = newPersistor.subscribe(() => {
                    const { bootstrapped } = newPersistor.getState();
                    if (bootstrapped) {
                        unsubscribe();
                        resolve();
                    }
                });
            });

            // Verify tokens are rehydrated
            const state = newStore.getState();
            expect(state.UserSlice.authToken).toBe(mockAuthToken);
            expect(state.UserSlice.refreshToken).toBe(mockRefreshToken);

            // Clean up
            newPersistor.pause();
            await newPersistor.purge();
        });

        it("should rehydrate user data from AsyncStorage on app restart", async () => {
            // First session: Set user data
            store.dispatch(setUser(mockUser));
            await persistor.flush();

            // Pause and clean up first persistor
            persistor.pause();

            // Simulate app restart by creating a new store
            const { testStore: newStore, testPersistor: newPersistor } = createTestStore();

            // Wait for rehydration to complete
            await new Promise<void>((resolve) => {
                const unsubscribe = newPersistor.subscribe(() => {
                    const { bootstrapped } = newPersistor.getState();
                    if (bootstrapped) {
                        unsubscribe();
                        resolve();
                    }
                });
            });

            // Verify user data is rehydrated
            const state = newStore.getState();
            expect(state.UserSlice.user).toEqual(mockUser);
            expect(state.UserSlice.isAuthenticated).toBe(true);

            // Clean up
            newPersistor.pause();
            await newPersistor.purge();
        });

        it("should rehydrate complete authentication state on app restart", async () => {
            // First session: Set complete auth state
            store.dispatch(setUser(mockUser));
            store.dispatch(setAuthToken(mockAuthToken));
            store.dispatch(setRefreshToken(mockRefreshToken));
            await persistor.flush();

            // Pause and clean up first persistor
            persistor.pause();

            // Simulate app restart by creating a new store
            const { testStore: newStore, testPersistor: newPersistor } = createTestStore();

            // Wait for rehydration to complete
            await new Promise<void>((resolve) => {
                const unsubscribe = newPersistor.subscribe(() => {
                    const { bootstrapped } = newPersistor.getState();
                    if (bootstrapped) {
                        unsubscribe();
                        resolve();
                    }
                });
            });

            // Verify complete state is rehydrated
            const state = newStore.getState();
            expect(state.UserSlice.user).toEqual(mockUser);
            expect(state.UserSlice.authToken).toBe(mockAuthToken);
            expect(state.UserSlice.refreshToken).toBe(mockRefreshToken);
            expect(state.UserSlice.isAuthenticated).toBe(true);

            // Clean up
            newPersistor.pause();
            await newPersistor.purge();
        });

        it("should start with empty state when no persisted data exists", async () => {
            // Ensure AsyncStorage is empty
            await AsyncStorage.clear();

            // Create a new store
            const { testStore: newStore, testPersistor: newPersistor } = createTestStore();

            // Wait for rehydration to complete
            await new Promise<void>((resolve) => {
                const unsubscribe = newPersistor.subscribe(() => {
                    const { bootstrapped } = newPersistor.getState();
                    if (bootstrapped) {
                        unsubscribe();
                        resolve();
                    }
                });
            });

            // Verify state is empty
            const state = newStore.getState();
            expect(state.UserSlice.user).toBeNull();
            expect(state.UserSlice.authToken).toBeNull();
            expect(state.UserSlice.refreshToken).toBeNull();
            expect(state.UserSlice.isAuthenticated).toBe(false);

            // Clean up
            newPersistor.pause();
            await newPersistor.purge();
        });
    });

    /**
     * Verify clearAuth clears persisted data
     */
    describe("Clear Authentication", () => {
        it("should clear persisted data when clearAuth is dispatched", async () => {
            // Set complete auth state
            store.dispatch(setUser(mockUser));
            store.dispatch(setAuthToken(mockAuthToken));
            store.dispatch(setRefreshToken(mockRefreshToken));
            await persistor.flush();

            // Verify data is persisted
            let persistedData = await AsyncStorage.getItem("persist:root");
            expect(persistedData).toBeTruthy();

            // Clear auth
            store.dispatch(clearAuth());
            await persistor.flush();

            // Verify data is cleared in AsyncStorage
            persistedData = await AsyncStorage.getItem("persist:root");
            const parsedData = JSON.parse(persistedData!);
            const userSliceData = JSON.parse(parsedData.UserSlice);

            expect(userSliceData.user).toBeNull();
            expect(userSliceData.authToken).toBeNull();
            expect(userSliceData.refreshToken).toBeNull();
            expect(userSliceData.isAuthenticated).toBe(false);
        });
    });

    /**
     * Verify whitelist configuration
     */
    describe("Persist Configuration", () => {
        it("should only persist UserSlice as specified in whitelist", async () => {
            // Set auth state
            store.dispatch(setUser(mockUser));
            store.dispatch(setAuthToken(mockAuthToken));
            await persistor.flush();

            // Verify persisted data structure
            const persistedData = await AsyncStorage.getItem("persist:root");
            expect(persistedData).toBeTruthy();

            const parsedData = JSON.parse(persistedData!);

            // Should have UserSlice
            expect(parsedData.UserSlice).toBeDefined();

            // Verify UserSlice data
            const userSliceData = JSON.parse(parsedData.UserSlice);
            expect(userSliceData.user).toEqual(mockUser);
            expect(userSliceData.authToken).toBe(mockAuthToken);
        });

        it("should verify AsyncStorage is used as storage engine", async () => {
            // Set some data
            store.dispatch(setAuthToken(mockAuthToken));
            await persistor.flush();

            // Verify AsyncStorage methods were called
            expect(AsyncStorage.setItem).toHaveBeenCalled();
            expect(AsyncStorage.getItem).toHaveBeenCalled();
        });
    });
});
