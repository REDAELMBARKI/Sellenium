import { Eye, EyeClosed, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { Order } from '@/admin/types/ordersTypes';
import { Badge } from '../ui/badge';
import { Checkbox } from '../ui/checkBox';
import { currentTheme } from '@/data/currentTheme';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSubTrigger, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import MoreOptions from '@/components/ui/moreOptions';
import { useState } from 'react';

interface OrdersTableProps {
  orders: Order[];
  selectedOrders: string[];
  onSelectOrder: (id: string) => void;
  onSelectAll: () => void;
  onViewDetails: (order: Order) => void;
}

export function OrdersTable({ orders, selectedOrders, onSelectOrder, onSelectAll, onViewDetails }: OrdersTableProps) {
  const allSelected = orders.length > 0 && selectedOrders.length === orders.length;
  const [openMoreOptions , setOpenMoreOptions] = useState<string | null>(null)

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  };
  
  const getPaymentBadge = (payment: string) => {
    return payment === 'Success' ? (
      <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Success</Badge>
    ) : (
      <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">Pending</Badge>
    );
  };
   

  const toggleMoreOptions = (option : string  ) => {
     setOpenMoreOptions(option)
  }

  return (
    <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${currentTheme.border}`, backgroundColor: currentTheme.bg }}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead style={{ backgroundColor: currentTheme.buttonSecondary, borderBottom: `1px solid ${currentTheme.border}` }}>
            <tr>
              <th className="text-left p-4 font-medium text-sm">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={onSelectAll}
                />
              </th>
              <th className="text-left p-4 font-medium text-sm">Order</th>
              <th className="text-left p-4 font-medium text-sm">Date</th>
              <th className="text-left p-4 font-medium text-sm">Customer</th>
              <th className="text-left p-4 font-medium text-sm">Delivery</th>
              <th className="text-left p-4 font-medium text-sm">Items</th>
              <th className="text-left p-4 font-medium text-sm">Total</th>
              <th className="text-left p-4 font-medium text-sm">Payment</th>
              <th className="text-left p-4 font-medium text-sm">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const isSelected = selectedOrders.includes(order.id);
              return (
                <tr
                  key={order.id}
                  className="transition-colors cursor-pointer"
                  style={{
                    borderBottom: `1px solid ${currentTheme.border}`,
                    borderLeft: isSelected ? `4px solid ${currentTheme.accent}` : '4px solid transparent',
                    backgroundColor: isSelected ? `${currentTheme.accent}10` : currentTheme.bg,
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) e.currentTarget.style.backgroundColor = currentTheme.buttonSecondary;
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) e.currentTarget.style.backgroundColor = currentTheme.bg;
                  }}
                  onClick={() => onViewDetails(order)}
                >
                  <td className="p-4" onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => onSelectOrder(order.id)}
                    />
                  </td>
                  <td className="p-4 font-medium" style={{ color: currentTheme.text }}>#{order.id}</td>
                  <td className="p-4 text-sm" style={{ color: `${currentTheme.text}99` }}>{formatDate(order.date)}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium" style={{ backgroundColor: currentTheme.accent, color: currentTheme.bg }}>
                        {order.avatar}
                      </div>
                      <span className="text-sm" style={{ color: currentTheme.text }}>{order.customer}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm" style={{ color: `${currentTheme.text}99` }}>{order.delivery}</td>
                  <td className="p-4 text-sm" style={{ color: currentTheme.text }}>{order.items} Items</td>
                  <td className="p-4 font-semibold" style={{ color: currentTheme.text }}>${order.total}</td>
                  <td className="p-4">{getPaymentBadge(order.payment)}</td>
                  <td className="p-4" onClick={(e) => e.stopPropagation()}>
                
                       <Button type="button" variant="ghost" size="icon" className="rounded-lg" onClick={() => toggleMoreOptions(order.id)}>
                          <MoreVertical size={18} />
                        </Button>

                        {order.id === openMoreOptions && (
                          <MoreOptions>

                             <button
                                onClick={() => {}}
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                              >
                                <Eye size={14} />
                                View Details
                              </button>

                               <button
                                onClick={() => {} }
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                              >
                                <EyeClosed size={14} />
                                Mark as Shipped
                              </button>


                              <button
                                onClick={() => {} }
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                              >
                                <Pencil size={14} />
                                Edit
                              </button>
                               
                              <button
                                onClick={() => {} }
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                              >
                                <Trash2 size={14} />
                                Delete
                              </button>
                          </MoreOptions>
                        )


                        }
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
