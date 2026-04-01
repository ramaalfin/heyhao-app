import React, {useEffect,useState} from "react";
import {ActivityIndicator, View} from "react-native";

import LandingScreen from "@features/auth/screens/LandingScreen";
import {NavigationContainer} from "@react-navigation/native";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {sessionManager} from "@services/auth/sessionManager";
import {useAppSelector} from "@store/hooks";
import {selectIsAuthenticated} from "@store/UserSlice";

import {
	NAVIGATOR_LANDING,
	NAVIGATOR_SIGNED_IN_STACK,
	NAVIGATOR_SIGNED_OUT_STACK,
} from "@utils/screens";

import SignedInStack from "./stacks/SignedInStack";
import SignedOutStack from "./stacks/SignedOutStack";

const Stack = createNativeStackNavigator();

const NAVIGATION_OPTIONS = {
	headerShown: false,
};



export type NavigationParams = {
	[NAVIGATOR_LANDING]: undefined;
	[NAVIGATOR_SIGNED_IN_STACK]: undefined;
	[NAVIGATOR_SIGNED_OUT_STACK]: undefined;
};

const Navigation = () => {
	const isAuthenticated = useAppSelector(selectIsAuthenticated);
	const [isReady, setIsReady] = useState(false);

	useEffect(() => {
		// Check authentication status on app start
		const checkAuth = async () => {
			await sessionManager.checkAuthStatus();
			setIsReady(true);
		};

		checkAuth();
	}, []);

	// Show splash screen while checking auth status
	if (!isReady) {
		return (
			<View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
				<ActivityIndicator size="large" />
			</View>
		);
	}

	return (
		<NavigationContainer>
			<Stack.Navigator screenOptions={{headerShown: false}}>
				{isAuthenticated ? (
					<>
						<Stack.Screen
							name={NAVIGATOR_SIGNED_IN_STACK}
							component={SignedInStack}
							options={NAVIGATION_OPTIONS}
						/>
					</>
				) : (
					<>
						<Stack.Screen
							name={NAVIGATOR_LANDING}
							component={LandingScreen}
							options={NAVIGATION_OPTIONS}
						/>
						<Stack.Screen
							name={NAVIGATOR_SIGNED_OUT_STACK}
							component={SignedOutStack}
							options={NAVIGATION_OPTIONS}
						/>
					</>
				)}
			</Stack.Navigator>
		</NavigationContainer>
	);
};

export default Navigation;
