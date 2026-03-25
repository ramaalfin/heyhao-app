export const NAVIGATOR_BOTTOM_TAB = "Bottom Tab" as const;
export const NAVIGATOR_LANDING = "Landing Stack" as const;
export const NAVIGATOR_SIGNED_IN_STACK = "Signed In Stack" as const;
export const NAVIGATOR_SIGNED_OUT_STACK = "Signed Out Stack" as const;
export const NAVIGATOR_HOME_STACK = "Home" as const;
export const NAVIGATOR_MODAL_STACK = "Modal" as const;
export const NAVIGATOR_DRAWER_STACK = "Drawer" as const;

export const HOME_SCREENS = {
	MAIN_SCREEN: "Main",
	PROFILE_SCREEN: "Profile",
	DISCOVER_SCREEN: "Discover",
	CHAT_SCREEN: "Chat",
	REVENUE_SCREEN: "Revenue",
	SETTINGS_SCREEN: "Settings",
} as const;

export const DISCOVER_SCREENS = {
	DETAIL_GROUP: "Detail Group",
} as const;

export const REVENUE_SCREENS = {
	WITHDRAW: "Withdraw",
	PAYOUTS: "Payouts",
} as const;

export const SETTINGS_SCREENS = {
	ACCOUNT: "Account Settings",
	MY_GROUPS: "My Groups",
	MANAGE_GROUP: "Manage Group",
	EDIT_GROUP: "Edit Group",
	CREATE_GROUP: "Create Group",
} as const;

export const PAYMENT_SCREENS = {
	SUCCESS: "Success Payment",
} as const;

export const AUTH_SCREENS = {
	UPDATE_PASSWORD: "Update Password",
} as const;

export const SIGNED_OUT_SCREENS = {
	SIGN_IN_SCREEN: "Sign In",
	SIGN_UP_SCREEN: "Sign Up",
	FORGOT_PASSWORD_SCREEN: "Forgot Password",
	UPDATE_PASSWORD_SCREEN: "Update Password",
} as const;

export const MODAL_SCREENS = {
	PERMISSION_SCREEN: "Permission",
	PERMISSION_DENIED_SCREEN: "Permission Denied",
} as const;
