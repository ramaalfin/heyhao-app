import { AxiosInstance } from "axios";
import { logError, parseApiError } from "@utils/errors/errorHandler";
import type { ApiResponse, RevenueData, Payout } from "./types";

export class TransactionApi {
    private client: AxiosInstance;

    constructor(client: AxiosInstance) {
        this.client = client;
    }

    /**
     * Get revenue statistics for the current user
     * @returns Promise resolving to revenue data
     */
    async getRevenue(): Promise<RevenueData> {
        try {
            const response = await this.client.get<ApiResponse<RevenueData>>("/transactions/revenue");
            return response.data.data;
        } catch (error) {
            logError(error, { method: "getRevenue" });
            throw parseApiError(error);
        }
    }

    /**
     * Get payout history for the current user
     * @returns Promise resolving to list of payouts
     */
    async getPayouts(): Promise<Payout[]> {
        try {
            const response = await this.client.get<ApiResponse<Payout[]>>("/transactions/payouts");
            return response.data.data;
        } catch (error) {
            logError(error, { method: "getPayouts" });
            throw parseApiError(error);
        }
    }
}

export default TransactionApi;
