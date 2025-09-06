import { ApiService, API_ENDPOINTS } from "./api";

// Types for authentication
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  email: string;
  password: string;
  username: string;
}

export interface User {
  id: string;
  email: string;
  username: string;
  avatar?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: User;
    token: string;
  };
  error?: any;
}

// Backend API response types
interface BackendAuthResponse {
  statusCode: number;
  data: string; // "Login successful"
  message: {
    user: User;
  };
  success: boolean;
}

interface BackendProfileResponse {
  statusCode: number;
  data: string;
  message: {
    user: User;
  };
  success: boolean;
}

// Auth Service Class
export class AuthService {
  // Login user
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await ApiService.post<BackendAuthResponse>(
        API_ENDPOINTS.AUTH.LOGIN,
        credentials
      );

      // Store user data (token is handled by HTTP-only cookie)
      if (response.message?.user) {
        localStorage.setItem(
          "ecofinds-user",
          JSON.stringify(response.message.user)
        );
        // Set a flag to indicate user is authenticated
        localStorage.setItem("ecofinds-authenticated", "true");
      }

      return {
        success: true,
        message: "Login successful",
        data: {
          user: response.message.user,
          token: "cookie-based", // Token is in HTTP-only cookie
        },
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Login failed",
        error,
      };
    }
  }

  // Signup user
  static async signup(credentials: SignupCredentials): Promise<AuthResponse> {
    try {
      const response = await ApiService.post<BackendAuthResponse>(
        API_ENDPOINTS.AUTH.SIGNUP,
        credentials
      );

      // Store user data (token is handled by HTTP-only cookie)
      if (response.message?.user) {
        localStorage.setItem(
          "ecofinds-user",
          JSON.stringify(response.message.user)
        );
        // Set a flag to indicate user is authenticated
        localStorage.setItem("ecofinds-authenticated", "true");
      }

      return {
        success: true,
        message: "Signup successful",
        data: {
          user: response.message.user,
          token: "cookie-based", // Token is in HTTP-only cookie
        },
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Signup failed",
        error,
      };
    }
  }

  // Logout user
  static async logout(): Promise<AuthResponse> {
    try {
      // Call logout endpoint
      await ApiService.post(API_ENDPOINTS.AUTH.LOGOUT);

      // Clear local storage
      localStorage.removeItem("ecofinds-authenticated");
      localStorage.removeItem("ecofinds-user");

      return {
        success: true,
        message: "Logout successful",
      };
    } catch (error: any) {
      // Even if API call fails, clear local storage
      localStorage.removeItem("ecofinds-authenticated");
      localStorage.removeItem("ecofinds-user");

      return {
        success: true,
        message: "Logout successful (local)",
        error,
      };
    }
  }

  // Get user profile
  static async getProfile(): Promise<AuthResponse> {
    try {
      const response = await ApiService.get<BackendProfileResponse>(
        API_ENDPOINTS.AUTH.PROFILE
      );

      // Update stored user data
      if (response.message?.user) {
        localStorage.setItem(
          "ecofinds-user",
          JSON.stringify(response.message.user)
        );
      }

      return {
        success: true,
        message: "Profile retrieved successfully",
        data: {
          user: response.message.user,
          token: AuthService.getToken() || "",
        },
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Failed to get profile",
        error,
      };
    }
  }

  // Update user profile
  static async updateProfile(
    profileData: Partial<User>
  ): Promise<AuthResponse> {
    try {
      const response = await ApiService.put<BackendProfileResponse>(
        API_ENDPOINTS.AUTH.PROFILE,
        profileData
      );

      // Update stored user data
      if (response.message?.user) {
        localStorage.setItem(
          "ecofinds-user",
          JSON.stringify(response.message.user)
        );
      }

      return {
        success: true,
        message: "Profile updated successfully",
        data: {
          user: response.message.user,
          token: AuthService.getToken() || "",
        },
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Failed to update profile",
        error,
      };
    }
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    const isAuth = localStorage.getItem("ecofinds-authenticated");
    const user = localStorage.getItem("ecofinds-user");
    return !!(isAuth === "true" && user);
  }

  // Get current user from localStorage
  static getCurrentUser(): User | null {
    try {
      const userStr = localStorage.getItem("ecofinds-user");
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error("Error parsing user data:", error);
      return null;
    }
  }

  // Get current token (cookie-based, so return placeholder)
  static getToken(): string | null {
    return localStorage.getItem("ecofinds-authenticated") === "true"
      ? "cookie-based"
      : null;
  }

  // Validate token by making a test request
  static async validateToken(): Promise<boolean> {
    try {
      await ApiService.get(API_ENDPOINTS.AUTH.PROFILE);
      return true;
    } catch (error) {
      return false;
    }
  }
}
