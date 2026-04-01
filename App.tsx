import React from "react";
import {useEffect} from "react";
import {Provider} from "react-redux";

import store, {persistor} from "@store/store";
import {PersistGate} from "redux-persist/integration/react";

import Navigation from "@navigation/Navigation";

import "react-native-gesture-handler";

const App = () => {
	return (
		<Provider store={store}>
			<PersistGate persistor={persistor}>
				<Navigation />
			</PersistGate>
		</Provider>
	);
};

export default App;
