/**
 * Auth SOP API Client.
 */

import type {ApiClient} from "../apiClient";

export const get = (client: ApiClient) => {
	return client.client.get("/facts?limit=1");
};
