import { AxiosInstance } from "axios";
import { logError, parseApiError } from "@utils/errors/errorHandler";
import type { ApiResponse, Group, GroupDetail, OwnGroupResponse, Person } from "./types";

export class GroupApi {
	private client: AxiosInstance;

	constructor(client: AxiosInstance) {
		this.client = client;
	}

	/**
	 * Get all discoverable groups
	 * @returns Promise resolving to list of groups
	 */
	async getGroups(): Promise<Group[]> {
		try {
			const response = await this.client.get<ApiResponse<Group[]>>("/groups");
			return response.data.data;
		} catch (error) {
			logError(error, { method: "getGroups" });
			throw parseApiError(error);
		}
	}

	/**
	 * Get detail of a specific group
	 * @param id - Group ID
	 * @returns Promise resolving to group details
	 */
	async getGroupById(id: string): Promise<GroupDetail> {
		try {
			const response = await this.client.get<ApiResponse<GroupDetail>>(`/groups/${id}`);
			return response.data.data;
		} catch (error) {
			logError(error, { method: "getGroupById", groupId: id });
			throw parseApiError(error);
		}
	}

	/**
	 * Get groups owned or joined by the current user
	 * @returns Promise resolving to user's groups
	 */
	async getOwnGroups(): Promise<OwnGroupResponse> {
		try {
			const response = await this.client.get<ApiResponse<OwnGroupResponse>>("/groups/own-groups");
			return response.data.data;
		} catch (error) {
			logError(error, { method: "getOwnGroups" });
			throw parseApiError(error);
		}
	}

	/**
	 * Get all people/users
	 * @returns Promise resolving to list of people
	 */
	async getPeoples(): Promise<Person[]> {
		try {
			const response = await this.client.get<ApiResponse<Person[]>>("/groups/peoples");
			return response.data.data;
		} catch (error) {
			logError(error, { method: "getPeoples" });
			throw parseApiError(error);
		}
	}
}

export default GroupApi;
