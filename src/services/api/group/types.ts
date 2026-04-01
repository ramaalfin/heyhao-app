export type GroupType = "FREE" | "PAID";

export interface Group {
	id: string;
	name: string;
	about: string;
	type: GroupType;
	room: {
		_count: {
			members: number;
		};
	};
	photo_url: string;
}

export interface GroupDetail extends Group {
	photo: string;
	benefit: string[];
	price: number;
	room_id: string;
	created_at: string;
	assets: any[]; // Or Asset[] if we know the structure
	room: {
		id: string;
		name: string;
		is_group: boolean;
		created_by: string;
		created_at: string;
		members: any[];
		_count: {
			members: number;
		};
	};
	is_join: boolean;
}

export interface OwnGroupList {
	id: string;
	photo_url: string;
	name: string;
	type: GroupType;
	total_members: number;
}

export interface OwnGroupResponse {
	lists: OwnGroupList[];
	paid_groups: number;
	free_groups: number;
	total_members: number;
}

export interface Person {
	id: string;
	name: string;
	created_at: string;
	photo_url: string;
}

export interface GroupCreateRequest {
	name: string;
	about: string;
	photo: any; // Image picked from library
}

export interface GroupPaidCreateRequest extends GroupCreateRequest {
	price: string;
	benefit: string[];
	assets: any[]; // Multiple files
}

export interface JoinGroupRequest {
	group_id: string;
}

export interface ApiResponse<T = any> {
	success: boolean;
	message: string;
	data: T;
}
