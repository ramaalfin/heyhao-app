import React, {useState} from "react";
import {
	ActivityIndicator,
	Alert,
	ScrollView,
	Text,
	View,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

import {useNavigation} from "@react-navigation/native";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";

import AwareView from "@components/AwareView";
import Button from "@components/Button";
import TextInput from "@components/TextInput";
import useAuth from "@hooks/useAuth";
import {NavigationParams} from "@navigation/Navigation";
import {SignedOutStackParams} from "@navigation/stacks/SignedOutStack";
import {getFieldErrors, getUserErrorMessage} from "@utils/errors/errorHandler";
import {SIGNED_OUT_SCREENS} from "@utils/screens";
import {validateEmail} from "@utils/validators/authValidators";

const ForgotPasswordScreen = () => {
	const navigation =
		useNavigation<
			NativeStackNavigationProp<SignedOutStackParams & NavigationParams>
		>();

	const {forgotPassword, isLoading} = useAuth();

	const [email, setEmail] = useState("");
	const [emailError, setEmailError] = useState<string | null>(null);
	const [successMessage, setSuccessMessage] = useState<string | null>(null);

	const handleSignInNavigation = () => {
		navigation.navigate(SIGNED_OUT_SCREENS.SIGN_IN_SCREEN);
	};

	const handleSendResetLink = async () => {
		// Clear previous errors and success message
		setEmailError(null);
		setSuccessMessage(null);

		// Validate email
		const validationError = validateEmail(email);
		if (validationError) {
			setEmailError(validationError);
			return;
		}

		try {
			await forgotPassword(email);
			// Show success message
			setSuccessMessage("Password reset email sent successfully");
		} catch (error) {
			// Extract field errors if available
			const fieldErrors = getFieldErrors(error);
			if (fieldErrors?.email) {
				setEmailError(fieldErrors.email);
			} else {
				// Show general error message
				Alert.alert("Reset Failed", getUserErrorMessage(error));
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
							<Icon name={successMessage ? "check-circle" : "mail"} size={40} color="#165dff" />
						</View>
						<Text className="text-3xl font-black text-heyhao-black">
							{successMessage ? "Check Your Email" : "Reset Password"}
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
							<Text className="text-lg font-bold text-heyhao-black mb-2">Enter your email address</Text>
							<Text className="text-heyhao-secondary text-sm font-medium">
								We'll send you a link to reset your password
							</Text>
						</View>
					)}

					{/* Input */}
					{!successMessage && (
						<View className="w-full mb-8">
							<Text className="text-heyhao-black font-bold text-sm mb-2 ml-1">Email Address</Text>
							<TextInput
								onChangeText={setEmail}
								value={email}
								placeholder="your@email.com"
								backgroundColor="bg-heyhao-grey"
								borderLess={false}
								borderColor="border-transparent"
								inputStyle="h-14 rounded-2xl px-4 flex-row items-center"
								editable={!isLoading}
							/>
							{emailError && (
								<Text className="text-red-500 text-xs mt-1 ml-1">{emailError}</Text>
							)}
						</View>
					)}

					{/* Send Button or Back to Sign In Button */}
					{successMessage ? (
						<Button
							onPress={handleSignInNavigation}
							label="Back to Sign In"
							buttonBackground="bg-heyhao-blue"
							borderRadius="rounded-2xl"
							buttonHeight="h-14"
						/>
					) : (
						<Button
							onPress={handleSendResetLink}
							label={isLoading ? "Sending..." : "Send Reset Link"}
							buttonBackground="bg-heyhao-blue"
							borderRadius="rounded-2xl"
							buttonHeight="h-14"
							isDisabled={!email || isLoading || !!emailError}
						/>
					)}

					{/* Loading Indicator */}
					{isLoading && (
						<View className="items-center mt-4">
							<ActivityIndicator size="small" color="#165dff" />
						</View>
					)}

					{/* Back to Login */}
					{!successMessage && (
						<View className="items-center mt-8">
							<Text className="text-heyhao-secondary text-sm">
								Remember your password?{" "}
								<Text 
									onPress={handleSignInNavigation}
									className="text-heyhao-blue font-bold">
									Sign In
								</Text>
							</Text>
						</View>
					)}

					{/* Info Box */}
					<View className="mt-10 bg-heyhao-blue/10 rounded-2xl p-4 border border-heyhao-blue/20">
						<View className="flex-row items-start">
							<Icon name="info" size={20} color="#165dff" />
							<Text className="text-heyhao-secondary text-xs ml-3 flex-1 leading-relaxed">
								{successMessage 
									? "Check your email for a password reset link. The link will expire in 24 hours."
									: "You'll receive an email with instructions to reset your password. The link will expire in 24 hours."}
							</Text>
						</View>
					</View>
				</View>
			</ScrollView>
		</AwareView>
	);
};

export default ForgotPasswordScreen;
