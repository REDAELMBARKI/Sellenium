import {
  Eye,
  ChevronDown,
  ChevronUp,
  MoreVertical,
  Pencil,
  Trash2,
  Copy,
  Package,
  CreditCard,
  MapPin,
  FileText,
  Calendar,
  DollarSign,
} from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import MoreOptions from "@/components/ui/moreOptions";
import { Card, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useStoreConfigCtx } from "@/contextHooks/useStoreConfigCtx";
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

// Only show these 6 essential columns in the main view
const VISIBLE_COLUMNS = [
  "order_number",
  "date",
  "customer",
  "order_items",
  "total_amount",
  "status",
];

export function OrdersTable({ orders }: OrdersTableProps) {
  const {
    state: { currentTheme },
  } = useStoreConfigCtx();

  /* ================= STATES ================= */
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Orders");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const tableWrapperRef = useRef<HTMLDivElement>(null);

  /* ================= FILTERING ================= */
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        // order.order_number.includes(searchQuery.toLowerCase()) ||
        order.customer.name.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "All Orders" || order.status === statusFilter;

      const orderDate = new Date(order.created_at).getTime();
      const from = dateFrom ? new Date(dateFrom).getTime() : null;
      const to = dateTo ? new Date(dateTo).getTime() : null;

      const matchesDate = (!from || orderDate >= from) && (!to || orderDate <= to);

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
    filteredOrders.length > 0 && selectedOrders.length === filteredOrders.length;

  const toggleSelectAll = () => {
    setSelectedOrders(
      allSelected ? [] : filteredOrders.map((o) => String(o.id))
    );
  };

  const toggleSelectOne = (id: string) => {
    setSelectedOrders((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  /* ================= EXPAND/COLLAPSE ================= */
  const toggleRowExpansion = (id: string) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  /* ================= HELPERS ================= */
  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      delivered: { bg: "#d1fae5", color: "#065f46" },
      pending: { bg: "#fef3c7", color: "#78350f" },
      canceled: { bg: "#fee2e2", color: "#991b1b" },
      processing: { bg: "#dbeafe", color: "#1e40af" },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || {
      bg: "#e5e7eb",
      color: "#374151",
    };

    return (
      <Badge
        style={{
          background: config.bg,
          color: config.color,
        }}
      >
        {status}
      </Badge>
    );
  };

  const handleDeleteOrder = (orderId: string) => {
    // Implement delete logic
    console.log("Delete order:", orderId);
  };

  const handleDuplicateOrder = (orderId: string) => {
    // Implement duplicate logic
    console.log("Duplicate order:", orderId);
  };

  const handleEditOrder = (orderId: string) => {
    // Implement edit logic
    console.log("Edit order:", orderId);
  };

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
      <div className="overflow-x-auto" ref={tableWrapperRef}>
        <Table>
          <TableHeader
            style={{
              background: currentTheme.bgSecondary,
              borderBottom: `2px solid ${currentTheme.border}`,
            }}
          >
            <TableRow>
              <TableHead className="w-[48px]">
                <Checkbox checked={allSelected} onCheckedChange={toggleSelectAll} />
              </TableHead>
              <TableHead className="w-[48px]"></TableHead>
              {VISIBLE_COLUMNS.map((header) => (
                <TableHead
                  key={header}
                  className="text-xs uppercase"
                  style={{
                    color: currentTheme.textSecondary,
                    fontWeight: 600,
                  }}
                >
                  {header.replace(/_/g, " ")}
                </TableHead>
              ))}
              <TableHead className="w-[100px] sticky right-0" 
                style={{
                  background: currentTheme.bgSecondary,
                  borderLeft: `1px solid ${currentTheme.border}`,
                }}
              >
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredOrders.map((order) => {
              const isSelected = selectedOrders.includes(String(order.id));
              const isExpanded = expandedRows.has(String(order.id));

              return (
                <>
                  {/* ================= MAIN ROW ================= */}
                  <TableRow
                    key={order.id}
                    className="transition-colors"
                    style={{
                      background: isSelected
                        ? `${currentTheme.accent}12`
                        : currentTheme.card,
                      borderBottom: isExpanded
                        ? "none"
                        : `1px solid ${currentTheme.border}`,
                      borderLeft: isSelected
                        ? `4px solid ${currentTheme.accent}`
                        : "4px solid transparent",
                    }}
                  >
                    {/* Checkbox */}
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => toggleSelectOne(String(order.id))}
                      />
                    </TableCell>

                    {/* Expand/Collapse Button */}
                    <TableCell>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => toggleRowExpansion(String(order.id))}
                        style={{
                          color: currentTheme.text,
                        }}
                      >
                        {isExpanded ? (
                          <ChevronUp size={18} />
                        ) : (
                          <ChevronDown size={18} />
                        )}
                      </Button>
                    </TableCell>

                    {/* Order Number */}
                    <TableCell
                      className="font-medium"
                      style={{ color: currentTheme.text }}
                    >
                      #{order.order_number}
                    </TableCell>

                    {/* Date */}
                    <TableCell
                      className="text-sm"
                      style={{ color: currentTheme.textMuted }}
                    >
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
                          {order.customer?.avatar || order.customer.name.charAt(0)}
                        </div>
                        <span style={{ color: currentTheme.text }}>
                          {order.customer.name}
                        </span>
                      </div>
                    </TableCell>

                    {/* Order Items (Important - 2nd column) */}
                    <TableCell style={{ color: currentTheme.text }}>
                      <div className="flex items-center gap-2">
                        <Package size={16} style={{ color: currentTheme.textMuted }} />
                        <span className="font-medium">
                          {order.order_items.length} items
                        </span>
                      </div>
                    </TableCell>

                    {/* Total Amount */}
                    <TableCell
                      className="font-semibold"
                      style={{ color: currentTheme.text }}
                    >
                      {order.currency} {order.total_amount}
                    </TableCell>

                    {/* Status */}
                    <TableCell>{getStatusBadge(order.status)}</TableCell>

                    {/* Actions (Always Visible - Sticky) */}
                    <TableCell 
                      className="sticky right-0"
                      style={{
                        background: isSelected
                          ? `${currentTheme.accent}12`
                          : currentTheme.card,
                        borderLeft: `1px solid ${currentTheme.border}`,
                      }}
                    >
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleRowExpansion(String(order.id))}
                        style={{
                          color: currentTheme.text,
                          borderColor: currentTheme.border,
                        }}
                      >
                        {isExpanded ? "Less" : "More"}
                      </Button>
                    </TableCell>
                  </TableRow>

                  {/* ================= EXPANDED DETAILS ROW ================= */}
                  {isExpanded && (
                   <ExpandedRow 
                   {...{
                    getStatusBadge , 
                    formatDate , 
                    order , 
                    isSelected ,
                    onCollape : (id : string) => toggleRowExpansion(id) , 
                    onDeleteOrder : (id : string) => handleDeleteOrder(id) , 
                    onDuplicateOrder : (id : string) => handleDuplicateOrder(id) , 
                    onEditOrder : (id : string) => handleEditOrder(id)
                  }}/>
                  )}
                </>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Empty State */}
      {filteredOrders.length === 0 && (
        <div
          className="text-center py-12"
          style={{ color: currentTheme.textMuted }}
        >
          <Package size={48} className="mx-auto mb-4 opacity-50" />
          <p>No orders found</p>
        </div>
      )}
    </Card>
  );
}

