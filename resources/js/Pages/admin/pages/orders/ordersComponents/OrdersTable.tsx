import {
  Eye,
  EyeClosed,
  MoreHorizontal,
  MoreVertical,
  Pencil,
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import MoreOptions from "@/components/ui/moreOptions";
import { Card, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useStoreConfigCtx } from "@/contextHooks/useStoreConfigCtx";
import SelectByRadix from "@/components/ui/SelectByRadix";
import { OrderFilters } from "./OrderFilters";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Order } from "@/types/orders/ordersTypes";



interface OrdersTableProps {
  orders: Order[];
}

const ORDER_HEADER_KEYS   =  [
  "order_number",
  "date",
  "customer",
  "avatar",
  "items",
  "total_amount",
  "currency",
  "payment_method",
  "status",
  "confirmed",
  "paid",
  "shipping_cost",
  "discount_amount",
  "tax",
  "notes",
  "created_at", 
];


export function OrdersTable({ orders }: OrdersTableProps) {
  const {
    state: { currentTheme },
  } = useStoreConfigCtx();
  
  /* ================= STATES ================= */
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [openMoreOptions, setOpenMoreOptions] = useState<string | null>(null);
  const [showHiddennColumns , setShowHiddennColumns] = useState(false) ;
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Orders");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [headerKeysToShow , setHeaderKeysToShow]  = useState(ORDER_HEADER_KEYS)
  const [perPage, setPerPage] = useState("10");
  const [currentPage, setCurrentPage] = useState(1);

  /* ================= FILTERING ================= */
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch = false 
        // order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        // order.customer.name.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "All Orders" ||
        order.status === statusFilter;

      const orderDate = new Date(order.created_at).getTime();
      const from = dateFrom ? new Date(dateFrom).getTime() : null;
      const to = dateTo ? new Date(dateTo).getTime() : null;

      const matchesDate =
        (!from || orderDate >= from) &&
        (!to || orderDate <= to);

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [orders, searchQuery, statusFilter, dateFrom, dateTo]);

  const hasActiveFilters =
    searchQuery || statusFilter !== "All Orders" || dateFrom || dateTo;

  const handleClearFilters = () => {
    setSearchQuery("");
    setStatusFilter("All Orders");
    setDateFrom("");
    setDateTo("");
  };

  /* ================= SELECTION ================= */
  const allSelected =
    filteredOrders.length > 0 &&
    selectedOrders.length === filteredOrders.length;

  const toggleSelectAll = () => {
    setSelectedOrders(
      allSelected ? [] : filteredOrders.map((o) => String(o.id))
    );
  };

  const toggleSelectOne = (id: string) => {
    setSelectedOrders((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  /* ================= HELPERS ================= */
  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const getPaymentBadge = (payment: string) => (
    <Badge
      style={{
        background:
          payment === "Success"
            ? `${currentTheme.success}22`
            : `${currentTheme.warning}22`,
        color:
          payment === "Success"
            ? currentTheme.success
            : currentTheme.warning,
      }}
    >
      {payment}
    </Badge>
  );

  /* ================= RENDER ================= */
  return (
    <Card
      style={{
        background: currentTheme.card,
        border: `1px solid ${currentTheme.border}`,
        borderRadius: currentTheme.borderRadius,
        boxShadow: currentTheme.shadowLg,
      }}
    >
      {/* ================= HEADER ================= */}
      <CardHeader
        style={{
          background: currentTheme.bg,
          borderBottom: `1px solid ${currentTheme.border}`,
        }}
        className="space-y-4"
      >
        {/* Title */}
        <div className="flex items-center justify-between">
          <h2
            style={{
              color: currentTheme.text,
              fontWeight: 600,
              fontSize: "1rem",
            }}
          >
            Orders
          </h2>

          {selectedOrders.length > 0 && (
            <span
              style={{
                color: currentTheme.textMuted,
                fontSize: "0.85rem",
              }}
            >
              {selectedOrders.length} selected
            </span>
          )}
        </div>

        {/* Filters */}
        <OrderFilters
          searchQuery={searchQuery}
          statusFilter={statusFilter}
          dateFrom={dateFrom}
          dateTo={dateTo}
          onSearchChange={setSearchQuery}
          setStatusFilter={setStatusFilter}
          onDateFromChange={setDateFrom}
          onDateToChange={setDateTo}
          onClearFilters={handleClearFilters}
          hasActiveFilters={!!hasActiveFilters}
        />

        
      </CardHeader>

      {/* ================= TABLE ================= */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader
            style={{
              background: currentTheme.bgSecondary,
              borderBottom: `2px solid ${currentTheme.border}`,
            }}
          >
            <TableRow>
              <TableHead className="w-[48px]">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={toggleSelectAll}
                />
              </TableHead>
               {
                  showHiddennColumns  && (
                    <TableHead>
                     <MoreHorizontal />
                    </TableHead>
                  )
                   
                }

              {headerKeysToShow.slice(0,6).concat(['actions']).map((h) => (
                <TableHead
                  key={h}
                  className="text-xs uppercase"
                  style={{
                    color: currentTheme.textSecondary,
                    fontWeight: 600,
                  }}
                >
                  {h}
                </TableHead>
              ))}

               {
                  !showHiddennColumns  && (
                    <TableHead>
                       <Button onClick={() => }>
                        <MoreHorizontal /> more
                       </Button>
                    </TableHead>
                  )
                   
                }
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredOrders.map((order) => {
              const isSelected = selectedOrders.includes(String(order.id));

              return (
                
                <TableRow
                  key={order.id}
                  className="transition-colors cursor-pointer"
                  style={{
                    background: isSelected ? `${currentTheme.accent}12` : currentTheme.card,
                    borderBottom: `1px solid ${currentTheme.border}`,
                    borderLeft: isSelected ? `4px solid ${currentTheme.accent}` : "4px solid transparent",
                  }}
                >
                {/* Select */}
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Checkbox checked={isSelected} onCheckedChange={() => toggleSelectOne(String(order.id))} />
                </TableCell>

                {/* Order ID */}
                <TableCell className="font-medium" style={{ color: currentTheme.text }}>
                  #{order.order_number}
                </TableCell>

                {/* Date */}
                <TableCell className="text-sm" style={{ color: currentTheme.textMuted }}>
                  {formatDate(order.created_at)}
                </TableCell>

                {/* Customer */}
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold"
                      style={{
                        background: currentTheme.accent,
                        color: currentTheme.textInverse,
                      }}
                    >
                      {order.customer?.avatar}
                    </div>
                    <span style={{ color: currentTheme.text }}>{order.customer.name}</span>
                  </div>
                </TableCell>


                {/* Items Count */}
                <TableCell style={{ color: currentTheme.text }}>
                  {order.order_items.length} items
                </TableCell>

                {/* Total Amount */}
                <TableCell className="font-semibold" style={{ color: currentTheme.text }}>
                  {order.currency} {order.total_amount.toFixed(2)}
                </TableCell>

                {/* Payment Method */}
                <TableCell>{getPaymentBadge(order.payment_method)}</TableCell>

                {/* Status */}
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium`}
                    style={{
                      background:
                        order.status === "delivered"
                          ? "#d1fae5"
                          : order.status === "pending"
                          ? "#fef3c7"
                          : order.status === "canceled"
                          ? "#fee2e2"
                          : "#e5e7eb",
                      color:
                        order.status === "delivered"
                          ? "#065f46"
                          : order.status === "pending"
                          ? "#78350f"
                          : order.status === "canceled"
                          ? "#991b1b"
                          : "#374151",
                    }}
                  >
                    {order.status}
                  </span>
                </TableCell>

                {/* Confirmed */}
                <TableCell>
                  {order.confirmed ? (
                    <span style={{ color: "#10b981" }}>Yes</span>
                  ) : (
                    <span style={{ color: "#f59e0b" }}>No</span>
                  )}
                </TableCell>

                {/* Paid */}
                <TableCell>
                  {order.paid ? (
                    <span style={{ color: "#10b981" }}>Yes</span>
                  ) : (
                    <span style={{ color: "#ef4444" }}>No</span>
                  )}
                </TableCell>

                {/* More options */}
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() =>
                      setOpenMoreOptions(openMoreOptions === order.id ? null : order.id)
                    }
                  >
                    <MoreVertical size={18} />
                  </Button>

                  {openMoreOptions === order.id && (
                    <MoreOptions>
                      {[
                        { icon: Eye, label: "View Details" },
                        { icon: Pencil, label: "Edit" },
                        { icon: Trash2, label: "Delete" },
                      ].map(({ icon: Icon, label }) => (
                        <button
                          key={label}
                          className="w-full px-4 py-2 flex items-center gap-2 text-sm"
                          style={{ color: currentTheme.text }}
                        >
                          <Icon size={14} />
                          {label}
                        </button>
                      ))}
                    </MoreOptions>
                  )}
                </TableCell>

                {/* Overflow / Hidden columns */}
                <TableCell>
                  <span className="text-xs text-gray-400 cursor-pointer">⋯</span>
                  {/* Here you could open a tooltip or modal to show:
                      tax, notes, shipping_cost, discount_amount, items details, etc. */}
                </TableCell>
              </TableRow>

              );
            })}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
