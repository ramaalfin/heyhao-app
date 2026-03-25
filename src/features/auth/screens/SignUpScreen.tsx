import React, {useEffect,useState} from "react";
import {
	ActivityIndicator,
	Alert,
	Image,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import {Asset} from "react-native-image-picker";
import Icon from "react-native-vector-icons/MaterialIcons";

import {useNavigation} from "@react-navigation/native";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {photoUploader} from "@services/media/photoUploader";

import Avatar from "@components/Avatar";
import AwareView from "@components/AwareView";
import Button from "@components/Button";
import TextInput from "@components/TextInput";
import {useAuth} from "@hooks/useAuth";
import {NavigationParams} from "@navigation/Navigation";
import {SignedOutStackParams} from "@navigation/stacks/SignedOutStack";
import {getFieldErrors, getUserErrorMessage} from "@utils/errors/errorHandler";
import {SIGNED_OUT_SCREENS} from "@utils/screens";
import {validateSignUpForm} from "@utils/validators/authValidators";

const SignUpScreen = () => {
	const navigation =
		useNavigation<
			NativeStackNavigationProp<SignedOutStackParams & NavigationParams>
		>();

	const {signUp, isLoading, isAuthenticated, error: reduxError} = useAuth();

	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [photo, setPhoto] = useState<Asset | null>(null);
	const [showPassword, setShowPassword] = useState(false);
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [apiError, setApiError] = useState<string | null>(null);

	// Navigate to SignedInStack when authenticated
	useEffect(() => {
		if (isAuthenticated) {
			// Navigation will be handled by the Navigation component
			// which watches the isAuthenticated state
		}
	}, [isAuthenticated]);

	const handleSignInNavigation = () => {
		navigation.navigate(SIGNED_OUT_SCREENS.SIGN_IN_SCREEN);
	};

	const handlePhotoSelection = async () => {
		try {
			Alert.alert(
				"Select Photo",
				"Choose a photo source",
				[
					{
						text: "Camera",
						onPress: async () => {
							const selectedPhoto = await photoUploader.selectFromCamera();
							if (selectedPhoto) {
								setPhoto(selectedPhoto);
								setErrors(prev => ({...prev, photo: ""}));
							}
						},
					},
					{
						text: "Gallery",
						onPress: async () => {
							const selectedPhoto = await photoUploader.selectFromGallery();
							if (selectedPhoto) {
								setPhoto(selectedPhoto);
								setErrors(prev => ({...prev, photo: ""}));
							}
						},
					},
					{
						text: "Cancel",
						style: "cancel",
					},
				]
			);
		} catch (error) {
			Alert.alert("Error", "Failed to select photo. Please try again.");
		}
	};

	const handleSignUp = async () => {
		// Clear previous errors
		setErrors({});
		setApiError(null);

		// Validate form
		const validationErrors = validateSignUpForm(name, email, password);
		
		// Validate photo
		if (!photo) {
			validationErrors.photo = "Photo is required";
		} else {
			const photoValidation = photoUploader.validatePhoto(photo);
			if (!photoValidation.isValid) {
				validationErrors.photo = photoValidation.error || "Invalid photo";
			}
		}

		// If there are validation errors, display them and return
		if (Object.keys(validationErrors).length > 0) {
			setErrors(validationErrors);
			return;
		}

		// Submit sign-up request
		try {
			await signUp({
				name,
				email,
				password,
				photo: photo!,
			});

			// Success - navigation will be handled by useEffect watching isAuthenticated
		} catch (error) {
			// Handle API errors
			const fieldErrors = getFieldErrors(error);
			if (fieldErrors) {
				setErrors(fieldErrors);
			}

			const errorMessage = getUserErrorMessage(error);
			setApiError(errorMessage);
		}
	};

	return (
		<AwareView backgroundColor="bg-white">
			<ScrollView
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{flexGrow: 1}}
				className="w-full h-full">
				<View className="flex-1 w-full justify-center px-6 py-12">
					{/* Logo */}
					<View className="items-center mb-12">
						<View className="bg-heyhao-blue/10 w-16 h-16 rounded-3xl items-center justify-center mb-4">
							<Icon name="bolt" size={40} color="#165dff" />
						</View>
						<Text className="text-3xl font-black text-heyhao-black">HeyHao</Text>
						<Text className="text-heyhao-secondary text-sm font-medium mt-1">Join the Community</Text>
					</View>

					{/* Header */}
					<View className="mb-10">
						<Text className="text-3xl font-black text-heyhao-black mb-2">Create Account 🚀</Text>
						<Text className="text-heyhao-secondary text-base font-medium">
							Join thousands of professionals
						</Text>
					</View>

					{/* Avatar Section */}
					<View className="items-center mb-10">
						{photo ? (
							<Image
								source={{uri: photo.uri}}
								className="w-20 h-20 rounded-full"
							/>
						) : (
							<Avatar username={name || "User"} size={80} />
						)}
						<TouchableOpacity 
							className="mt-4 bg-heyhao-blue rounded-full px-6 py-2 flex-row items-center"
							onPress={handlePhotoSelection}
							disabled={isLoading}>
							<Icon name="camera-alt" size={16} color="white" />
							<Text className="text-white font-bold text-sm ml-2">Upload Photo</Text>
						</TouchableOpacity>
						{errors.photo && (
							<Text className="text-red-500 text-xs mt-2">{errors.photo}</Text>
						)}
					</View>

					{/* Inputs */}
					<View className="w-full gap-4 mb-6">
						<View>
							<Text className="text-heyhao-black font-bold text-sm mb-2 ml-1">Full Name</Text>
							<TextInput
								onChangeText={(text) => {
									setName(text);
									if (errors.name) {
										setErrors(prev => ({...prev, name: ""}));
									}
								}}
								value={name}
								placeholder="John Doe"
								backgroundColor="bg-heyhao-grey"
								borderLess={false}
								borderColor={errors.name ? "border-red-500" : "border-transparent"}
								inputStyle="h-14 rounded-2xl px-4 flex-row items-center"
								editable={!isLoading}
							/>
							{errors.name && (
								<Text className="text-red-500 text-xs mt-1 ml-1">{errors.name}</Text>
							)}
						</View>
						<View>
							<Text className="text-heyhao-black font-bold text-sm mb-2 ml-1">Email Address</Text>
							<TextInput
								onChangeText={(text) => {
									setEmail(text);
									if (errors.email) {
										setErrors(prev => ({...prev, email: ""}));
									}
								}}
								value={email}
								placeholder="your@email.com"
								backgroundColor="bg-heyhao-grey"
								borderLess={false}
								borderColor={errors.email ? "border-red-500" : "border-transparent"}
								inputStyle="h-14 rounded-2xl px-4 flex-row items-center"
								editable={!isLoading}
							/>
							{errors.email && (
								<Text className="text-red-500 text-xs mt-1 ml-1">{errors.email}</Text>
							)}
						</View>
						<View>
							<Text className="text-heyhao-black font-bold text-sm mb-2 ml-1">Password</Text>
							<View className={`bg-heyhao-grey rounded-2xl px-4 h-14 flex-row items-center ${errors.password ? "border border-red-500" : ""}`}>
								<TextInput
									onChangeText={(text) => {
										setPassword(text);
										if (errors.password) {
											setErrors(prev => ({...prev, password: ""}));
										}
									}}
									value={password}
									placeholder="••••••••"
									backgroundColor="bg-transparent"
									borderLess={true}
									type={showPassword ? "text" : "password"}
									inputStyle="flex-1"
									editable={!isLoading}
								/>
								<TouchableOpacity 
									onPress={() => setShowPassword(!showPassword)}
									disabled={isLoading}>
									<Icon 
										name={showPassword ? "visibility" : "visibility-off"} 
										size={20} 
										color="#6a7686" 
									/>
								</TouchableOpacity>
							</View>
							{errors.password && (
								<Text className="text-red-500 text-xs mt-1 ml-1">{errors.password}</Text>
							)}
						</View>
					</View>

					{/* Terms */}
					<View className="flex-row items-start mb-8">
						<Icon name="check-circle" size={20} color="#30b22d" />
						<Text className="text-heyhao-secondary text-xs font-medium ml-2 flex-1">
							I agree to the Terms of Service and Privacy Policy
						</Text>
					</View>

					{/* API Error Message */}
					{apiError && (
						<View className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-4 flex-row items-start">
							<Icon name="error-outline" size={20} color="#ef4444" />
							<Text className="text-red-600 text-sm ml-2 flex-1">{apiError}</Text>
						</View>
					)}

					{/* Sign Up Button */}
					<Button
						onPress={handleSignUp}
						label={isLoading ? "Creating Account..." : "Create Account"}
						buttonBackground="bg-heyhao-blue"
						borderRadius="rounded-2xl"
						buttonHeight="h-14"
						isDisabled={!name || !email || !password || !photo || isLoading}
					/>

					{/* Loading Indicator */}
					{isLoading && (
						<View className="items-center mt-4">
							<ActivityIndicator size="small" color="#165dff" />
						</View>
					)}

					{/* Sign In Link */}
					<View className="items-center mt-8">
						<Text className="text-heyhao-secondary text-sm">
							Already have an account?{" "}
							<Text 
								onPress={handleSignInNavigation}
								className="text-heyhao-blue font-bold">
								Sign In
							</Text>
						</Text>
					</View>
				</View>
			</ScrollView>
		</AwareView>
	);
};

export default SignUpScreen;
