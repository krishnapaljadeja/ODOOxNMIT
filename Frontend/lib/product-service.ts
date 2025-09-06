import { ApiService, API_ENDPOINTS } from "./api";

// Types for product operations
export interface CreateProductData {
  title: string;
  description: string;
  category: string;
  price: number;
  imageUrl?: string;
  images?: string[];
}

export interface ProductFilters {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  imageUrl?: string;
  images: string[];
  sellerId: string;
  createdAt: string;
  updatedAt: string;
  seller: {
    id: string;
    username: string;
  };
}

export interface ProductResponse {
  statusCode: number;
  data: string; // "Product created successfully" or similar
  message: {
    product: Product;
  };
  success: boolean;
}

export interface ProductsListResponse {
  statusCode: number;
  data: string; // "Products retrieved successfully"
  message: {
    products: Product[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalCount: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
  success: boolean;
}

export interface CategoriesResponse {
  statusCode: number;
  message: string;
  data: {
    categories: string[];
  };
  success: boolean;
}

// Product service class
export class ProductService {
  // Create a new product
  static async createProduct(
    productData: CreateProductData
  ): Promise<ProductResponse> {
    return ApiService.post<ProductResponse>(
      API_ENDPOINTS.PRODUCTS.CREATE,
      productData
    );
  }

  // Get all products with optional filters
  static async getProducts(params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
  }): Promise<ProductsListResponse> {
    const queryParams = new URLSearchParams();

    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.category) queryParams.append("category", params.category);
    if (params?.search) queryParams.append("search", params.search);
    if (params?.minPrice)
      queryParams.append("minPrice", params.minPrice.toString());
    if (params?.maxPrice)
      queryParams.append("maxPrice", params.maxPrice.toString());
    if (params?.sortBy) queryParams.append("sortBy", params.sortBy);

    const url = queryParams.toString()
      ? `${API_ENDPOINTS.PRODUCTS.LIST}?${queryParams.toString()}`
      : API_ENDPOINTS.PRODUCTS.LIST;

    return ApiService.get<ProductsListResponse>(url);
  }

  // Get single product by ID
  static async getProductById(id: string): Promise<ProductResponse> {
    return ApiService.get<ProductResponse>(API_ENDPOINTS.PRODUCTS.GET(id));
  }

  // Get user's own products
  static async getMyProducts(params?: {
    page?: number;
    limit?: number;
  }): Promise<ProductsListResponse> {
    const queryParams = new URLSearchParams();

    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());

    const url = queryParams.toString()
      ? `${API_ENDPOINTS.PRODUCTS.MY_LISTINGS}?${queryParams.toString()}`
      : API_ENDPOINTS.PRODUCTS.MY_LISTINGS;

    return ApiService.get<ProductsListResponse>(url);
  }

  // Update product
  static async updateProduct(
    id: string,
    productData: Partial<CreateProductData>
  ): Promise<ProductResponse> {
    return ApiService.put<ProductResponse>(
      API_ENDPOINTS.PRODUCTS.UPDATE(id),
      productData
    );
  }

  // Delete product
  static async deleteProduct(
    id: string
  ): Promise<{ statusCode: number; message: string; success: boolean }> {
    return ApiService.delete<{
      statusCode: number;
      message: string;
      success: boolean;
    }>(API_ENDPOINTS.PRODUCTS.DELETE(id));
  }

  // Get available categories
  static async getCategories(): Promise<CategoriesResponse> {
    return ApiService.get<CategoriesResponse>(
      API_ENDPOINTS.PRODUCTS.CATEGORIES
    );
  }
}

// Export the service as default
export default ProductService;
