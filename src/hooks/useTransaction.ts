/**
 * useTransaction Hook
 *
 * Hook untuk operasi transaksi/revenue.
 * Menggunakan singleton apiClient dan useCallback untuk stabilitas referensi.
 */

import { useState, useCallback } from "react";
import apiClient from "@services/api/client/apiClient";
import { parseApiError } from "@utils/errors/errorHandler";

export const useTransaction = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Ambil data pendapatan user
  const getRevenue = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      return await apiClient.transaction.getRevenue();
    } catch (err) {
      const parsed = parseApiError(err);
      setError(parsed.message);
      throw parsed;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Ambil riwayat payout user
  const getPayouts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      return await apiClient.transaction.getPayouts();
    } catch (err) {
      const parsed = parseApiError(err);
      setError(parsed.message);
      throw parsed;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Membuat transaksi join grup berbayar
  const createTransaction = useCallback(async (group_id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      return await apiClient.transaction.createTransaction(group_id);
    } catch (err) {
      const parsed = parseApiError(err);
      setError(parsed.message);
      throw parsed;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    getRevenue,
    getPayouts,
    createTransaction,
    isLoading,
    error,
  };
};

export default useTransaction;
