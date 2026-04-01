/**
 * useGroup Hook
 *
 * Hook untuk semua operasi yang berhubungan dengan Group.
 * - Menggunakan singleton apiClient (tidak buat instance baru setiap render)
 * - Mengelola state loading/error secara lokal
 */

import { useState, useCallback } from "react";
import apiClient from "@services/api/client/apiClient";
import { parseApiError } from "@utils/errors/errorHandler";

export const useGroup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Ambil semua group yang bisa di-discover
  const getGroups = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      return await apiClient.group.getGroups();
    } catch (err) {
      const parsed = parseApiError(err);
      setError(parsed.message);
      throw parsed;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Ambil detail satu group berdasarkan ID
  const getGroupById = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      return await apiClient.group.getGroupById(id);
    } catch (err) {
      const parsed = parseApiError(err);
      setError(parsed.message);
      throw parsed;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Ambil group milik / yang diikuti user saat ini
  const getOwnGroups = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      return await apiClient.group.getOwnGroups();
    } catch (err) {
      const parsed = parseApiError(err);
      setError(parsed.message);
      throw parsed;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Ambil daftar semua pengguna (people)
  const getPeoples = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      return await apiClient.group.getPeoples();
    } catch (err) {
      const parsed = parseApiError(err);
      setError(parsed.message);
      throw parsed;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    getGroups,
    getGroupById,
    getOwnGroups,
    getPeoples,
    isLoading,
    error,
  };
};

export default useGroup;
