/**
 * ForgotPasswordScreen
 *
 * Layar lupa password. Menampilkan pesan sukses yang datang langsung
 * dari response backend (bukan hardcoded di frontend).
 */

import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
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
import { SIGNED_OUT_SCREENS } from "@utils/screens";
import { validateEmail } from "@utils/validators/authValidators";
import { ParsedApiError } from "@utils/errors/errorTypes";

const ForgotPasswordScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<SignedOutStackParams & NavigationParams>>();

  const { forgotPassword, isLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  // Pesan sukses diambil langsung dari response backend
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleGoToSignIn = () => {
    navigation.navigate(SIGNED_OUT_SCREENS.SIGN_IN_SCREEN);
  };

  const handleSendResetLink = async () => {
    setEmailError(null);
    setSuccessMessage(null);

    // Validasi email lokal dulu
    const validationError = validateEmail(email);
    if (validationError) {
      setEmailError(validationError);
      return;
    }

    try {
      // forgotPassword() mengembalikan pesan dari backend
      const message = await forgotPassword(email);
      setSuccessMessage(message ?? "Email reset password berhasil dikirim");
    } catch (err) {
      const parsed = err as ParsedApiError;

      if (parsed.fieldErrors?.email) {
        setEmailError(parsed.fieldErrors.email);
      } else {
        Alert.alert("Gagal Mengirim", parsed.message);
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
          {/* Icon */}
          <View className="items-center mb-12">
            <View className="bg-heyhao-blue/10 w-20 h-20 rounded-3xl items-center justify-center mb-4">
              <Icon name={successMessage ? "check-circle" : "mail"} size={40} color="#165dff" />
            </View>
            <Text className="text-3xl font-black text-heyhao-black">
              {successMessage ? "Cek Email Kamu" : "Reset Password"}
            </Text>
          </View>

          {/* Pesan sukses dari backend */}
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

          {/* Form input email (hanya tampil jika belum sukses) */}
          {!successMessage && (
            <>
              <View className="mb-10">
                <Text className="text-lg font-bold text-heyhao-black mb-2">
                  Masukkan email kamu
                </Text>
                <Text className="text-heyhao-secondary text-sm font-medium">
                  Kami akan mengirim link untuk mengatur ulang password kamu
                </Text>
              </View>

              <View className="w-full mb-8">
                <Text className="text-heyhao-black font-bold text-sm mb-2 ml-1">Email</Text>
                <TextInput
                  onChangeText={setEmail}
                  value={email}
                  placeholder="email@kamu.com"
                  backgroundColor="bg-heyhao-grey"
                  borderLess={false}
                  borderColor={emailError ? "border-red-500" : "border-transparent"}
                  inputStyle="h-14 rounded-2xl px-4 flex-row items-center"
                  editable={!isLoading}
                />
                {emailError && (
                  <Text className="text-red-500 text-xs mt-1 ml-1">{emailError}</Text>
                )}
              </View>
            </>
          )}

          {/* Tombol aksi */}
          {successMessage ? (
            <Button
              onPress={handleGoToSignIn}
              label="Kembali ke Halaman Masuk"
              buttonBackground="bg-heyhao-blue"
              borderRadius="rounded-2xl"
              buttonHeight="h-14"
            />
          ) : (
            <Button
              onPress={handleSendResetLink}
              label={isLoading ? "Mengirim..." : "Kirim Link Reset"}
              buttonBackground="bg-heyhao-blue"
              borderRadius="rounded-2xl"
              buttonHeight="h-14"
              isDisabled={!email || isLoading || !!emailError}
            />
          )}

          {/* Link kembali ke login */}
          {!successMessage && (
            <View className="items-center mt-8">
              <Text className="text-heyhao-secondary text-sm">
                Ingat password kamu?{" "}
                <Text onPress={handleGoToSignIn} className="text-heyhao-blue font-bold">
                  Masuk
                </Text>
              </Text>
            </View>
          )}

          {/* Info box */}
          <View className="mt-10 bg-heyhao-blue/10 rounded-2xl p-4 border border-heyhao-blue/20">
            <View className="flex-row items-start">
              <Icon name="info" size={20} color="#165dff" />
              <Text className="text-heyhao-secondary text-xs ml-3 flex-1 leading-relaxed">
                {successMessage
                  ? "Cek email kamu untuk link reset password. Link akan kadaluarsa dalam 24 jam."
                  : "Kamu akan menerima email berisi instruksi untuk mengatur ulang password. Link berlaku selama 24 jam."}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </AwareView>
  );
};

export default ForgotPasswordScreen;
