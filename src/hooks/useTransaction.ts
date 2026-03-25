import { useMemo, useState } from "react";
import { ApiClient } from "@services/api/client/apiClient";
import { parseApiError } from "@utils/errors/errorHandler";

export const useTransaction = () => {
    const apiClient = useMemo(() => new ApiClient(), []);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const transactionMethods = useMemo(() => ({
        getRevenue: async () => {
            setIsLoading(true);
            setError(null);
            try {
                const data = await apiClient.transaction.getRevenue();
                return data;
            } catch (err: any) {
                const parsed = parseApiError(err);
                setError(parsed.message);
                throw err;
            } finally {
                setIsLoading(false);
            }
        },
        getPayouts: async () => {
            setIsLoading(true);
            setError(null);
            try {
                const data = await apiClient.transaction.getPayouts();
                return data;
            } catch (err: any) {
                const parsed = parseApiError(err);
                setError(parsed.message);
                throw err;
            } finally {
                setIsLoading(false);
            }
        }
    }), [apiClient]);

    return {
        ...transactionMethods,
        isLoading,
        error
    };
};

export default useTransaction;
