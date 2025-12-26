import { useState, useMemo } from 'react';
import { Download, Plus, RefreshCw, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { AdminLayout } from '@/admin/components/layout/AdminLayout';
import { Order, Stats } from '@/admin/types/ordersTypes';
import { StatsCard } from './ordersComponents/StatsCard';
import { OrderFilters } from './ordersComponents/OrderFilters';
import { Card } from '../../../../components/ui/card';
import { OrdersTable } from './ordersComponents/OrdersTable';
import { OrderDetailsModal } from './ordersComponents/OrderDetailsModal';
import { generateOrders } from '@/admin/data/orders';
import { Button } from '@/components/ui/button';
import SelectByRadix from '@/components/ui/SelectByRadix';
import { SectionHeader } from '@/admin/components/layout/SectionHeader';
import { PaginationTable } from '@/admin/components/layout/Pagination';
import { useStoreConfigCtx } from '@/contextHooks/useStoreConfigCtx';
import { TableMeta } from '@/components/ui/TableMeta';


function OrderManager() {
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [perPage, setPerPage] = useState('10');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const {state : {currentTheme}} =  useStoreConfigCtx()
  const allOrders = generateOrders();

  const filteredOrders = useMemo(() => {
    return allOrders.filter((order) => {
      const matchesSearch =
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

      let matchesDate = true;
      if (dateFrom && dateTo) {
        const orderDate = new Date(order.date);
        const fromDate = new Date(dateFrom);
        const toDate = new Date(dateTo);
        matchesDate = orderDate >= fromDate && orderDate <= toDate;
      }

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [searchQuery, statusFilter, dateFrom, dateTo, allOrders]);

  const stats: Stats = {
    total: allOrders.length,
    cancelled: allOrders.filter((o) => o.status === 'cancelled').length,
    pending: allOrders.filter((o) => o.status === 'pending').length,
    returned: allOrders.filter((o) => o.status === 'returned').length,
  };

  const handleSelectOrder = (id: string) => {
    setSelectedOrders((prev) =>
      prev.includes(id) ? prev.filter((oid) => oid !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedOrders(
      selectedOrders.length === paginatedOrders.length && paginatedOrders.length > 0 ? [] : paginatedOrders.map((o) => o.id)
    );
  };

  const clearFilters = () => {
    setDateFrom('');
    setDateTo('');
    setSearchQuery('');
    setStatusFilter('all');
    setCurrentPage(1);
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setDetailsOpen(true);
  };

  const hasActiveFilters = searchQuery || statusFilter !== 'all' || dateFrom || dateTo;

  const totalPages = Math.ceil(filteredOrders.length / parseInt(perPage));
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * parseInt(perPage),
    currentPage * parseInt(perPage)
  );

  const handleFilterChange = (setter: (value: string) => void) => (value: string) => {
    setter(value);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        <SectionHeader title='Manage Orders'  description="Organize and manage all your orders" >
          {/* actions */}
            <div className='flex gap-4'>
              <Button type="button" variant="outline" className="rounded-lg">
              <Download size={18} />
              Export
            </Button>
            <Button type="button" className="rounded-lg" variant='default'>
              <Plus size={18} />
              Create Order
            </Button>
            </div>
        </SectionHeader>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar size={16} />
          <span>Last update: 1 Oct 2024</span>
          <Button type="button" variant="ghost" size="icon" className="h-6 w-6 rounded-lg">
            <RefreshCw size={16} />
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard title="Total Orders" value={stats.total} change="12.5%" trend="up" />
          <StatsCard title="Cancelled" value={stats.cancelled} change="8.2%" trend="down" />
          <StatsCard title="Pending" value={stats.pending} change="5.1%" trend="up" />
          <StatsCard title="Returned" value={stats.returned} change="2.3%" trend="down" />
        </div>

      
        <OrdersTable
          orders={paginatedOrders}
        />

         {/* pagination */}

         <TableMeta perPage={perPage} currentPage={currentPage} totalItems={totalPages} setPerPage={setPerPage} >
             <PaginationTable  totalPages={totalPages} currentPage={currentPage} setCurrentPage={setCurrentPage} />
         </TableMeta>
      </div>

    </div>
  );
}





export default OrderManager;

OrderManager.layout = (page:any) => <AdminLayout children={page} />

