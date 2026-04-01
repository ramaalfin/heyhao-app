/**
 * useAuth Hook
 *
 * Hook untuk semua operasi autentikasi.
 * - Menggunakan singleton apiClient (tidak buat instance baru setiap render)
 * - Mengelola state loading/error lewat Redux dispatch
 * - Menangani error dan menampilkan pesan dari backend
 */

import { useCallback } from "react";
import { useDispatch } from "react-redux";

import apiClient from "@services/api/client/apiClient";
import { useAppSelector } from "@store/hooks";
import {
  clearAuth,
  selectError,
  selectIsAuthenticated,
  selectIsLoading,
  selectUser,
  setAuthToken,
  setError,
  setLoading,
  setRefreshToken,
  setUser,
} from "@store/UserSlice";

import type { SignInRequest, SignUpRequest } from "@services/api/auth/types";
import { logError, parseApiError } from "@utils/errors/errorHandler";

export const useAuth = () => {
  const dispatch = useDispatch();

  // Ambil state dari Redux
  const user = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isLoading = useAppSelector(selectIsLoading);
  const error = useAppSelector(selectError);

  // Daftar user baru
  const signUp = useCallback(async (data: SignUpRequest) => {
    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      const response = await apiClient.auth.signUp(data);
      const { id, name, email, photo, photo_url, token, refreshToken } = response.data;
      dispatch(setUser({ id, name, email, photo, photo_url }));
      dispatch(setAuthToken(token));
      dispatch(setRefreshToken(refreshToken));
      return response;
    } catch (err) {
      const parsed = parseApiError(err);
      dispatch(setError(parsed.message));
      logError(err, { method: "signUp", email: data.email });
      throw parsed;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  // Login user
  const signIn = useCallback(async (data: SignInRequest) => {
    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      const response = await apiClient.auth.signIn(data);
      const { id, name, email, photo, photo_url, token, refreshToken } = response.data;
      dispatch(setUser({ id, name, email, photo, photo_url }));
      dispatch(setAuthToken(token));
      dispatch(setRefreshToken(refreshToken));
      return response;
    } catch (err) {
      const parsed = parseApiError(err);
      dispatch(setError(parsed.message));
      logError(err, { method: "signIn", email: data.email });
      throw parsed;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  // Logout — selalu clear state lokal walaupun request gagal
  const logout = useCallback(async (userId: string) => {
    try {
      await apiClient.auth.logout(userId);
    } catch (err) {
      logError(err, { method: "logout", userId });
    } finally {
      dispatch(clearAuth());
    }
  }, [dispatch]);

  // Kirim email reset password, return pesan dari backend
  const forgotPassword = useCallback(async (email: string) => {
    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      const response = await apiClient.auth.forgotPassword(email);
      // Kembalikan pesan dari backend supaya screen bisa menampilkannya
      return response.message;
    } catch (err) {
      const parsed = parseApiError(err);
      dispatch(setError(parsed.message));
      logError(err, { method: "forgotPassword", email });
      throw parsed;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  // Update password dengan token reset
  const updatePassword = useCallback(async (
    tokenId: string,
    data: { password: string; confirmPassword: string }
  ) => {
    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      const response = await apiClient.auth.updatePassword(tokenId, data);
      return response.message;
    } catch (err) {
      const parsed = parseApiError(err);
      dispatch(setError(parsed.message));
      logError(err, { method: "updatePassword", tokenId });
      throw parsed;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  // Ambil data profil user dari server
  const getUserProfile = useCallback(async (userId: string) => {
    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      const response = await apiClient.auth.getUserProfile(userId);
      if (response.data) {
        dispatch(setUser(response.data));
      }
      return response.data;
    } catch (err) {
      const parsed = parseApiError(err);
      dispatch(setError(parsed.message));
      logError(err, { method: "getUserProfile", userId });
      throw parsed;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  return {
    // Metode Auth
    signUp,
    signIn,
    logout,
    forgotPassword,
    updatePassword,
    getUserProfile,

    // State Auth
    user,
    isAuthenticated,
    isLoading,
    error,
  };
};

export default useAuth;
