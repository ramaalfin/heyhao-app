/**
 * Photo Uploader Service
 * 
 * Handles image selection from camera or gallery and prepares FormData for upload.
 */

import {
	Asset,
	ImagePickerResponse,
	launchCamera,
	launchImageLibrary,
	PhotoQuality,
} from "react-native-image-picker";

import type { SignUpData } from "../api/auth/types";

/**
 * Photo validation result
 */
export interface PhotoValidationResult {
    isValid: boolean;
    error?: string;
}

/**
 * Photo selection options
 */
export interface PhotoSelectionOptions {
    maxWidth?: number;
    maxHeight?: number;
    quality?: PhotoQuality;
    mediaType?: "photo" | "video" | "mixed";
}

/**
 * Photo Uploader class
 */
class PhotoUploader {
	private readonly MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
	private readonly ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png"];

	/**
     * Launches image picker to select photo from gallery
     * @param options - Photo selection options
     * @returns Promise resolving to selected photo asset
     */
	async selectFromGallery(
		options: PhotoSelectionOptions = {}
	): Promise<Asset | null> {
		const defaultOptions = {
			mediaType: "photo" as const,
			maxWidth: 1024,
			maxHeight: 1024,
			quality: 0.8 as const,
			...options,
		};

		const result: ImagePickerResponse = await launchImageLibrary(defaultOptions);

		if (result.didCancel) {
			return null;
		}

		if (result.errorCode) {
			throw new Error(result.errorMessage || "Failed to select photo");
		}

		if (!result.assets || result.assets.length === 0) {
			return null;
		}

		return result.assets[0];
	}

	/**
     * Launches camera to take a photo
     * @param options - Photo selection options
     * @returns Promise resolving to captured photo asset
     */
	async selectFromCamera(
		options: PhotoSelectionOptions = {}
	): Promise<Asset | null> {
		const defaultOptions = {
			mediaType: "photo" as const,
			maxWidth: 1024,
			maxHeight: 1024,
			quality: 0.8 as const,
			...options,
		};

		const result: ImagePickerResponse = await launchCamera(defaultOptions);

		if (result.didCancel) {
			return null;
		}

		if (result.errorCode) {
			throw new Error(result.errorMessage || "Failed to capture photo");
		}

		if (!result.assets || result.assets.length === 0) {
			return null;
		}

		return result.assets[0];
	}

	/**
     * Validates photo asset
     * @param photo - Photo asset to validate
     * @returns Validation result
     */
	validatePhoto(photo: Asset | null): PhotoValidationResult {
		if (!photo) {
			return {
				isValid: false,
				error: "Photo is required",
			};
		}

		// Check file size
		if (photo.fileSize && photo.fileSize > this.MAX_FILE_SIZE) {
			return {
				isValid: false,
				error: "Photo size must be less than 5MB",
			};
		}

		// Check file type
		if (photo.type && !this.ALLOWED_TYPES.includes(photo.type)) {
			return {
				isValid: false,
				error: "Photo must be JPEG or PNG format",
			};
		}

		return {
			isValid: true,
		};
	}

	/**
     * Prepares FormData for group creation/update
     * @param photo - Photo asset
     * @param groupData - Group metadata
     * @param assets - Optional extra assets for paid groups
     * @returns FormData ready for upload
     */
	prepareGroupFormData(photo?: Asset, groupData?: Record<string, any>, assets?: Asset[]): FormData {
		const formData = new FormData();

		// Append metadata
		if (groupData) {
			Object.keys(groupData).forEach(key => {
				if (Array.isArray(groupData[key])) {
					groupData[key].forEach((item: string) => {
						formData.append(`${key}[]`, item);
					});
				} else {
					formData.append(key, groupData[key]);
				}
			});
		}

		// Append photo
		if (photo) {
			formData.append("photo", {
				uri: photo.uri,
				type: photo.type || "image/jpeg",
				name: photo.fileName || `photo_${Date.now()}.jpg`,
			} as any);
		}

		// Append multiple assets if provided
		if (assets && assets.length > 0) {
			assets.forEach((asset, index) => {
				formData.append("assets", {
					uri: asset.uri,
					type: asset.type || "application/octet-stream",
					name: asset.fileName || `asset_${index}_${Date.now()}`,
				} as any);
			});
		}

		return formData;
	}

	/**
     * Prepares FormData for sign-up request with photo
     * @param photo - Photo asset
     * @param userData - User registration data
     * @returns FormData ready for upload
     */
	prepareFormData(photo: Asset, userData: SignUpData): FormData {
		const formData = new FormData();

		// Append user data
		formData.append("name", userData.name);
		formData.append("email", userData.email);
		formData.append("password", userData.password);

		// Append photo
		formData.append("photo", {
			uri: photo.uri,
			type: photo.type || "image/jpeg",
			name: photo.fileName || `photo_${Date.now()}.jpg`,
		} as any);

		return formData;
	}
}

// Export singleton instance
export const photoUploader = new PhotoUploader();