interface ExpandedRowProps {
  order : Order , 
  isSelected : boolean,
  onCollape : (id : string) => void , 
  onDeleteOrder : (id : string ) => void, 
  onDuplicateOrder : (id : string) => void , 
  onEditOrder : (id:string) => void , 
  formatDate : (date : string) => React.ReactNode,
  getStatusBadge : (status : string ) => React.ReactNode
}
const ExpandedRow = ({order , isSelected ,onEditOrder , onDeleteOrder , onDuplicateOrder , onCollape , formatDate ,getStatusBadge  }:ExpandedRowProps) => {
   const {state : {currentTheme}} = useStoreConfigCtx()
   return  (
       <TableRow
                      style={{
                        background: `${currentTheme.bgSecondary}`,
                        borderBottom: `1px solid ${currentTheme.border}`,
                        borderLeft: isSelected
                          ? `4px solid ${currentTheme.accent}`
                          : "4px solid transparent",
                      }}
                    >
                      <TableCell colSpan={9}>
                        <div className="p-6 space-y-6">
                          {/* ================= ORDER ITEMS SECTION ================= */}
                          <div>
                            <div
                              className="flex items-center gap-2 mb-4"
                              style={{ color: currentTheme.text }}
                            >
                              <Package size={20} />
                              <h3 className="font-semibold text-lg">Order Items</h3>
                            </div>
                            <div className="space-y-3">
                              {order.order_items.map((item, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center justify-between p-3 rounded"
                                  style={{
                                    background: currentTheme.card,
                                    border: `1px solid ${currentTheme.border}`,
                                  }}
                                >
                                  <div className="flex items-center gap-3">
                                    <div
                                      className="w-12 h-12 rounded flex items-center justify-center"
                                      style={{
                                        background: currentTheme.bgSecondary,
                                      }}
                                    >
                                      <Package
                                        size={20}
                                        style={{ color: currentTheme.textMuted }}
                                      />
                                    </div>
                                    <div>
                                      <p
                                        className="font-medium"
                                        style={{ color: currentTheme.text }}
                                      >
                                        {item.ItemName || `Product ${idx + 1}`}
                                      </p>
                                      <p
                                        className="text-sm"
                                        style={{ color: currentTheme.textMuted }}
                                      >
                                        Quantity: {item.ItemQuantity}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <p
                                      className="font-semibold"
                                      style={{ color: currentTheme.text }}
                                    >
                                      {order.currency} {item.ItemPrice}
                                    </p>
                                    <p
                                      className="text-sm"
                                      style={{ color: currentTheme.textMuted }}
                                    >
                                      Unit Price
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* ================= THREE COLUMN GRID ================= */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* BILLING INFO */}
                            <div
                              className="p-4 rounded"
                              style={{
                                background: currentTheme.card,
                                border: `1px solid ${currentTheme.border}`,
                              }}
                            >
                              <div
                                className="flex items-center gap-2 mb-4"
                                style={{ color: currentTheme.text }}
                              >
                                <CreditCard size={18} />
                                <h4 className="font-semibold">Billing Info</h4>
                              </div>
                              <div className="space-y-3 text-sm">
                                <div>
                                  <p
                                    className="font-medium mb-1"
                                    style={{ color: currentTheme.textMuted }}
                                  >
                                    Payment Method
                                  </p>
                                  <p style={{ color: currentTheme.text }}>
                                    {order.payment_method}
                                  </p>
                                </div>
                                <div>
                                  <p
                                    className="font-medium mb-1"
                                    style={{ color: currentTheme.textMuted }}
                                  >
                                    Payment Status
                                  </p>
                                  <Badge
                                    style={{
                                      background: order.paid
                                        ? "#d1fae5"
                                        : "#fee2e2",
                                      color: order.paid ? "#065f46" : "#991b1b",
                                    }}
                                  >
                                    {order.paid ? "Paid" : "Unpaid"}
                                  </Badge>
                                </div>
                                <div className="pt-3 border-t" style={{ borderColor: currentTheme.border }}>
                                  <div className="flex justify-between mb-2">
                                    <span style={{ color: currentTheme.textMuted }}>
                                      Subtotal
                                    </span>
                                    <span style={{ color: currentTheme.text }}>
                                      {order.currency}{" "}
                                      {(
                                        order.total_amount -
                                        (order.tax || 0) +
                                        (order.discount_amount || 0) -
                                        (order.shipping_cost || 0)
                                      )}
                                    </span>
                                  </div>
                                  {(order.discount_amount || 0) > 0 && (
                                    <div className="flex justify-between mb-2">
                                      <span style={{ color: currentTheme.textMuted }}>
                                        Discount
                                      </span>
                                      <span style={{ color: "#10b981" }}>
                                        -{order.currency} {order.discount_amount}
                                      </span>
                                    </div>
                                  )}
                                  {(order.shipping_cost || 0) > 0 && (
                                    <div className="flex justify-between mb-2">
                                      <span style={{ color: currentTheme.textMuted }}>
                                        Shipping
                                      </span>
                                      <span style={{ color: currentTheme.text }}>
                                        {order.currency} {order.shipping_cost}
                                      </span>
                                    </div>
                                  )}
                                  {(order.tax || 0) > 0 && (
                                    <div className="flex justify-between mb-2">
                                      <span style={{ color: currentTheme.textMuted }}>
                                        Tax
                                      </span>
                                      <span style={{ color: currentTheme.text }}>
                                        {order.currency} {order.tax}
                                      </span>
                                    </div>
                                  )}
                                  <div className="flex justify-between font-semibold pt-2 border-t" style={{ borderColor: currentTheme.border }}>
                                    <span style={{ color: currentTheme.text }}>
                                      Total
                                    </span>
                                    <span style={{ color: currentTheme.text }}>
                                      {order.currency} {order.total_amount}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* SHIPPING INFO */}
                            <div
                              className="p-4 rounded"
                              style={{
                                background: currentTheme.card,
                                border: `1px solid ${currentTheme.border}`,
                              }}
                            >
                              <div
                                className="flex items-center gap-2 mb-4"
                                style={{ color: currentTheme.text }}
                              >
                                <MapPin size={18} />
                                <h4 className="font-semibold">Shipping Info</h4>
                              </div>
                              <div className="space-y-3 text-sm">
                                <div>
                                  <p
                                    className="font-medium mb-1"
                                    style={{ color: currentTheme.textMuted }}
                                  >
                                    Customer Name
                                  </p>
                                  <p style={{ color: currentTheme.text }}>
                                    {order.customer.name}
                                  </p>
                                </div>
                                {order.customer.email && (
                                  <div>
                                    <p
                                      className="font-medium mb-1"
                                      style={{ color: currentTheme.textMuted }}
                                    >
                                      Email
                                    </p>
                                    <p style={{ color: currentTheme.text }}>
                                      {order.customer.email}
                                    </p>
                                  </div>
                                )}
                                {order.customer.phone && (
                                  <div>
                                    <p
                                      className="font-medium mb-1"
                                      style={{ color: currentTheme.textMuted }}
                                    >
                                      Phone
                                    </p>
                                    <p style={{ color: currentTheme.text }}>
                                      {order.customer.phone}
                                    </p>
                                  </div>
                                )}
                                {order.address && (
                                  <div>
                                    <p
                                      className="font-medium mb-1"
                                      style={{ color: currentTheme.textMuted }}
                                    >
                                      Shipping Address
                                    </p>
                                    <p
                                      style={{ color: currentTheme.text }}
                                      className="leading-relaxed"
                                    >
                                      {order.address.address_line1 && (
                                        <>{order.address.address_line1}<br /></>
                                      )}
                                      {order.address.address_line2 && (
                                        <>{order.address.address_line2}<br /></>
                                      )}
                                      {order.address.city && order.address.state && (
                                        <>{order.address.city}, {order.address.state} {order.address.postal_code}<br /></>
                                      )}
                                      {order.address.country}
                                    </p>
                                  </div>
                                )}
                                <div>
                                  <p
                                    className="font-medium mb-1"
                                    style={{ color: currentTheme.textMuted }}
                                  >
                                    Confirmation Status
                                  </p>
                                  <Badge
                                    style={{
                                      background: order.confirmed
                                        ? "#dbeafe"
                                        : "#fef3c7",
                                      color: order.confirmed
                                        ? "#1e40af"
                                        : "#78350f",
                                    }}
                                  >
                                    {order.confirmed ? "Confirmed" : "Pending Confirmation"}
                                  </Badge>
                                </div>
                              </div>
                            </div>

                            {/* ORDER NOTES & DETAILS */}
                            <div
                              className="p-4 rounded"
                              style={{
                                background: currentTheme.card,
                                border: `1px solid ${currentTheme.border}`,
                              }}
                            >
                              <div
                                className="flex items-center gap-2 mb-4"
                                style={{ color: currentTheme.text }}
                              >
                                <FileText size={18} />
                                <h4 className="font-semibold">Additional Info</h4>
                              </div>
                              <div className="space-y-3 text-sm">
                                <div>
                                  <p
                                    className="font-medium mb-1"
                                    style={{ color: currentTheme.textMuted }}
                                  >
                                    Order Date
                                  </p>
                                  <p style={{ color: currentTheme.text }}>
                                    {formatDate(order.created_at)}
                                  </p>
                                </div>
                                <div>
                                  <p
                                    className="font-medium mb-1"
                                    style={{ color: currentTheme.textMuted }}
                                  >
                                    Order Status
                                  </p>
                                  {getStatusBadge(order.status)}
                                </div>
                                {order.notes && (
                                  <div>
                                    <p
                                      className="font-medium mb-1"
                                      style={{ color: currentTheme.textMuted }}
                                    >
                                      Notes
                                    </p>
                                    <p
                                      style={{
                                        color: currentTheme.text,
                                        fontSize: "0.875rem",
                                      }}
                                      className="leading-relaxed"
                                    >
                                      {order.notes}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* ================= ACTION BUTTONS ================= */}
                          <div
                            className="flex items-center gap-3 pt-4 border-t"
                            style={{ borderColor: currentTheme.border }}
                          >
                            <Button
                              onClick={() => onEditOrder(String(order.id))}
                              variant="outline"
                              size="sm"
                              style={{
                                borderColor: currentTheme.border,
                                color: currentTheme.text,
                              }}
                            >
                              <Pencil size={16} className="mr-2" />
                              Edit Order
                            </Button>
                            <Button
                              onClick={() => onDuplicateOrder(String(order.id))}
                              variant="outline"
                              size="sm"
                              style={{
                                borderColor: currentTheme.border,
                                color: currentTheme.text,
                              }}
                            >
                              <Copy size={16} className="mr-2" />
                              Duplicate
                            </Button>
                            <Button
                              onClick={() => onDeleteOrder(String(order.id))}
                              variant="outline"
                              size="sm"
                              style={{
                                borderColor: "#fee2e2",
                                color: "#991b1b",
                                background: "#fef2f2",
                              }}
                            >
                              <Trash2 size={16} className="mr-2" />
                              Delete Order
                            </Button>
                            <div className="ml-auto">
                              <Button
                                onClick={() => onCollape(String(order.id))}
                                variant="ghost"
                                size="sm"
                                style={{
                                  color: currentTheme.textMuted,
                                }}
                              >
                                <ChevronUp size={16} className="mr-2" />
                                Collapse
                              </Button>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
   )
}