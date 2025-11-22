// admin/pages/dashboard/Dashboard.tsx

import { Link } from "@inertiajs/react";
import { 
    ArrowUpRight, 
    ArrowDownRight, 
    Package, 
    DollarSign, 
    Users, 
    ShoppingCart, 
    AlertTriangle 
} from "lucide-react";

// Types
interface DashboardStats {
    totalOrders: number;
    totalRevenue: number;
    totalCustomers: number;
    totalProducts: number;
    ordersChange: number;
    revenueChange: number;
    customersChange: number;
    productsChange: number;
}

interface SalesChartData {
    date: string;
    revenue: number;
    orders: number;
}

interface Order {
    id: string;
    orderNumber: string;
    customerName: string;
    status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
    total: number;
    createdAt: string;
}

interface TopProduct {
    id: string;
    name: string;
    sales: number;
    revenue: number;
}

interface LowStockProduct {
    id: string;
    name: string;
    sku: string;
    stock: number;
}

interface DashboardProps {
    stats: DashboardStats;
    salesData: SalesChartData[];
    recentOrders: Order[];
    topProducts: TopProduct[];
    lowStockProducts: LowStockProduct[];
}

// Mock data
const mockStats: DashboardStats = {
    totalOrders: 156,
    totalRevenue: 24580,
    totalCustomers: 89,
    totalProducts: 45,
    ordersChange: 12,
    revenueChange: 8,
    customersChange: 5,
    productsChange: -2,
};

const mockSalesData: SalesChartData[] = [
    { date: "Jan 10", revenue: 1200, orders: 12 },
    { date: "Jan 11", revenue: 1800, orders: 18 },
    { date: "Jan 12", revenue: 1400, orders: 14 },
    { date: "Jan 13", revenue: 2200, orders: 22 },
];

const mockRecentOrders: Order[] = [
    { id: "1", orderNumber: "ORD-001", customerName: "John Doe", status: "pending", total: 125.00, createdAt: "2024-01-15T10:30:00Z" },
    { id: "2", orderNumber: "ORD-002", customerName: "Jane Smith", status: "processing", total: 89.50, createdAt: "2024-01-14T14:20:00Z" },
    { id: "3", orderNumber: "ORD-003", customerName: "Mike Johnson", status: "shipped", total: 234.00, createdAt: "2024-01-13T09:00:00Z" },
    { id: "4", orderNumber: "ORD-004", customerName: "Sarah Wilson", status: "delivered", total: 67.25, createdAt: "2024-01-12T16:45:00Z" },
];

const mockTopProducts: TopProduct[] = [
    { id: "1", name: "Classic T-Shirt", sales: 45, revenue: 1125 },
    { id: "2", name: "Slim Fit Jeans", sales: 32, revenue: 1920 },
    { id: "3", name: "Summer Dress", sales: 28, revenue: 1400 },
    { id: "4", name: "Wool Sweater", sales: 19, revenue: 1425 },
];

const mockLowStockProducts: LowStockProduct[] = [
    { id: "1", name: "Summer Dress", sku: "DRS-003", stock: 3 },
    { id: "2", name: "Slim Fit Jeans", sku: "JNS-002", stock: 5 },
    { id: "3", name: "Canvas Sneakers", sku: "SNK-007", stock: 2 },
    { id: "4", name: "Leather Belt", sku: "BLT-004", stock: 4 },
];

