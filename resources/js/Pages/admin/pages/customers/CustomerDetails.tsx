import { useParams } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Ban, Check } from "lucide-react";
import { Link } from "wouter";
import type { CustomerWithOrders } from "../../types";
import { formatCurrency, formatDateTime } from "../../utils/helpers";
import { ORDER_STATUSES } from "../../utils/constants";
import { useToast } from "../../hooks/useToast";
import { queryClient, apiRequest } from "@/lib/queryClient";

export function CustomerDetails() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();

  const { data: customer, isLoading } = useQuery<CustomerWithOrders>({
    queryKey: ["/api/admin/customers", id],
  });

  const updateStatusMutation = useMutation({
    mutationFn: async (status: string) => {
      await apiRequest("PATCH", `/api/admin/customers/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/customers", id] });
      toast({ title: "Customer status updated successfully" });
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid gap-6 lg:grid-cols-3">
          <Skeleton className="h-96" />
          <div className="lg:col-span-2">
            <Skeleton className="h-96" />
          </div>
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <p className="text-muted-foreground">Customer not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin/customers">
            <Button variant="ghost" size="icon" data-testid="button-back">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-semibold" data-testid="text-customer-name">
              {customer.name}
            </h1>
            <p className="text-sm text-muted-foreground">
              Member since {formatDateTime(customer.createdAt)}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {customer.status === "active" ? (
            <Button
              variant="outline"
              onClick={() => updateStatusMutation.mutate("blocked")}
              disabled={updateStatusMutation.isPending}
              data-testid="button-block-customer"
            >
              <Ban className="mr-2 h-4 w-4" />
              Block Customer
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={() => updateStatusMutation.mutate("active")}
              disabled={updateStatusMutation.isPending}
              data-testid="button-unblock-customer"
            >
              <Check className="mr-2 h-4 w-4" />
              Unblock Customer
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Customer Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{customer.email}</p>
            </div>
            {customer.phone && (
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{customer.phone}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-muted-foreground">Address</p>
              <p className="font-medium">
                {customer.address || "-"}
              </p>
              {customer.city && (
                <p className="text-muted-foreground">
                  {[customer.city, customer.postalCode, customer.country]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              )}
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge
                className={
                  customer.status === "active"
                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                }
              >
                {customer.status}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Orders</p>
              <p className="text-2xl font-bold">{customer.orderCount}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Spent</p>
              <p className="text-2xl font-bold">{formatCurrency(customer.totalSpent)}</p>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Order History</CardTitle>
            </CardHeader>
            <CardContent>
              {customer.orders && customer.orders.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {customer.orders.map((order) => (
                        <TableRow key={order.id} data-testid={`row-order-${order.id}`}>
                          <TableCell className="font-medium">
                            <Link href={`/admin/orders/${order.id}`}>
                              <span className="hover:underline">{order.orderNumber}</span>
                            </Link>
                          </TableCell>
                          <TableCell>
                            <Badge className={ORDER_STATUSES.find(s => s.value === order.status)?.color}>
                              {ORDER_STATUSES.find(s => s.value === order.status)?.label}
                            </Badge>
                          </TableCell>
                          <TableCell>{formatCurrency(order.total)}</TableCell>
                          <TableCell className="text-muted-foreground">
                            {formatDateTime(order.createdAt)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="py-12 text-center text-sm text-muted-foreground">
                  No orders yet
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
