import { useMemo, useState } from "react";
import { ApiClient } from "@services/api/client/apiClient";
import type { Group, OwnGroupResponse } from "@services/api/group/types";
import { parseApiError } from "@utils/errors/errorHandler";

export const useGroup = () => {
    const apiClient = useMemo(() => new ApiClient(), []);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const groupMethods = useMemo(() => ({
        getGroups: async () => {
            setIsLoading(true);
            setError(null);
            try {
                const data = await apiClient.group.getGroups();
                return data;
            } catch (err: any) {
                const parsed = parseApiError(err);
                setError(parsed.message);
                throw err;
            } finally {
                setIsLoading(false);
            }
        },
        getGroupById: async (id: string) => {
            setIsLoading(true);
            setError(null);
            try {
                const data = await apiClient.group.getGroupById(id);
                return data;
            } catch (err: any) {
                const parsed = parseApiError(err);
                setError(parsed.message);
                throw err;
            } finally {
                setIsLoading(false);
            }
        },
        getOwnGroups: async () => {
            setIsLoading(true);
            setError(null);
            try {
                const data = await apiClient.group.getOwnGroups();
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
        ...groupMethods,
        isLoading,
        error
    };
};

export default useGroup;
