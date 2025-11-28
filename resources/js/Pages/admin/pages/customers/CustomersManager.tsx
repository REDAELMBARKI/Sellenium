import React, { useState, useMemo, FC, ButtonHTMLAttributes, InputHTMLAttributes } from 'react';
import { Download, Plus, Calendar, RefreshCw, Phone, Mail, Eye, Ban, CheckCircle, Award, Search, X } from 'lucide-react';
import { AdminLayout } from '@/admin/components/layout/AdminLayout';
import SelectByRadix from '@/components/ui/SelectByRadix';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import CustomerDetails from './CustomerDetails';

// Types
type CustomerStatus = 'active' | 'vip' | 'blocked';

interface Customer {
  id: number;
  name: string;
  phone: string;
  email: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  status: CustomerStatus;
  joinedDate: string;
  notes: string;
}

interface Order {
  id: string;
  date: string;
  total: number;
  status: string;
  address: string;
}

type ButtonVariant = 'default' | 'outline' | 'ghost' | 'destructive';
type ButtonSize = 'default' | 'sm' | 'icon';
type BadgeVariant = 'default' | 'secondary' | 'success' | 'destructive' | 'warning';
type Trend = 'up' | 'down';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
}

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  className?: string;
}

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

interface SectionHeaderProps {
  title: string;
  description: string;
  children?: React.ReactNode;
}

interface StatsCardProps {
  title: string;
  value: number;
  change: string;
  trend: Trend;
  icon?: React.ComponentType<{ className?: string }>;
}

