import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Enable cookies for authentication
});

// Request interceptor (cookies are handled automatically with withCredentials: true)
apiClient.interceptors.request.use(
  (config) => {
    // Cookies are automatically included with withCredentials: true
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    // Handle common error cases
    if (error.response?.status === 401) {
      // Token expired or invalid - clear auth data
      localStorage.removeItem("ecofinds-authenticated");
      localStorage.removeItem("ecofinds-user");
      // Redirect to login if not already there
      if (
        typeof window !== "undefined" &&
        !window.location.pathname.includes("/login")
      ) {
        window.location.href = "/login";
      }
    }

    // Return a consistent error format
    return Promise.reject({
      message:
        error.response?.data?.message || error.message || "An error occurred",
      status: error.response?.status || 500,
      data: error.response?.data || null,
    });
  }
);

// API Service Class
export class ApiService {
  // Generic request method
  static async request<T>(config: AxiosRequestConfig): Promise<T> {
    try {
      const response = await apiClient.request<T>(config);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  // GET request
  static async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ method: "GET", url, ...config });
  }

  // POST request
  static async post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return this.request<T>({ method: "POST", url, data, ...config });
  }

  // PUT request
  static async put<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return this.request<T>({ method: "PUT", url, data, ...config });
  }

  // DELETE request
  static async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ method: "DELETE", url, ...config });
  }
}

// Export the configured axios instance for direct use if needed
export default apiClient;

// Export API endpoints as constants
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: "/auth/login",
    SIGNUP: "/auth/signup",
    LOGOUT: "/auth/logout",
    PROFILE: "/auth/profile",
    PUBLIC_PROFILE: (userId: string) => `/auth/public-profile/${userId}`,
  },

  // Product endpoints
  PRODUCTS: {
    LIST: "/api/products",
    CATEGORIES: "/api/products/categories",
    CREATE: "/api/products",
    GET: (id: string) => `/api/products/${id}`,
    UPDATE: (id: string) => `/api/products/${id}`,
    DELETE: (id: string) => `/api/products/${id}`,
    MY_LISTINGS: "/api/products/my-listings",
  },

  // Cart endpoints
  CART: {
    ADD: "/api/cart/add",
    GET: "/api/cart",
    UPDATE: "/api/cart/update",
    REMOVE: (productId: string) => `/api/cart/remove/${productId}`,
    CLEAR: "/api/cart/clear",
  },

  // Purchase endpoints
  PURCHASES: {
    PROCESS: "/api/purchases/process",
    HISTORY: "/api/purchases/history",
    STATS: "/api/purchases/stats",
    GET: (purchaseId: string) => `/api/purchases/${purchaseId}`,
  },

  // Health check
  HEALTH: "/api/health",
} as const;
