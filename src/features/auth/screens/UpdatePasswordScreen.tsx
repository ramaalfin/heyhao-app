/**
 * UpdatePasswordScreen
 *
 * Layar update password dengan token reset.
 * Pesan sukses diambil dari response backend, bukan hardcoded.
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

import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import AwareView from "@components/AwareView";
import Button from "@components/Button";
import TextInput from "@components/TextInput";
import useAuth from "@hooks/useAuth";
import { NavigationParams } from "@navigation/Navigation";
import { SignedOutStackParams } from "@navigation/stacks/SignedOutStack";
import { SIGNED_OUT_SCREENS } from "@utils/screens";
import { validateUpdatePasswordForm } from "@utils/validators/authValidators";
import { ParsedApiError } from "@utils/errors/errorTypes";

type UpdatePasswordRouteProp = RouteProp<
  SignedOutStackParams & {
    "Update Password": { tokenId: string };
  },
  "Update Password"
>;

type FormErrors = {
  password?: string;
  confirmPassword?: string;
};

const UpdatePasswordScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<SignedOutStackParams & NavigationParams>>();
  const route = useRoute<UpdatePasswordRouteProp>();

  const { updatePassword, isLoading } = useAuth();

  const tokenId = route.params?.tokenId;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  // Pesan sukses dari backend
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleGoToSignIn = () => {
    navigation.navigate(SIGNED_OUT_SCREENS.SIGN_IN_SCREEN);
  };

  const handleUpdatePassword = async () => {
    setFormErrors({});
    setSuccessMessage(null);

    // Validasi lokal
    const validationErrors = validateUpdatePasswordForm(password, confirmPassword);
    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors as FormErrors);
      return;
    }

    if (!tokenId) {
      Alert.alert("Error", "Token reset tidak valid atau sudah kadaluarsa");
      return;
    }

    try {
      // updatePassword() mengembalikan pesan dari backend
      const message = await updatePassword(tokenId, { password, confirmPassword });
      setSuccessMessage(message ?? "Password berhasil diperbarui");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      const parsed = err as ParsedApiError;
      if (parsed.fieldErrors) {
        setFormErrors(parsed.fieldErrors as FormErrors);
      } else {
        Alert.alert("Gagal Update", parsed.message);
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
              <Icon name={successMessage ? "check-circle" : "lock-reset"} size={40} color="#165dff" />
            </View>
            <Text className="text-3xl font-black text-heyhao-black">
              {successMessage ? "Password Diperbarui!" : "Buat Password Baru"}
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

          {/* Form (hanya tampil jika belum sukses) */}
          {!successMessage && (
            <>
              <View className="mb-10">
                <Text className="text-lg font-bold text-heyhao-black mb-2">
                  Buat password baru
                </Text>
                <Text className="text-heyhao-secondary text-sm font-medium">
                  Password minimal 6 karakter
                </Text>
              </View>

              <View className="w-full gap-4 mb-8">
                {/* Password baru */}
                <View className="w-full">
                  <Text className="text-heyhao-black font-bold text-sm mb-2 ml-1">
                    Password Baru
                  </Text>
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
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                      <Icon
                        name={showPassword ? "visibility" : "visibility-off"}
                        size={20}
                        color="#6a7686"
                      />
                    </TouchableOpacity>
                  </View>
                  {formErrors.password && (
                    <Text className="text-red-500 text-xs mt-1 ml-1">{formErrors.password}</Text>
                  )}
                </View>

                {/* Konfirmasi password */}
                <View className="w-full">
                  <Text className="text-heyhao-black font-bold text-sm mb-2 ml-1">
                    Konfirmasi Password
                  </Text>
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
                    <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                      <Icon
                        name={showConfirmPassword ? "visibility" : "visibility-off"}
                        size={20}
                        color="#6a7686"
                      />
                    </TouchableOpacity>
                  </View>
                  {formErrors.confirmPassword && (
                    <Text className="text-red-500 text-xs mt-1 ml-1">
                      {formErrors.confirmPassword}
                    </Text>
                  )}
                </View>
              </View>
            </>
          )}

          {/* Tombol aksi */}
          {successMessage ? (
            <Button
              onPress={handleGoToSignIn}
              label="Masuk Sekarang"
              buttonBackground="bg-heyhao-blue"
              borderRadius="rounded-2xl"
              buttonHeight="h-14"
            />
          ) : (
            <Button
              onPress={handleUpdatePassword}
              label={isLoading ? "Memperbarui..." : "Perbarui Password"}
              buttonBackground="bg-heyhao-blue"
              borderRadius="rounded-2xl"
              buttonHeight="h-14"
              isDisabled={!password || !confirmPassword || isLoading}
            />
          )}

          {/* Info */}
          <View className="mt-10 bg-heyhao-blue/10 rounded-2xl p-4 border border-heyhao-blue/20">
            <View className="flex-row items-start">
              <Icon name="info" size={20} color="#165dff" />
              <Text className="text-heyhao-secondary text-xs ml-3 flex-1 leading-relaxed">
                {successMessage
                  ? "Kamu sekarang bisa masuk menggunakan password baru."
                  : "Gunakan password yang kuat dan unik. Hindari menggunakan kata-kata umum atau informasi personal."}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </AwareView>
  );
};

export default UpdatePasswordScreen;
