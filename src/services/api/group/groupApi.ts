import { photoUploader } from "@services/media/photoUploader";
import { AxiosInstance } from "axios";
import { logError, parseApiError } from "@utils/errors/errorHandler";
import type { 
	ApiResponse, 
	Group, 
	GroupDetail, 
	OwnGroupResponse, 
	Person,
	GroupCreateRequest,
	GroupPaidCreateRequest
} from "./types";

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

	/**
	 * Create a free group
	 */
	async createFreeGroup(data: GroupCreateRequest): Promise<GroupDetail> {
		try {
			const formData = photoUploader.prepareGroupFormData(data.photo, {
				name: data.name,
				about: data.about,
			});
			const response = await this.client.post<ApiResponse<GroupDetail>>("/groups/free", formData, {
				headers: { "Content-Type": "multipart/form-data" },
			});
			return response.data.data;
		} catch (error) {
			logError(error, { method: "createFreeGroup" });
			throw parseApiError(error);
		}
	}

	/**
     * Update a free group
     */
	async updateFreeGroup(groupId: string, data: Partial<GroupCreateRequest>): Promise<GroupDetail> {
		try {
			const formData = photoUploader.prepareGroupFormData(data.photo, {
				name: data.name,
				about: data.about,
			});
			const response = await this.client.put<ApiResponse<GroupDetail>>(`/groups/free/${groupId}`, formData, {
				headers: { "Content-Type": "multipart/form-data" },
			});
			return response.data.data;
		} catch (error) {
			logError(error, { method: "updateFreeGroup", groupId });
			throw parseApiError(error);
		}
	}

	/**
	 * Create a paid group
	 */
	async createPaidGroup(data: GroupPaidCreateRequest): Promise<GroupDetail> {
		try {
			const formData = photoUploader.prepareGroupFormData(data.photo, {
				name: data.name,
				about: data.about,
				price: data.price,
				benefit: data.benefit,
			}, data.assets);
			const response = await this.client.post<ApiResponse<GroupDetail>>("/groups/paid", formData, {
				headers: { "Content-Type": "multipart/form-data" },
			});
			return response.data.data;
		} catch (error) {
			logError(error, { method: "createPaidGroup" });
			throw parseApiError(error);
		}
	}

	/**
	 * Update a paid group
	 */
	async updatePaidGroup(groupId: string, data: Partial<GroupPaidCreateRequest>): Promise<GroupDetail> {
		try {
			const formData = photoUploader.prepareGroupFormData(data.photo, {
				name: data.name,
				about: data.about,
				price: data.price,
				benefit: data.benefit,
			}, data.assets);
			const response = await this.client.put<ApiResponse<GroupDetail>>(`/groups/paid/${groupId}`, formData, {
				headers: { "Content-Type": "multipart/form-data" },
			});
			return response.data.data;
		} catch (error) {
			logError(error, { method: "updatePaidGroup", groupId });
			throw parseApiError(error);
		}
	}

	/**
	 * Join a free group
	 */
	async joinGroup(groupId: string): Promise<void> {
		try {
			await this.client.post("/groups/join", { group_id: groupId });
		} catch (error) {
			logError(error, { method: "joinGroup", groupId });
			throw parseApiError(error);
		}
	}

	/**
	 * Delete a group asset
	 */
	async deleteAsset(assetId: string): Promise<void> {
		try {
			await this.client.delete(`/groups/asset/${assetId}`);
		} catch (error) {
			logError(error, { method: "deleteAsset", assetId });
			throw parseApiError(error);
		}
	}
}

export default GroupApi;
