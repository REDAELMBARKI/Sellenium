import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Eye } from "lucide-react";
import type { Customer } from "@shared/schema";
import { formatCurrency, formatDateTime } from "../../utils/helpers";

export function CustomersList() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: customers, isLoading } = useQuery<Customer[]>({
    queryKey: ["/api/admin/customers"],
  });

  const filteredCustomers = customers?.filter((customer) =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold" data-testid="text-page-title">
          Customers
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage your customer base
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
              data-testid="input-search"
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : filteredCustomers && filteredCustomers.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead>Total Spent</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.map((customer) => (
                    <TableRow key={customer.id} data-testid={`row-customer-${customer.id}`}>
                      <TableCell className="font-medium">{customer.name}</TableCell>
                      <TableCell className="text-muted-foreground">{customer.email}</TableCell>
                      <TableCell>
                        {[customer.city, customer.country].filter(Boolean).join(", ") || "-"}
                      </TableCell>
                      <TableCell>{customer.orderCount || 0}</TableCell>
                      <TableCell className="font-semibold">
                        {formatCurrency(customer.totalSpent || 0)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            customer.status === "active"
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
                          }
                        >
                          {customer.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Link href={`/admin/customers/${customer.id}`}>
                          <Button
                            variant="ghost"
                            size="icon"
                            data-testid={`button-view-${customer.id}`}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="py-12 text-center text-sm text-muted-foreground">
              {searchTerm ? "No customers found matching your search" : "No customers yet"}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
