/**
 * SignInScreen
 *
 * Layar login. Menampilkan pesan error langsung dari response backend.
 */

import React, { useState } from "react";
import {
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
import { NAVIGATOR_SIGNED_IN_STACK, SIGNED_OUT_SCREENS } from "@utils/screens";
import { validateSignInForm } from "@utils/validators/authValidators";
import { ParsedApiError } from "@utils/errors/errorTypes";

type FormErrors = {
  email?: string;
  password?: string;
};

const SignInScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<SignedOutStackParams & NavigationParams>>();

  const { signIn, isLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const handleGoToSignUp = () => {
    navigation.navigate(SIGNED_OUT_SCREENS.SIGN_UP_SCREEN);
  };

  const handleGoToForgotPassword = () => {
    navigation.navigate(SIGNED_OUT_SCREENS.FORGOT_PASSWORD_SCREEN);
  };

  const handleSignIn = async () => {
    setFormErrors({});

    // Validasi form lokal dulu sebelum request ke server
    const validationErrors = validateSignInForm(email, password);
    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors);
      return;
    }

    try {
      const response = await signIn({ email: email.toLowerCase().trim(), password });
      console.log("Success response:", response);
    } catch (err: any) {
      console.log("Raw Error Object:", err);

      const parsed = err as ParsedApiError;
      console.log("Parsed Error:", parsed);

      if (parsed.fieldErrors) {
        setFormErrors(parsed.fieldErrors as FormErrors);
      } else {
        Alert.alert("Gagal Masuk", parsed.message);
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

          {/* Judul */}
          <View className="mb-10">
            <Text className="text-3xl font-black text-heyhao-black mb-2">Welcome Back 👋</Text>
            <Text className="text-heyhao-secondary text-base font-medium">
              Masuk ke akun kamu untuk melanjutkan
            </Text>
          </View>

          {/* Input Email & Password */}
          <View className="w-full gap-4 mb-6">
            <View className="w-full">
              <Text className="text-heyhao-black font-bold text-sm mb-2 ml-1">Email</Text>
              <TextInput
                onChangeText={setEmail}
                value={email}
                placeholder="email@kamu.com"
                backgroundColor="bg-heyhao-grey"
                borderLess={false}
                borderColor={formErrors.email ? "border-red-500" : "border-transparent"}
                inputStyle="h-14 rounded-2xl px-4 flex-row items-center"
                editable={!isLoading}
              />
              {formErrors.email && (
                <Text className="text-red-500 text-xs mt-1 ml-1">{formErrors.email}</Text>
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
                  type="password"
                  inputStyle="flex-1"
                  editable={!isLoading}
                />
              </View>
              {formErrors.password && (
                <Text className="text-red-500 text-xs mt-1 ml-1">{formErrors.password}</Text>
              )}
            </View>
          </View>

          {/* Lupa Password */}
          <TouchableOpacity className="mb-8" onPress={handleGoToForgotPassword}>
            <Text className="text-heyhao-blue font-semibold text-sm">Lupa Password?</Text>
          </TouchableOpacity>

          {/* Tombol Sign In */}
          <Button
            onPress={handleSignIn}
            label={isLoading ? "Sedang masuk..." : "Masuk"}
            buttonBackground="bg-heyhao-blue"
            borderRadius="rounded-2xl"
            buttonHeight="h-14"
            isDisabled={!email || !password || isLoading}
          />

          {/* Garis OR */}
          <View className="flex-row items-center my-8">
            <View className="flex-1 h-px bg-heyhao-border" />
            <Text className="text-heyhao-secondary text-xs font-medium mx-3">ATAU</Text>
            <View className="flex-1 h-px bg-heyhao-border" />
          </View>

          {/* Login Sosial (placeholder) */}
          <View className="flex-row gap-3 mb-10">
            <TouchableOpacity className="flex-1 bg-heyhao-grey rounded-2xl py-3 items-center justify-center border border-heyhao-border">
              <Icon name="g-translate" size={24} color="#080c1a" />
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 bg-heyhao-grey rounded-2xl py-3 items-center justify-center border border-heyhao-border">
              <Icon name="apple" size={24} color="#080c1a" />
            </TouchableOpacity>
          </View>

          {/* Link ke Daftar */}
          <View className="items-center">
            <Text className="text-heyhao-secondary text-sm">
              Belum punya akun?{" "}
              <Text onPress={handleGoToSignUp} className="text-heyhao-blue font-bold">
                Daftar
              </Text>
            </Text>
          </View>
        </View>
      </ScrollView>
    </AwareView>
  );
};

export default SignInScreen;
