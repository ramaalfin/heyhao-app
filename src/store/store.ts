import AsyncStorage from "@react-native-async-storage/async-storage";
import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { persistReducer, persistStore } from "redux-persist";

import UserSlice from "./UserSlice";

const userPersistConfig = {
	key: "UserSlice",
	storage: AsyncStorage,
	blacklist: ["isLoading", "error"],
};

const reducers = combineReducers({
	UserSlice: persistReducer(userPersistConfig, UserSlice),
});

const persistConfig = {
	key: "root",
	storage: AsyncStorage,
};

const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
	reducer: persistedReducer,
	middleware: getDefaultMiddleware => getDefaultMiddleware({
		serializableCheck: {
			ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
		},
	}).concat(),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store);

export default store;

