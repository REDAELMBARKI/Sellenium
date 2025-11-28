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

        <Card className="p-4 rounded-xl">
          <OrderFilters
            searchQuery={searchQuery}
            statusFilter={statusFilter}
            dateFrom={dateFrom}
            dateTo={dateTo}
            onSearchChange={handleFilterChange(setSearchQuery)}
            setStatusFilter={setStatusFilter}
            onDateFromChange={handleFilterChange(setDateFrom)}
            onDateToChange={handleFilterChange(setDateTo)}
            onClearFilters={clearFilters}
            hasActiveFilters={!!hasActiveFilters}
          />
        </Card>

        {selectedOrders.length > 0 ? (
          <Card className="p-4 rounded-xl bg-primary/10 border-primary">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <span className="font-medium">
                {selectedOrders.length} order{selectedOrders.length !== 1 ? 's' : ''} selected
              </span>
              <div className="flex gap-2 flex-wrap">
                <Button type="button" size="sm" className="rounded-lg">Mark as Shipped</Button>
                <Button type="button" size="sm" className="rounded-lg">Mark as Delivered</Button>
                <Button type="button" size="sm" variant="destructive" className="rounded-lg">Delete</Button>
              </div>
            </div>
          </Card>
        ) : null}

        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * parseInt(perPage) + 1} to{' '}
            {Math.min(currentPage * parseInt(perPage), filteredOrders.length)} of {filteredOrders.length}
          </div>
  

          <SelectByRadix value={perPage} setter={setPerPage} elements={['5' , '10' , '20' , '50' ]} extraLabel='per page'  />
        </div>

        <OrdersTable
          orders={paginatedOrders}
          selectedOrders={selectedOrders}
          onSelectOrder={handleSelectOrder}
          onSelectAll={handleSelectAll}
          onViewDetails={handleViewDetails}
        />

         {/* pagination */}

         <PaginationTable  totalPages={totalPages} currentPage={currentPage} setCurrentPage={setCurrentPage} />
      </div>

      <OrderDetailsModal order={selectedOrder} open={detailsOpen} onClose={() => setDetailsOpen(false)} />
    </div>
  );
}





export default OrderManager;

OrderManager.layout = (page:any) => <AdminLayout children={page} />