interface CustomerFiltersProps {
  searchQuery: string;
  statusFilter: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

interface CustomersTableProps {
  customers: Customer[];
  onViewDetails: (customer: Customer) => void;
}

interface CustomerDetailsModalProps {
  customer: Customer | null;
  open: boolean;
  onClose: () => void;
}

interface PaginationTableProps {
  totalPages: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

interface SelectByRadixProps {
  value: string;
  setter: (value: string) => void;
  elements: string[];
  extraLabel?: string;
}

// Mock data
const mockCustomers: Customer[] = [
  { id: 1, name: 'Ahmed Hassan', phone: '+212-612-345-678', email: 'ahmed@email.com', totalOrders: 12, totalSpent: 4500, lastOrderDate: '2024-11-25', status: 'active', joinedDate: '2024-01-15', notes: 'Prefers morning delivery' },
  { id: 2, name: 'Fatima Zahra', phone: '+212-623-456-789', email: 'fatima@email.com', totalOrders: 8, totalSpent: 3200, lastOrderDate: '2024-11-20', status: 'active', joinedDate: '2024-02-10', notes: '' },
  { id: 3, name: 'Mohammed Ali', phone: '+212-634-567-890', email: '', totalOrders: 1, totalSpent: 450, lastOrderDate: '2024-11-15', status: 'active', joinedDate: '2024-11-15', notes: 'Failed delivery once' },
  { id: 4, name: 'Sara Benani', phone: '+212-645-678-901', email: 'sara@email.com', totalOrders: 15, totalSpent: 6700, lastOrderDate: '2024-11-27', status: 'vip', joinedDate: '2023-12-01', notes: 'VIP customer, very reliable' },
  { id: 5, name: 'Youssef Idrissi', phone: '+212-656-789-012', email: 'youssef@email.com', totalOrders: 3, totalSpent: 890, lastOrderDate: '2024-10-10', status: 'blocked', joinedDate: '2024-08-05', notes: 'Multiple failed COD deliveries' },
  { id: 6, name: 'Amina Mansouri', phone: '+212-667-890-123', email: 'amina@email.com', totalOrders: 6, totalSpent: 2100, lastOrderDate: '2024-11-22', status: 'active', joinedDate: '2024-03-20', notes: '' },
  { id: 7, name: 'Karim Alaoui', phone: '+212-678-901-234', email: '', totalOrders: 9, totalSpent: 3800, lastOrderDate: '2024-11-26', status: 'active', joinedDate: '2024-01-30', notes: 'Always pays on time' },
  { id: 8, name: 'Nadia Berrada', phone: '+212-689-012-345', email: 'nadia@email.com', totalOrders: 2, totalSpent: 650, lastOrderDate: '2024-11-10', status: 'active', joinedDate: '2024-10-15', notes: '' },
];





const Select: FC<SelectProps> = ({ value, onChange, options, className = '' }) => (
  <select
    value={value}
    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onChange(e.target.value)}
    className={`flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${className}`}
  >
    {options.map((opt: SelectOption) => (
      <option key={opt.value} value={opt.value}>{opt.label}</option>
    ))}
  </select>
);



const SectionHeader: FC<SectionHeaderProps> = ({ title, description, children }) => (
  <div className="flex items-start justify-between gap-4 flex-wrap">
    <div>
      <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
      <p className="text-muted-foreground mt-1">{description}</p>
    </div>
    {children}
  </div>
);

const StatsCard: FC<StatsCardProps> = ({ title, value, change, trend, icon: Icon }) => (
  <Card className="p-6 rounded-xl">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <p className="text-2xl font-bold mt-2">{value}</p>
        <p className={`text-xs mt-2 ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
          {trend === 'up' ? '↑' : '↓'} {change}
        </p>
      </div>
      {Icon && (
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
          <Icon className="h-6 w-6 text-primary" />
        </div>
      )}
    </div>
  </Card>
);

const CustomerFilters: FC<CustomerFiltersProps> = ({ 
  searchQuery, 
  statusFilter, 
  onSearchChange, 
  onStatusChange, 
  onClearFilters, 
  hasActiveFilters 
}) => (
  <div className="space-y-4">
    <div className=" flex  gap-4">
       
        <Input
          placeholder="Search by name, phone, or email..."
          value={searchQuery}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)}
          className="pl-9"
        >
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </Input>
      
      <Select
        value={statusFilter}
        onChange={onStatusChange}
        options={[
          { value: 'all', label: 'All Status' },
          { value: 'active', label: 'Active' },
          { value: 'vip', label: 'VIP' },
          { value: 'blocked', label: 'Blocked' },
        ]}
      />
      
      {hasActiveFilters && (
        <Button variant="outline" onClick={onClearFilters} className="rounded-lg">
          <X size={16} />
          Clear Filters
        </Button>
      )}
    </div>
  </div>
);

const CustomersTable: FC<CustomersTableProps> = ({ customers, onViewDetails }) => (
  <Card className="rounded-xl overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-muted/50 border-b">
          <tr>
            <th className="text-left p-4 font-medium">Customer</th>
            <th className="text-left p-4 font-medium">Contact</th>
            <th className="text-left p-4 font-medium">Orders</th>
            <th className="text-left p-4 font-medium">Total Spent</th>
            <th className="text-left p-4 font-medium">Last Order</th>
            <th className="text-left p-4 font-medium">Status</th>
            <th className="text-left p-4 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer: Customer) => (
            <tr key={customer.id} className="border-b hover:bg-muted/50 transition-colors">
              <td className="p-4">
                <div className="font-medium">{customer.name}</div>
                <div className="text-xs text-muted-foreground">Joined {customer.joinedDate}</div>
              </td>
              <td className="p-4">
                <div className="flex items-center gap-2 text-sm mb-1">
                  <Phone size={14} className="text-muted-foreground" />
                  <a href={`tel:${customer.phone}`} className="hover:underline">{customer.phone}</a>
                </div>
                {customer.email && (
                  <div className="flex items-center gap-2 text-sm">
                    <Mail size={14} className="text-muted-foreground" />
                    <a href={`mailto:${customer.email}`} className="hover:underline">{customer.email}</a>
                  </div>
                )}
              </td>
              <td className="p-4 font-medium">{customer.totalOrders}</td>
              <td className="p-4 font-medium">{customer.totalSpent} MAD</td>
              <td className="p-4 text-sm">{customer.lastOrderDate}</td>
              <td className="p-4">
                {customer.status === 'vip' && <Badge variant="warning" className="gap-1"><Award size={12} /> VIP</Badge>}
                {customer.status === 'active' && <Badge variant="success" className="gap-1"><CheckCircle size={12} /> Active</Badge>}
                {customer.status === 'blocked' && <Badge variant="destructive" className="gap-1"><Ban size={12} /> Blocked</Badge>}
              </td>
              <td className="p-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onViewDetails(customer)}
                  className="rounded-lg"
                >
                  <Eye size={16} />
                  View
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </Card>
);


const PaginationTable: FC<PaginationTableProps> = ({ totalPages, currentPage, setCurrentPage }) => (
  <div className="flex items-center justify-center gap-2">
    <Button
      variant="outline"
      size="sm"
      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
      disabled={currentPage === 1}
      className="rounded-lg"
    >
      Previous
    </Button>
    {[...Array(totalPages)].map((_: undefined, i: number) => (
      <Button
        key={i + 1}
        variant={currentPage === i + 1 ? 'default' : 'outline'}
        size="sm"
        onClick={() => setCurrentPage(i + 1)}
        className="rounded-lg"
      >
        {i + 1}
      </Button>
    ))}
    <Button
      variant="outline"
      size="sm"
      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
      disabled={currentPage === totalPages}
      className="rounded-lg"
    >
      Next
    </Button>
  </div>
);


const CustomersManager = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [perPage, setPerPage] = useState<string>('10');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [detailsOpen, setDetailsOpen] = useState<boolean>(false);

  const stats = useMemo(() => ({
    total: mockCustomers.length,
    active: mockCustomers.filter((c: Customer) => c.status === 'active').length,
    vip: mockCustomers.filter((c: Customer) => c.status === 'vip').length,
    blocked: mockCustomers.filter((c: Customer) => c.status === 'blocked').length,
  }), []);

  const filteredCustomers = useMemo((): Customer[] => {
    return mockCustomers.filter((customer: Customer) => {
      const matchesSearch: boolean = 
        customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.phone.includes(searchQuery) ||
        customer.email.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus: boolean = statusFilter === 'all' || customer.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter]);

  const totalPages: number = Math.ceil(filteredCustomers.length / parseInt(perPage));
  const paginatedCustomers: Customer[] = filteredCustomers.slice(
    (currentPage - 1) * parseInt(perPage),
    currentPage * parseInt(perPage)
  );

  const handleViewDetails = (customer: Customer): void => {
    setSelectedCustomer(customer);
    setDetailsOpen(true);
  };

  const clearFilters = (): void => {
    setSearchQuery('');
    setStatusFilter('all');
  };

  const hasActiveFilters: boolean = searchQuery !== '' || statusFilter !== 'all';

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        <SectionHeader title='Manage Customers' description="View and manage all your customers">
          <div className='flex gap-4'>
            <Button type="button" variant="outline" className="rounded-lg">
              <Download size={18} />
              Export
            </Button>
            <Button type="button" className="rounded-lg" variant='default'>
              <Plus size={18} />
              Add Customer
            </Button>
          </div>
        </SectionHeader>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar size={16} />
          <span>Last update: 28 Nov 2024</span>
          <Button type="button" variant="ghost" size="icon" className="h-6 w-6 rounded-lg">
            <RefreshCw size={16} />
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard title="Total Customers" value={stats.total} change="15.3%" trend="up" />
          <StatsCard title="Active" value={stats.active} change="12.1%" trend="up" />
          <StatsCard title="VIP" value={stats.vip} change="8.5%" trend="up" />
          <StatsCard title="Blocked" value={stats.blocked} change="3.2%" trend="down" />
        </div>

        <Card className="p-4 rounded-xl">
          <CustomerFilters
            searchQuery={searchQuery}
            statusFilter={statusFilter}
            onSearchChange={setSearchQuery}
            onStatusChange={setStatusFilter}
            onClearFilters={clearFilters}
            hasActiveFilters={hasActiveFilters}
          />
        </Card>

        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * parseInt(perPage) + 1} to{' '}
            {Math.min(currentPage * parseInt(perPage), filteredCustomers.length)} of {filteredCustomers.length}
          </div>

          <SelectByRadix value={perPage} setter={setPerPage} elements={['5', '10', '20', '50']} extraLabel='per page' />
        </div>

        <CustomersTable
          customers={paginatedCustomers}
          onViewDetails={handleViewDetails}
        />

        <PaginationTable totalPages={totalPages} currentPage={currentPage} setCurrentPage={setCurrentPage} />
      </div>

      <CustomerDetails  
      //  customer={selectedCustomer} open={detailsOpen} onClose={() => setDetailsOpen(false)} 
        
        />
    </div>
  );
};

export default CustomersManager;

CustomersManager.layout  = (page:any ) => <AdminLayout children={page} />