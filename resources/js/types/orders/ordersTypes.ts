// Single statistic entry
interface OrderStatistic {
  count: number;
  change_percent: number;
}

// Statistics for all statuses
interface OrdersStatistics {
  total: OrderStatistic;
  pending: OrderStatistic;
  out_for_delivery: OrderStatistic;
  delivered: OrderStatistic;
  delivery_failed: OrderStatistic;
  returned: OrderStatistic;
  confirmed: OrderStatistic;
  canceled: OrderStatistic;
}

// Single order type (you can extend this with your actual Order fields)
interface Order {
  id: number;
  order_number: number;
  user_id: number;
  status: string;
  total_amount: number;
  paid: boolean;
  created_at: string;
  updated_at: string;
  // add more fields as needed
}

// Paginated orders
interface PaginatedOrders {
  data: Order[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

// Full response from backend
export interface OrdersResponse {
  orders: PaginatedOrders;
  statistics: OrdersStatistics;
}