const ORDER_STATUSES = {
    pending: { label: "Pending", class: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" },
    processing: { label: "Processing", class: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
    shipped: { label: "Shipped", class: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" },
    delivered: { label: "Delivered", class: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
    cancelled: { label: "Cancelled", class: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
};

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(amount);
};

const formatRelativeTime = (date: string) => {
    const now = new Date();
    const then = new Date(date);
    const diff = Math.floor((now.getTime() - then.getTime()) / 1000);

    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
};

export default function Dashboard({
    stats = mockStats,
    salesData = mockSalesData,
    recentOrders = mockRecentOrders,
    topProducts = mockTopProducts,
    lowStockProducts = mockLowStockProducts,
}: DashboardProps) {
    const statCards = [
        { title: "Total Orders", value: stats.totalOrders, change: stats.ordersChange, icon: ShoppingCart },
        { title: "Total Revenue", value: formatCurrency(stats.totalRevenue), change: stats.revenueChange, icon: DollarSign },
        { title: "Total Customers", value: stats.totalCustomers, change: stats.customersChange, icon: Users },
        { title: "Total Products", value: stats.totalProducts, change: stats.productsChange, icon: Package },
    ];

    return (
        <div className="space-y-8 p-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Dashboard</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">Overview of your e-commerce store</p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {statCards.map((stat) => (
                    <div
                        key={stat.title}
                        className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{stat.title}</span>
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-700">
                                <stat.icon className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">{stat.value}</div>
                        <div className="mt-2 flex items-center gap-1 text-xs">
                            {stat.change >= 0 ? (
                                <>
                                    <ArrowUpRight className="h-3 w-3 text-green-600" />
                                    <span className="text-green-600">+{stat.change}%</span>
                                </>
                            ) : (
                                <>
                                    <ArrowDownRight className="h-3 w-3 text-red-600" />
                                    <span className="text-red-600">{stat.change}%</span>
                                </>
                            )}
                            <span className="text-slate-500 dark:text-slate-400">from last month</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Sales Chart Placeholder */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Sales Overview</h2>
                <div className="h-64 flex items-center justify-center bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                    <p className="text-slate-500 dark:text-slate-400">
                        {/* TODO: Add chart component (Recharts) */}
                        Sales chart placeholder - {salesData.length} data points
                    </p>
                </div>
            </div>

            {/* Recent Orders & Top Products */}
            <div className="grid gap-6 lg:grid-cols-3">
                {/* Recent Orders */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                    <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Recent Orders</h2>
                    </div>
                    {recentOrders.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-slate-50 dark:bg-slate-700/50">
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase">Order</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase">Customer</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase">Status</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase">Total</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                    {recentOrders.map((order) => (
                                        <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                            <td className="px-4 py-4 font-medium text-slate-900 dark:text-slate-100">
                                                {order.orderNumber}
                                            </td>
                                            <td className="px-4 py-4 text-slate-500 dark:text-slate-400">
                                                {order.customerName}
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${ORDER_STATUSES[order.status].class}`}>
                                                    {ORDER_STATUSES[order.status].label}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 text-slate-900 dark:text-slate-100">
                                                {formatCurrency(order.total)}
                                            </td>
                                            <td className="px-4 py-4 text-slate-500 dark:text-slate-400">
                                                {formatRelativeTime(order.createdAt)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="py-12 text-center text-slate-500 dark:text-slate-400">No recent orders</div>
                    )}
                </div>

                {/* Top Products */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                    <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Top Products</h2>
                    </div>
                    {topProducts.length > 0 ? (
                        <div className="p-4 space-y-4">
                            {topProducts.map((product) => (
                                <div key={product.id} className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-slate-900 dark:text-slate-100">{product.name}</p>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">{product.sales} sold</p>
                                    </div>
                                    <p className="font-semibold text-slate-900 dark:text-slate-100">
                                        {formatCurrency(product.revenue)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-12 text-center text-slate-500 dark:text-slate-400">No sales data</div>
                    )}
                </div>
            </div>

            {/* Low Stock Alerts */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Low Stock Alerts</h2>
                </div>
                {lowStockProducts.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-700/50">
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase">Product</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase">SKU</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase">Stock</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                {lowStockProducts.map((product) => (
                                    <tr key={product.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                        <td className="px-4 py-4 font-medium text-slate-900 dark:text-slate-100">
                                            {product.name}
                                        </td>
                                        <td className="px-4 py-4 text-slate-500 dark:text-slate-400">
                                            {product.sku}
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className="inline-flex px-2.5 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                                                {product.stock} left
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="py-12 text-center text-slate-500 dark:text-slate-400">All products are well stocked</div>
                )}
            </div>
        </div>
    );
}