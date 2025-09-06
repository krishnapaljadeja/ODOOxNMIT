import { ApiService, API_ENDPOINTS } from "./api";

// Types for purchase operations
export interface PurchaseItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  product: {
    id: string;
    title: string;
    description: string;
    category: string;
    imageUrl: string;
  };
}

export interface Purchase {
  id: string;
  buyerId: string;
  totalAmount: number;
  purchaseDate: string;
  status: string;
  items: PurchaseItem[];
}

export interface PurchaseHistoryResponse {
  statusCode: number;
  data: string;
  message: {
    purchases: Purchase[];
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

export interface PurchaseDetailsResponse {
  statusCode: number;
  data: string;
  message: {
    purchase: Purchase;
  };
  success: boolean;
}

export interface PurchaseStatsResponse {
  statusCode: number;
  data: string;
  message: {
    stats: {
      totalPurchases: number;
      totalSpent: number;
      averageOrderValue: number;
      recentPurchases: Array<{
        id: string;
        totalAmount: number;
        purchaseDate: string;
        status: string;
      }>;
    };
  };
  success: boolean;
}

// Purchase service class
export class PurchaseService {
  // Get user's purchase history
  static async getPurchaseHistory(params?: {
    page?: number;
    limit?: number;
  }): Promise<PurchaseHistoryResponse> {
    const queryParams = new URLSearchParams();

    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());

    const url = queryParams.toString()
      ? `${API_ENDPOINTS.PURCHASES.HISTORY}?${queryParams.toString()}`
      : API_ENDPOINTS.PURCHASES.HISTORY;

    return ApiService.get<PurchaseHistoryResponse>(url);
  }

  // Get single purchase details
  static async getPurchaseDetails(
    purchaseId: string
  ): Promise<PurchaseDetailsResponse> {
    return ApiService.get<PurchaseDetailsResponse>(
      API_ENDPOINTS.PURCHASES.GET(purchaseId)
    );
  }

  // Get purchase statistics
  static async getPurchaseStats(): Promise<PurchaseStatsResponse> {
    return ApiService.get<PurchaseStatsResponse>(API_ENDPOINTS.PURCHASES.STATS);
  }

  // Process purchase (convert cart to purchase)
  static async processPurchase(): Promise<{
    statusCode: number;
    data: string;
    message: {
      purchase: Purchase;
    };
    success: boolean;
  }> {
    return ApiService.post<{
      statusCode: number;
      data: string;
      message: {
        purchase: Purchase;
      };
      success: boolean;
    }>(API_ENDPOINTS.PURCHASES.PROCESS);
  }
}

// Export the service as default
export default PurchaseService;
