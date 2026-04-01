/**
 * Authentication API Service
 *
 * Hanya bertanggung jawab untuk HTTP request ke backend.
 * Tidak boleh ada logic Redux di sini — itu tugas hook/screen.
 */

import { photoUploader } from "@services/media/photoUploader";
import { AxiosInstance } from "axios";

import type {
  ApiResponse,
  AuthResponse,
  SignInRequest,
  SignUpRequest,
  SignUpData,
  TokenResponse,
  User,
} from "./types";

export class AuthApi {
  private client: AxiosInstance;

  constructor(client: AxiosInstance) {
    this.client = client;
  }

  // Daftar user baru (dengan upload foto)
  async signUp(data: SignUpRequest): Promise<AuthResponse> {
    const photoValidation = photoUploader.validatePhoto(data.photo);
    if (!photoValidation.isValid) {
      throw new Error(photoValidation.error);
    }

    const userData: SignUpData = {
      name: data.name,
      email: data.email,
      password: data.password,
    };

    const formData = photoUploader.prepareFormData(data.photo, userData);

    const response = await this.client.post<AuthResponse>("/auth/sign-up", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
  }

  // Login user
  async signIn(data: SignInRequest): Promise<AuthResponse> {
    const response = await this.client.post<AuthResponse>("/auth/sign-in", data);
    return response.data;
  }

  // Refresh access token
  async refreshToken(refreshToken: string): Promise<TokenResponse> {
    const response = await this.client.post<TokenResponse>("/auth/refresh-token", {
      refreshToken,
    });
    return response.data;
  }

  // Logout user
  async logout(userId: string): Promise<void> {
    await this.client.post("/auth/logout", { userId });
  }

  // Kirim email reset password
  async forgotPassword(email: string): Promise<ApiResponse> {
    const response = await this.client.post<ApiResponse>("/auth/forgot-password", { email });
    return response.data;
  }

  // Update password dengan token reset
  async updatePassword(tokenId: string, data: { password: string; confirmPassword: string }): Promise<ApiResponse> {
    const response = await this.client.put<ApiResponse>(`/auth/forgot-password/${tokenId}`, data);
    return response.data;
  }

  // Ambil data profil user
  async getUserProfile(userId: string): Promise<ApiResponse<User>> {
    const response = await this.client.get<ApiResponse<User>>(`/users/personal-info/${userId}`);
    return response.data;
  }
}

export default AuthApi;
