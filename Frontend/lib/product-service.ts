import { ApiService, API_ENDPOINTS } from "./api";

// Backend response types
interface BackendProductResponse {
  statusCode: number;
  message: string;
  data: {
    product: Product;
  };
  success: boolean;
}

interface BackendProductsResponse {
  statusCode: number;
  message: string;
  data: {
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

interface BackendCategoriesResponse {
  statusCode: number;
  message: string;
  data: {
    categories: string[];
  };
  success: boolean;
}

// Product types
export interface Product {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  imageUrl?: string;
  images?: string[];
  sellerId: string;
  createdAt: string;
  updatedAt: string;
  seller: {
    id: string;
    username: string;
  };
}

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
  sortBy?: "newest" | "oldest" | "price-low" | "price-high";
}

export interface ProductListResponse {
  products: Product[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Product Service Class
export class ProductService {
  // Get all products with filters
  static async getProducts(
    filters: ProductFilters = {}
  ): Promise<ProductListResponse> {
    try {
      const params = new URLSearchParams();

      if (filters.page) params.append("page", filters.page.toString());
      if (filters.limit) params.append("limit", filters.limit.toString());
      if (filters.category) params.append("category", filters.category);
      if (filters.search) params.append("search", filters.search);
      if (filters.minPrice)
        params.append("minPrice", filters.minPrice.toString());
      if (filters.maxPrice)
        params.append("maxPrice", filters.maxPrice.toString());
      if (filters.sortBy) params.append("sortBy", filters.sortBy);

      const queryString = params.toString();
      const url = queryString
        ? `${API_ENDPOINTS.PRODUCTS.LIST}?${queryString}`
        : API_ENDPOINTS.PRODUCTS.LIST;

      const response = await ApiService.get<BackendProductsResponse>(url);
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || "Failed to fetch products");
    }
  }

  // Get single product by ID
  static async getProductById(id: string): Promise<Product> {
    try {
      const response = await ApiService.get<BackendProductResponse>(
        API_ENDPOINTS.PRODUCTS.GET(id)
      );
      return response.data.product;
    } catch (error: any) {
      throw new Error(error.message || "Failed to fetch product");
    }
  }

  // Create new product
  static async createProduct(productData: CreateProductData): Promise<Product> {
    try {
      const response = await ApiService.post<BackendProductResponse>(
        API_ENDPOINTS.PRODUCTS.CREATE,
        productData
      );
      return response.data.product;
    } catch (error: any) {
      throw new Error(error.message || "Failed to create product");
    }
  }

  // Update product
  static async updateProduct(
    id: string,
    productData: Partial<CreateProductData>
  ): Promise<Product> {
    try {
      const response = await ApiService.put<BackendProductResponse>(
        API_ENDPOINTS.PRODUCTS.UPDATE(id),
        productData
      );
      return response.data.product;
    } catch (error: any) {
      throw new Error(error.message || "Failed to update product");
    }
  }

  // Delete product
  static async deleteProduct(id: string): Promise<void> {
    try {
      await ApiService.delete(API_ENDPOINTS.PRODUCTS.DELETE(id));
    } catch (error: any) {
      throw new Error(error.message || "Failed to delete product");
    }
  }

  // Get user's own products
  static async getMyProducts(
    filters: { page?: number; limit?: number } = {}
  ): Promise<ProductListResponse> {
    try {
      const params = new URLSearchParams();
      if (filters.page) params.append("page", filters.page.toString());
      if (filters.limit) params.append("limit", filters.limit.toString());

      const queryString = params.toString();
      const url = queryString
        ? `${API_ENDPOINTS.PRODUCTS.MY_LISTINGS}?${queryString}`
        : API_ENDPOINTS.PRODUCTS.MY_LISTINGS;

      const response = await ApiService.get<BackendProductsResponse>(url);
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || "Failed to fetch your products");
    }
  }

  // Get product categories
  static async getCategories(): Promise<string[]> {
    try {
      const response = await ApiService.get<BackendCategoriesResponse>(
        API_ENDPOINTS.PRODUCTS.CATEGORIES
      );
      return response.data.categories;
    } catch (error: any) {
      throw new Error(error.message || "Failed to fetch categories");
    }
  }
}
