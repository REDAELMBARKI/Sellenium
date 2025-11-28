import { Order,SalesData ,  Product, Customer, InventoryProduct, StockByCategory, ReorderItem, SalesByCategory } from '@/types/dashboardTypes';

export const salesMetrics = {
  totalRevenue: 284750,
  totalOrders: 342,
  averageOrderValue: 832.60
};

export const salesTrendData: SalesData[] = [
  { date: '2025-11-22', revenue: 38500 },
  { date: '2025-11-23', revenue: 42300 },
  { date: '2025-11-24', revenue: 39800 },
  { date: '2025-11-25', revenue: 45200 },
  { date: '2025-11-26', revenue: 41900 },
  { date: '2025-11-27', revenue: 43050 },
  { date: '2025-11-28', revenue: 34000 },
];

export const topProducts: Product[] = [
  { id: '1', name: 'Wireless Headphones Pro', revenue: 45200 },
  { id: '2', name: 'Smart Watch Series 5', revenue: 38900 },
  { id: '3', name: 'Laptop Stand Adjustable', revenue: 32100 },
  { id: '4', name: 'Mechanical Keyboard RGB', revenue: 28500 },
  { id: '5', name: 'USB-C Hub 7-in-1', revenue: 24300 },
];

export const recentOrders: Order[] = [
  { id: 'ORD-1001', customerName: 'John Smith', amount: 1249.99, status: 'completed', date: '2025-11-28' },
  { id: 'ORD-1002', customerName: 'Sarah Johnson', amount: 849.50, status: 'pending', date: '2025-11-28' },
  { id: 'ORD-1003', customerName: 'Michael Brown', amount: 2199.00, status: 'completed', date: '2025-11-27' },
  { id: 'ORD-1004', customerName: 'Emily Davis', amount: 599.99, status: 'completed', date: '2025-11-27' },
  { id: 'ORD-1005', customerName: 'David Wilson', amount: 1599.00, status: 'cancelled', date: '2025-11-27' },
  { id: 'ORD-1006', customerName: 'Lisa Anderson', amount: 749.99, status: 'pending', date: '2025-11-26' },
  { id: 'ORD-1007', customerName: 'James Taylor', amount: 999.99, status: 'completed', date: '2025-11-26' },
];

