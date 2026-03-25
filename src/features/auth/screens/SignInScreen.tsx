import React, { useState } from "react";
import {
	ActivityIndicator,
	Alert,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import AwareView from "@components/AwareView";
import Button from "@components/Button";
import TextInput from "@components/TextInput";
import useAuth from "@hooks/useAuth";
import { NavigationParams } from "@navigation/Navigation";
import { SignedOutStackParams } from "@navigation/stacks/SignedOutStack";
import { getFieldErrors, getUserErrorMessage } from "@utils/errors/errorHandler";
import { NAVIGATOR_SIGNED_IN_STACK, SIGNED_OUT_SCREENS } from "@utils/screens";
import { validateSignInForm } from "@utils/validators/authValidators";

const SignInScreen = () => {
	const navigation =
		useNavigation<
			NativeStackNavigationProp<SignedOutStackParams & NavigationParams>
		>();

	const { signIn, isLoading } = useAuth();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

	const handleSignUpNavigation = () => {
		navigation.navigate(SIGNED_OUT_SCREENS.SIGN_UP_SCREEN);
	};

	const handleForgotPasswordNavigation = () => {
		navigation.navigate(SIGNED_OUT_SCREENS.FORGOT_PASSWORD_SCREEN);
	};

	const handleSignIn = async () => {
		// Clear previous errors
		setErrors({});

		// Validate form
		const validationErrors = validateSignInForm(email, password);
		if (Object.keys(validationErrors).length > 0) {
			setErrors(validationErrors);
			return;
		}

		try {
			await signIn({ email: email.toLowerCase(), password });
			// Navigation will be handled automatically by Navigation component
		} catch (error) {
			// Extract field errors if available
			const fieldErrors = getFieldErrors(error);
			if (fieldErrors) {
				setErrors(fieldErrors);
			} else {
				// Show general error message
				Alert.alert("Sign In Failed", getUserErrorMessage(error));
			}
		}
	};

	return (
		<AwareView backgroundColor="bg-white">
			<ScrollView
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{ flexGrow: 1 }}
				className="w-full h-full">
				<View className="flex-1 w-full justify-center px-6 py-12">
					{/* Logo */}
					<View className="items-center mb-12">
						<View className="bg-heyhao-blue/10 w-16 h-16 rounded-3xl items-center justify-center mb-4">
							<Icon name="bolt" size={40} color="#165dff" />
						</View>
						<Text className="text-3xl font-black text-heyhao-black">HeyHao</Text>
						<Text className="text-heyhao-secondary text-sm font-medium mt-1">Community Hub</Text>
					</View>

					{/* Header */}
					<View className="mb-10">
						<Text className="text-3xl font-black text-heyhao-black mb-2">Welcome Back 👋</Text>
						<Text className="text-heyhao-secondary text-base font-medium">
							Sign in to your account to continue
						</Text>
					</View>

					{/* Inputs */}
					<View className="w-full gap-4 mb-6">
						<View className="w-full">
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
							{errors.email && (
								<Text className="text-red-500 text-xs mt-1 ml-1">{errors.email}</Text>
							)}
						</View>
						<View className="w-full">
							<Text className="text-heyhao-black font-bold text-sm mb-2 ml-1">Password</Text>
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
					</View>

					{/* Forgot Password Link */}
					<TouchableOpacity className="mb-8" onPress={handleForgotPasswordNavigation}>
						<Text className="text-heyhao-blue font-semibold text-sm">Forgot Password?</Text>
					</TouchableOpacity>

					{/* Sign In Button */}
					<Button
						onPress={handleSignIn}
						label={isLoading ? "Signing In..." : "Sign In"}
						buttonBackground="bg-heyhao-blue"
						borderRadius="rounded-2xl"
						buttonHeight="h-14"
						isDisabled={!email || !password || isLoading}
					/>

					{/* Loading Indicator */}
					{isLoading && (
						<View className="items-center mt-4">
							<ActivityIndicator size="small" color="#165dff" />
						</View>
					)}

					{/* Divider */}
					<View className="flex-row items-center my-8">
						<View className="flex-1 h-px bg-heyhao-border" />
						<Text className="text-heyhao-secondary text-xs font-medium mx-3">OR</Text>
						<View className="flex-1 h-px bg-heyhao-border" />
					</View>

					{/* Social Login */}
					<View className="flex-row gap-3 mb-10">
						<TouchableOpacity className="flex-1 bg-heyhao-grey rounded-2xl py-3 items-center justify-center border border-heyhao-border">
							<Icon name="g-translate" size={24} color="#080c1a" />
						</TouchableOpacity>
						<TouchableOpacity className="flex-1 bg-heyhao-grey rounded-2xl py-3 items-center justify-center border border-heyhao-border">
							<Icon name="apple" size={24} color="#080c1a" />
						</TouchableOpacity>
					</View>

					{/* Sign Up Link */}
					<View className="items-center">
						<Text className="text-heyhao-secondary text-sm">
							Don't have an account?{" "}
							<Text
								onPress={handleSignUpNavigation}
								className="text-heyhao-blue font-bold">
								Sign Up
							</Text>
						</Text>
					</View>
				</View>
			</ScrollView>
		</AwareView>
	);
};

export default SignInScreen;
