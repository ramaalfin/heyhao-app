import React from "react";
import Icon from "react-native-vector-icons/MaterialIcons";

import ChatScreen from "@features/chat/screens/ChatScreen";
import DiscoverScreen from "@features/discover/screens/DiscoverScreen";
import HomeScreen from "@features/home/screens/HomeScreen";
import RevenueScreen from "@features/revenue/screens/RevenueScreen";
import SettingsScreen from "@features/settings/screens/SettingsScreen";
import AllGroupsScreen from "@features/groups/screens/AllGroupsScreen";
import GroupDetailScreen from "@features/groups/screens/GroupDetailScreen";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {createNativeStackNavigator} from "@react-navigation/native-stack";

import {HOME_SCREENS} from "@utils/screens";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TAB_SCREEN_OPTIONS = {
	headerShown: false,
};

interface IconProps {
	color: string;
	size: number;
}

const HomeIcon = ({color, size}: IconProps) => (
	<Icon name="home" color={color} size={size} />
);

const DiscoverIcon = ({color, size}: IconProps) => (
	<Icon name="explore" color={color} size={size} />
);

const ChatIcon = ({color, size}: IconProps) => (
	<Icon name="chat" color={color} size={size} />
);

const SettingsIcon = ({color, size}: IconProps) => (
	<Icon name="settings" color={color} size={size} />
);

export type HomeStackParams = {
	[HOME_SCREENS.MAIN_SCREEN]: undefined;
	[HOME_SCREENS.DISCOVER_SCREEN]: undefined;
	[HOME_SCREENS.CHAT_SCREEN]: undefined;
	[HOME_SCREENS.REVENUE_SCREEN]: undefined;
	[HOME_SCREENS.SETTINGS_SCREEN]: undefined;
	[HOME_SCREENS.PROFILE_SCREEN]: undefined;
	[HOME_SCREENS.ALL_GROUPS_SCREEN]: undefined;
	[HOME_SCREENS.GROUP_DETAIL_SCREEN]: { groupId: string };
};

const TabNavigator = () => {
	return (
		<Tab.Navigator 
			screenOptions={{
				...TAB_SCREEN_OPTIONS,
				tabBarActiveTintColor: "#165dff",
				tabBarInactiveTintColor: "#6a7686",
				tabBarStyle: {
					borderTopWidth: 1,
					borderTopColor: "#f3f4f3",
					height: 65,
					paddingBottom: 12,
					paddingTop: 8,
				},
				tabBarLabelStyle: {
					fontSize: 11,
					fontWeight: "600",
					marginTop: 2,
				},
			}}>
			<Tab.Screen
				name={HOME_SCREENS.MAIN_SCREEN}
				component={HomeScreen}
				options={{
					tabBarLabel: "Home",
					tabBarIcon: HomeIcon,
				}}
			/>
			<Tab.Screen
				name={HOME_SCREENS.DISCOVER_SCREEN}
				component={DiscoverScreen}
				options={{
					tabBarLabel: "Discover",
					tabBarIcon: DiscoverIcon,
				}}
			/>
			<Tab.Screen
				name={HOME_SCREENS.CHAT_SCREEN}
				component={ChatScreen}
				options={{
					tabBarLabel: "Chat",
					tabBarIcon: ChatIcon,
				}}
			/>
			<Tab.Screen
				name={HOME_SCREENS.SETTINGS_SCREEN}
				component={SettingsScreen}
				options={{
					tabBarLabel: "Settings",
					tabBarIcon: SettingsIcon,
				}}
			/>
		</Tab.Navigator>
	);
};

const HomeStack = () => {
	return (
		<Stack.Navigator screenOptions={{headerShown: false}}>
			<Stack.Screen name="TabNavigator" component={TabNavigator} />
			<Stack.Screen name={HOME_SCREENS.ALL_GROUPS_SCREEN} component={AllGroupsScreen} />
			<Stack.Screen name={HOME_SCREENS.GROUP_DETAIL_SCREEN} component={GroupDetailScreen} />
		</Stack.Navigator>
	);
};

export default HomeStack;