export const mockCustomers: Customer[] = [
  {
    id: 'CUST-001',
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '+1 (555) 123-4567',
    totalPurchases: 4599.97,
    status: 'active',
    joinDate: '2024-03-15',
    orders: [
      { id: 'ORD-1001', customerName: 'John Smith', amount: 1249.99, status: 'completed', date: '2025-11-28' },
      { id: 'ORD-0950', customerName: 'John Smith', amount: 1899.99, status: 'completed', date: '2025-10-15' },
      { id: 'ORD-0823', customerName: 'John Smith', amount: 749.99, status: 'completed', date: '2025-08-20' },
      { id: 'ORD-0701', customerName: 'John Smith', amount: 700.00, status: 'completed', date: '2025-06-10' },
    ],
  },
  {
    id: 'CUST-002',
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    phone: '+1 (555) 234-5678',
    totalPurchases: 3249.49,
    status: 'active',
    joinDate: '2024-05-22',
    orders: [
      { id: 'ORD-1002', customerName: 'Sarah Johnson', amount: 849.50, status: 'pending', date: '2025-11-28' },
      { id: 'ORD-0921', customerName: 'Sarah Johnson', amount: 1199.99, status: 'completed', date: '2025-09-12' },
      { id: 'ORD-0804', customerName: 'Sarah Johnson', amount: 1200.00, status: 'completed', date: '2025-07-05' },
    ],
  },
  {
    id: 'CUST-003',
    name: 'Michael Brown',
    email: 'mbrown@example.com',
    phone: '+1 (555) 345-6789',
    totalPurchases: 5798.00,
    status: 'active',
    joinDate: '2023-11-10',
    orders: [
      { id: 'ORD-1003', customerName: 'Michael Brown', amount: 2199.00, status: 'completed', date: '2025-11-27' },
      { id: 'ORD-0899', customerName: 'Michael Brown', amount: 1599.00, status: 'completed', date: '2025-08-01' },
      { id: 'ORD-0712', customerName: 'Michael Brown', amount: 2000.00, status: 'completed', date: '2025-05-20' },
    ],
  },
  {
    id: 'CUST-004',
    name: 'Emily Davis',
    email: 'emily.davis@example.com',
    phone: '+1 (555) 456-7890',
    totalPurchases: 1799.98,
    status: 'active',
    joinDate: '2024-08-03',
    orders: [
      { id: 'ORD-1004', customerName: 'Emily Davis', amount: 599.99, status: 'completed', date: '2025-11-27' },
      { id: 'ORD-0888', customerName: 'Emily Davis', amount: 1199.99, status: 'completed', date: '2025-07-15' },
    ],
  },
  {
    id: 'CUST-005',
    name: 'David Wilson',
    email: 'dwilson@example.com',
    phone: '+1 (555) 567-8901',
    totalPurchases: 2849.00,
    status: 'active',
    joinDate: '2024-01-18',
    orders: [
      { id: 'ORD-1005', customerName: 'David Wilson', amount: 1599.00, status: 'cancelled', date: '2025-11-27' },
      { id: 'ORD-0777', customerName: 'David Wilson', amount: 1250.00, status: 'completed', date: '2025-06-22' },
    ],
  },
  {
    id: 'CUST-006',
    name: 'Lisa Anderson',
    email: 'lisa.anderson@example.com',
    phone: '+1 (555) 678-9012',
    totalPurchases: 2999.97,
    status: 'inactive',
    joinDate: '2023-09-25',
    orders: [
      { id: 'ORD-1006', customerName: 'Lisa Anderson', amount: 749.99, status: 'pending', date: '2025-11-26' },
      { id: 'ORD-0655', customerName: 'Lisa Anderson', amount: 1250.00, status: 'completed', date: '2025-04-10' },
      { id: 'ORD-0512', customerName: 'Lisa Anderson', amount: 999.98, status: 'completed', date: '2025-02-08' },
    ],
  },
];

export const mockInventory: InventoryProduct[] = [
  { id: 'PROD-001', name: 'Wireless Headphones Pro', sku: 'WHP-2024-001', category: 'Audio', price: 249.99, stockQuantity: 147, status: 'in-stock', reorderPoint: 20, turnoverRate: 2.3, lastRestocked: '2025-11-23' },
  { id: 'PROD-002', name: 'Smart Watch Series 5', sku: 'SWS5-2024-002', category: 'Wearables', price: 399.99, stockQuantity: 48, status: 'in-stock', reorderPoint: 20, turnoverRate: 7.5, lastRestocked: '2025-11-26' },
  { id: 'PROD-003', name: 'Laptop Stand Adjustable', sku: 'LSA-2024-003', category: 'Accessories', price: 79.99, stockQuantity: 15, status: 'low-stock', reorderPoint: 20, turnoverRate: 4.2, lastRestocked: '2025-11-10' },
  { id: 'PROD-004', name: 'Mechanical Keyboard RGB', sku: 'MKR-2024-004', category: 'Peripherals', price: 149.99, stockQuantity: 62, status: 'in-stock', reorderPoint: 20, turnoverRate: 3.8, lastRestocked: '2025-11-20' },
  { id: 'PROD-005', name: 'USB-C Hub 7-in-1', sku: 'UCH7-2024-005', category: 'Accessories', price: 49.99, stockQuantity: 8, status: 'low-stock', reorderPoint: 20, turnoverRate: 5.1, lastRestocked: '2025-11-05' },
  { id: 'PROD-006', name: 'Wireless Mouse Ergonomic', sku: 'WME-2024-006', category: 'Peripherals', price: 59.99, stockQuantity: 13, status: 'low-stock', reorderPoint: 20, turnoverRate: 6.3, lastRestocked: '2025-11-15' },
  { id: 'PROD-007', name: '4K Webcam Pro', sku: '4KWP-2024-007', category: 'Video', price: 179.99, stockQuantity: 34, status: 'in-stock', reorderPoint: 20, turnoverRate: 2.9, lastRestocked: '2025-11-18' },
  { id: 'PROD-008', name: 'Portable SSD 1TB', sku: 'PSSD1-2024-008', category: 'Storage', price: 129.99, stockQuantity: 12, status: 'low-stock', reorderPoint: 20, turnoverRate: 4.5, lastRestocked: '2025-11-12' },
  { id: 'PROD-009', name: 'Gaming Headset', sku: 'GHS-2024-009', category: 'Audio', price: 89.99, stockQuantity: 55, status: 'in-stock', reorderPoint: 20, turnoverRate: 3.2, lastRestocked: '2025-11-21' },
  { id: 'PROD-010', name: 'Phone Stand Wireless Charger', sku: 'PSWC-2024-010', category: 'Accessories', price: 39.99, stockQuantity: 18, status: 'low-stock', reorderPoint: 20, turnoverRate: 5.8, lastRestocked: '2025-11-14' },
];

