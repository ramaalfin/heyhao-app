export type TransactionType = "SUCCESS" | "PENDING" | "FAILED";
export type PayoutStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface LatestMember {
    id: string;
    owner_id: string;
    user_id: string;
    group_id: string;
    price: number;
    type: TransactionType;
    created_at: string;
    user: {
        name: string;
        photo_url: string;
    };
    group: {
        name: string;
        type: "FREE" | "PAID";
        photo_url: string;
    };
}

export interface RevenueData {
    balance: number;
    total_vip_groups: number;
    total_vip_members: number;
    total_revenue: number;
    latest_members: LatestMember[];
    transactionsPerMonths: {
        [key: string]: number;
    };
}

export interface Payout {
    id: string;
    user_id: string;
    amount: number;
    bank_name: string;
    bank_account_number: string;
    bank_account_name: string;
    status: PayoutStatus;
    proof: string | null;
    created_at: string;
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}
