import React, {useState} from "react";
import {
	ActivityIndicator,
	Alert,
	ScrollView,
	Text,
	View,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

import {RouteProp,useNavigation, useRoute} from "@react-navigation/native";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";

import AwareView from "@components/AwareView";
import Button from "@components/Button";
import TextInput from "@components/TextInput";
import useAuth from "@hooks/useAuth";
import {NavigationParams} from "@navigation/Navigation";
import {SignedOutStackParams} from "@navigation/stacks/SignedOutStack";
import {getFieldErrors, getUserErrorMessage} from "@utils/errors/errorHandler";
import {SIGNED_OUT_SCREENS} from "@utils/screens";
import {validateUpdatePasswordForm} from "@utils/validators/authValidators";

type UpdatePasswordRouteProp = RouteProp<
	SignedOutStackParams & {
		"Update Password": {tokenId: string};
	},
	"Update Password"
>;

const UpdatePasswordScreen = () => {
	const navigation =
		useNavigation<
			NativeStackNavigationProp<SignedOutStackParams & NavigationParams>
		>();
	const route = useRoute<UpdatePasswordRouteProp>();

	const {updatePassword, isLoading} = useAuth();

	// Extract tokenId from route params
	const tokenId = route.params?.tokenId;

	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [errors, setErrors] = useState<{password?: string; confirmPassword?: string}>({});
	const [successMessage, setSuccessMessage] = useState<string | null>(null);

	const handleSignInNavigation = () => {
		navigation.navigate(SIGNED_OUT_SCREENS.SIGN_IN_SCREEN);
	};

	const handleUpdatePassword = async () => {
		// Clear previous errors and success message
		setErrors({});
		setSuccessMessage(null);

		// Validate form
		const validationErrors = validateUpdatePasswordForm(password, confirmPassword);
		if (Object.keys(validationErrors).length > 0) {
			setErrors(validationErrors);
			return;
		}

		// Check if tokenId exists
		if (!tokenId) {
			Alert.alert("Error", "Invalid or missing reset token");
			return;
		}

		try {
			await updatePassword(tokenId, {password, confirmPassword});
			// Show success message
			setSuccessMessage("Password updated successfully");
			// Clear form fields
			setPassword("");
			setConfirmPassword("");
		} catch (error) {
			// Extract field errors if available
			const fieldErrors = getFieldErrors(error);
			if (fieldErrors) {
				setErrors(fieldErrors);
			} else {
				// Show general error message
				Alert.alert("Update Failed", getUserErrorMessage(error));
			}
		}
	};

	return (
		<AwareView backgroundColor="bg-white">
			<ScrollView
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{flexGrow: 1}}
				className="w-full h-full">
				<View className="flex-1 w-full justify-center px-6 py-12">
					{/* Icon */}
					<View className="items-center mb-12">
						<View className="bg-heyhao-blue/10 w-20 h-20 rounded-3xl items-center justify-center mb-4">
							<Icon name={successMessage ? "check-circle" : "lock-reset"} size={40} color="#165dff" />
						</View>
						<Text className="text-3xl font-black text-heyhao-black">
							{successMessage ? "Password Updated!" : "Update Password"}
						</Text>
					</View>

					{/* Success Message */}
					{successMessage && (
						<View className="mb-8 bg-green-50 rounded-2xl p-4 border border-green-200">
							<View className="flex-row items-start">
								<Icon name="check-circle" size={20} color="#10b981" />
								<Text className="text-green-700 text-sm ml-3 flex-1 leading-relaxed font-medium">
									{successMessage}
								</Text>
							</View>
						</View>
					)}

					{/* Header */}
					{!successMessage && (
						<View className="mb-10">
							<Text className="text-lg font-bold text-heyhao-black mb-2">Create a new password</Text>
							<Text className="text-heyhao-secondary text-sm font-medium">
								Your new password must be at least 6 characters long
							</Text>
						</View>
					)}

					{/* Inputs */}
					{!successMessage && (
						<View className="w-full gap-4 mb-8">
							<View className="w-full">
								<Text className="text-heyhao-black font-bold text-sm mb-2 ml-1">New Password</Text>
								<View className="bg-heyhao-grey rounded-2xl px-4 h-14 flex-row items-center">
									<TextInput
										onChangeText={setPassword}
										value={password}
										placeholder="••••••••"
										backgroundColor="bg-transparent"
										borderLess={true}
										type={showPassword ? "text" : "password"}
										inputStyle="flex-1"
										editable={!isLoading}
									/>
								</View>
								{errors.password && (
									<Text className="text-red-500 text-xs mt-1 ml-1">{errors.password}</Text>
								)}
							</View>
							<View className="w-full">
								<Text className="text-heyhao-black font-bold text-sm mb-2 ml-1">Confirm Password</Text>
								<View className="bg-heyhao-grey rounded-2xl px-4 h-14 flex-row items-center">
									<TextInput
										onChangeText={setConfirmPassword}
										value={confirmPassword}
										placeholder="••••••••"
										backgroundColor="bg-transparent"
										borderLess={true}
										type={showConfirmPassword ? "text" : "password"}
										inputStyle="flex-1"
										editable={!isLoading}
									/>
								</View>
								{errors.confirmPassword && (
									<Text className="text-red-500 text-xs mt-1 ml-1">{errors.confirmPassword}</Text>
								)}
							</View>
						</View>
					)}

					{/* Update Button or Sign In Button */}
					{successMessage ? (
						<Button
							onPress={handleSignInNavigation}
							label="Sign In"
							buttonBackground="bg-heyhao-blue"
							borderRadius="rounded-2xl"
							buttonHeight="h-14"
						/>
					) : (
						<Button
							onPress={handleUpdatePassword}
							label={isLoading ? "Updating..." : "Update Password"}
							buttonBackground="bg-heyhao-blue"
							borderRadius="rounded-2xl"
							buttonHeight="h-14"
							isDisabled={!password || !confirmPassword || isLoading || Object.keys(errors).length > 0}
						/>
					)}

					{/* Loading Indicator */}
					{isLoading && (
						<View className="items-center mt-4">
							<ActivityIndicator size="small" color="#165dff" />
						</View>
					)}

					{/* Info Box */}
					<View className="mt-10 bg-heyhao-blue/10 rounded-2xl p-4 border border-heyhao-blue/20">
						<View className="flex-row items-start">
							<Icon name="info" size={20} color="#165dff" />
							<Text className="text-heyhao-secondary text-xs ml-3 flex-1 leading-relaxed">
								{successMessage 
									? "You can now sign in with your new password."
									: "Make sure your password is strong and unique. Avoid using common words or personal information."}
							</Text>
						</View>
					</View>
				</View>
			</ScrollView>
		</AwareView>
	);
};

export default UpdatePasswordScreen;