export const stockByCategoryData: StockByCategory[] = [
  { category: 'Audio', stockLevel: 202 },
  { category: 'Wearables', stockLevel: 48 },
  { category: 'Accessories', stockLevel: 41 },
  { category: 'Peripherals', stockLevel: 75 },
  { category: 'Video', stockLevel: 34 },
  { category: 'Storage', stockLevel: 12 },
];

export const reorderRecommendations: ReorderItem[] = [
  { name: 'USB-C Hub 7-in-1', category: 'Accessories', currentStock: 8, reorderPoint: 20, priority: 'high' },
  { name: 'Portable SSD 1TB', category: 'Storage', currentStock: 12, reorderPoint: 20, priority: 'high' },
  { name: 'Wireless Mouse Ergonomic', category: 'Peripherals', currentStock: 13, reorderPoint: 20, priority: 'medium' },
  { name: 'Laptop Stand Adjustable', category: 'Accessories', currentStock: 15, reorderPoint: 20, priority: 'medium' },
  { name: 'Phone Stand Wireless Charger', category: 'Accessories', currentStock: 18, reorderPoint: 20, priority: 'low' },
];

export const topSellingProducts: Product[] = [
  { id: '1', name: 'Backpack', revenue: 320000 },
  { id: '2', name: 'Smart Watch', revenue: 180000 },
  { id: '3', name: 'USB-C Cable', revenue: 150000 },
  { id: '4', name: 'Phone Case', revenue: 140000 },
  { id: '5', name: 'Bluetooth Speaker', revenue: 100000 },
  { id: '6', name: 'Winter Jacket', revenue: 85000 },
  { id: '7', name: 'Water Bottle', revenue: 75000 },
  { id: '8', name: 'Yoga Mat', revenue: 65000 },
  { id: '9', name: 'Running Shoes', revenue: 55000 },
  { id: '10', name: 'Wireless Headphones', revenue: 50000 },
];

export const salesByCategoryData: SalesByCategory[] = [
  { category: 'Electronics', value: 76950, percentage: 27, color: '#dc2626' },
  { category: 'Sports', value: 71250, percentage: 25, color: '#991b1b' },
  { category: 'Toys', value: 42750, percentage: 15, color: '#1f2937' },
  { category: 'Home & Garden', value: 34200, percentage: 12, color: '#f59e0b' },
  { category: 'Clothing', value: 25650, percentage: 9, color: '#10b981' },
  { category: 'Beauty', value: 14250, percentage: 5, color: '#ef4444' },
  { category: 'Books', value: 14250, percentage: 5, color: '#6b7280' },
  { category: 'Automotive', value: 5700, percentage: 2, color: '#d97706' },
];
