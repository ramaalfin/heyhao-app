import React from "react";

import ActiveChatScreen from "@features/chat/screens/ActiveChatScreen";
import SuccessPaymentScreen from "@features/payment/screens/SuccessPaymentScreen";
import ProfileScreen from "@features/profile/screens/ProfileScreen";
import PayoutScreen from "@features/revenue/screens/PayoutScreen";
import RevenueScreen from "@features/revenue/screens/RevenueScreen";
import WithdrawScreen from "@features/revenue/screens/WithdrawScreen";
import AccountSettingsScreen from "@features/settings/screens/AccountSettingsScreen";
import ManageGroupScreen from "@features/settings/screens/ManageGroupScreen";
import MyGroupsScreen from "@features/settings/screens/MyGroupsScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import {
	DISCOVER_SCREENS,
	NAVIGATOR_DRAWER_STACK,
	NAVIGATOR_HOME_STACK,
	PAYMENT_SCREENS,
	REVENUE_SCREENS,
	SETTINGS_SCREENS,
} from "@utils/screens";

import DrawerStack from "./DrawerStack";

const Stack = createNativeStackNavigator();

const NAVIGATION_OPTIONS = {
	headerShown: false,
};

export type SignedInStackParams = {
	[NAVIGATOR_HOME_STACK]: undefined;
	[DISCOVER_SCREENS.DETAIL_GROUP]: { id: string };
	[REVENUE_SCREENS.WITHDRAW]: undefined;
	[REVENUE_SCREENS.PAYOUTS]: undefined;
	[SETTINGS_SCREENS.ACCOUNT]: undefined;
	[SETTINGS_SCREENS.MY_GROUPS]: undefined;
	[SETTINGS_SCREENS.MANAGE_GROUP]: { groupId?: string; initialData?: any } | undefined;
	[PAYMENT_SCREENS.SUCCESS]: { amount: string; txId: string };
	PROFILE_SCREEN: undefined;
	REVENUE_SCREEN: undefined;
	ACCOUNT_SETTINGS: undefined;
	MY_GROUPS: undefined;
	CREATE_GROUP: undefined;
	ACTIVE_CHAT: { chatId: string };
};

const SignedInStack = () => {
	return (
		<Stack.Navigator screenOptions={NAVIGATION_OPTIONS}>
			<Stack.Screen name={NAVIGATOR_DRAWER_STACK} component={DrawerStack} />
			<Stack.Screen name={REVENUE_SCREENS.WITHDRAW} component={WithdrawScreen} />
			<Stack.Screen name={REVENUE_SCREENS.PAYOUTS} component={PayoutScreen} />
			<Stack.Screen name={SETTINGS_SCREENS.ACCOUNT} component={AccountSettingsScreen} />
			<Stack.Screen name={SETTINGS_SCREENS.MY_GROUPS} component={MyGroupsScreen} />
			<Stack.Screen name={SETTINGS_SCREENS.MANAGE_GROUP} component={ManageGroupScreen} />
			<Stack.Screen name={PAYMENT_SCREENS.SUCCESS} component={SuccessPaymentScreen} />
			<Stack.Screen name="PROFILE_SCREEN" component={ProfileScreen} />
			<Stack.Screen name="REVENUE_SCREEN" component={RevenueScreen} />
			<Stack.Screen name="ACCOUNT_SETTINGS" component={AccountSettingsScreen} />
			<Stack.Screen name="MY_GROUPS" component={MyGroupsScreen} />
			<Stack.Screen name="MANAGE_GROUP" component={ManageGroupScreen} />
			<Stack.Screen name="ACTIVE_CHAT" component={ActiveChatScreen} />
		</Stack.Navigator>
	);
};

export default SignedInStack;
