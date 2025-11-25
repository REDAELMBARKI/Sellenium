import { useParams } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Printer, Package } from "lucide-react";
import { Link } from "wouter";
import type { OrderWithItems } from "../../types";
import { formatCurrency, formatDateTime } from "../../utils/helpers";
import { ORDER_STATUSES, PAYMENT_STATUSES } from "../../utils/constants";
import { useToast } from "../../hooks/useToast";
import { queryClient, apiRequest } from "@/lib/queryClient";

export function OrderDetails() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();

  const { data: order, isLoading } = useQuery<OrderWithItems>({
    queryKey: ["/api/admin/orders", id],
  });

  const updateStatusMutation = useMutation({
    mutationFn: async (status: string) => {
      await apiRequest("PATCH", `/api/admin/orders/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/orders", id] });
      toast({ title: "Order status updated successfully" });
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-96" />
          </div>
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <p className="text-muted-foreground">Order not found</p>
      </div>
    );
  }

  const subtotal = parseFloat(order.subtotal);
  const tax = parseFloat(order.tax || "0");
  const shipping = parseFloat(order.shipping || "0");
  const discount = parseFloat(order.discount || "0");

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin/orders">
            <Button variant="ghost" size="icon" data-testid="button-back">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-semibold" data-testid="text-order-number">
              {order.orderNumber}
            </h1>
            <p className="text-sm text-muted-foreground">
              Placed on {formatDateTime(order.createdAt)}
            </p>
          </div>
        </div>
        <Button variant="outline" data-testid="button-print">
          <Printer className="mr-2 h-4 w-4" />
          Print Invoice
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex gap-4" data-testid={`order-item-${item.id}`}>
                    <div className="flex h-16 w-16 items-center justify-center rounded bg-muted">
                      {item.productImage ? (
                        <img
                          src={item.productImage}
                          alt={item.productName}
                          className="h-full w-full rounded object-cover"
                        />
                      ) : (
                        <Package className="h-6 w-6 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{item.productName}</p>
                      <p className="text-sm text-muted-foreground">
                        Qty: {item.quantity} × {formatCurrency(item.price)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatCurrency(item.total)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-6" />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Discount</span>
                    <span className="text-green-600 dark:text-green-400">
                      -{formatCurrency(discount)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax</span>
                  <span>{formatCurrency(tax)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{formatCurrency(shipping)}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span className="text-lg">{formatCurrency(order.total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Shipping Address</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm">
                <p className="font-medium">{order.customerName}</p>
                {order.shippingAddress && <p className="text-muted-foreground mt-1">{order.shippingAddress}</p>}
                <p className="text-muted-foreground">
                  {[order.shippingCity, order.shippingPostalCode].filter(Boolean).join(", ")}
                </p>
                {order.shippingCountry && <p className="text-muted-foreground">{order.shippingCountry}</p>}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Order Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Update Status</label>
                <Select
                  value={order.status}
                  onValueChange={(value) => updateStatusMutation.mutate(value)}
                  disabled={updateStatusMutation.isPending}
                >
                  <SelectTrigger data-testid="select-order-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ORDER_STATUSES.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Current Status</p>
                <Badge className={ORDER_STATUSES.find(s => s.value === order.status)?.color}>
                  {ORDER_STATUSES.find(s => s.value === order.status)?.label}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{order.customerName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{order.customerEmail}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Payment Status</p>
                <Badge
                  className={
                    PAYMENT_STATUSES.find(s => s.value === order.paymentStatus)?.color
                  }
                >
                  {PAYMENT_STATUSES.find(s => s.value === order.paymentStatus)?.label}
                </Badge>
              </div>
              {order.paymentMethod && (
                <div>
                  <p className="text-sm text-muted-foreground">Payment Method</p>
                  <p className="font-medium capitalize">{order.paymentMethod}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {order.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Order Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{order.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
