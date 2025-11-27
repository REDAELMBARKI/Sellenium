export interface Order {
  id: string;
  date: string;
  customer: string;
  avatar: string;
  items: number;
  total: number;
  payment: 'Success' | 'Pending';
  delivery: string;
  status: 'delivered' | 'pending' | 'shipped' | 'processing' | 'cancelled' | 'returned';
}

export interface Stats {
  total: number;
  cancelled: number;
  pending: number;
  returned: number;
}
