import React from 'react';
import { DollarSign, ShoppingCart, TrendingUp } from 'lucide-react';
import { MetricsCard } from './dashboardComponents/MetricsCard';
import { recentOrders, salesMetrics, salesTrendData, topProducts } from './fkData/mockData';
import { SalesChart } from './dashboardComponents/SalesChart';
import { TopProductsList } from './dashboardComponents/TopProductsList';
import { RecentOrdersTable } from './dashboardComponents/RecentOrdersTable';
import { AdminLayout } from '@/admin/components/layout/AdminLayout';


export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricsCard
          title="Total Revenue"
          value={`$${salesMetrics.totalRevenue.toLocaleString()}`}
          icon={<DollarSign size={32} />}
        />
        <MetricsCard
          title="Total Orders"
          value={salesMetrics.totalOrders}
          icon={<ShoppingCart size={32} />}
        />
        <MetricsCard
          title="Average Order Value"
          value={`$${salesMetrics.averageOrderValue.toFixed(2)}`}
          icon={<TrendingUp size={32} />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SalesChart data={salesTrendData} />
        </div>
        <div>
          <TopProductsList products={topProducts} />
        </div>
      </div>

      <RecentOrdersTable orders={recentOrders} />
    </div>
  );
}


Dashboard.layout = (page:any) => <AdminLayout children={page} />
