import { AxiosInstance } from "axios";
import { logError, parseApiError } from "@utils/errors/errorHandler";
import type { ApiResponse, RevenueData, Payout, CreateTransactionResponse } from "./types";

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

    /**
     * Create a new transaction to join a paid group
     * @param group_id ID of the group to join
     * @returns Promise resolving to midtrans response (token, redirect_url)
     */
    async createTransaction(group_id: string): Promise<CreateTransactionResponse> {
        try {
            const response = await this.client.post<ApiResponse<CreateTransactionResponse>>("/transactions", { group_id });
            return response.data.data;
        } catch (error) {
            logError(error, { method: "createTransaction" });
            throw parseApiError(error);
        }
    }
}

export default TransactionApi;
