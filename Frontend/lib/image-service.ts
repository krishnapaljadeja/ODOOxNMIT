import { ApiService, API_ENDPOINTS } from "./api";

// Types for image operations
export interface ImageUploadResponse {
  statusCode: number;
  data: string; // "Images uploaded successfully"
  message: {
    images: string[];
    count: number;
  };
  success: boolean;
}

export interface SingleImageUploadResponse {
  statusCode: number;
  data: string; // "Image uploaded successfully"
  message: {
    imageUrl: string;
    publicId: string;
  };
  success: boolean;
}

// Image service class
export class ImageService {
  // Upload multiple images
  static async uploadImages(files: File[]): Promise<ImageUploadResponse> {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("images", file);
    });

    return ApiService.post<ImageUploadResponse>(
      "/api/images/upload-multiple",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  }

  // Upload single image
  static async uploadSingleImage(
    file: File
  ): Promise<SingleImageUploadResponse> {
    const formData = new FormData();
    formData.append("image", file);

    return ApiService.post<SingleImageUploadResponse>(
      "/api/images/upload-single",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  }

  // Delete image by public ID
  static async deleteImage(
    publicId: string
  ): Promise<{ statusCode: number; message: string; success: boolean }> {
    return ApiService.delete<{
      statusCode: number;
      message: string;
      success: boolean;
    }>(`/api/images/delete/${publicId}`);
  }
}

// Export the service as default
export default ImageService;
