import React from "react";
import {useEffect} from "react";
import {Provider} from "react-redux";

import store, {persistor} from "@store/store";
import {PersistGate} from "redux-persist/integration/react";

import useLocalize from "@hooks/useLocalize";
import Navigation from "@navigation/Navigation";

import "react-native-gesture-handler";

const App = () => {
	const {setI18nConfig} = useLocalize();
	useEffect(() => {
		setI18nConfig();
	}, [setI18nConfig]);

	return (
		<Provider store={store}>
			<PersistGate persistor={persistor}>
				<Navigation />
			</PersistGate>
		</Provider>
	);
};

export default App;
