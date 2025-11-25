import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Pencil, Trash2 } from "lucide-react";
import type { Variant, InsertVariant } from "@shared/schema";
import { useToast } from "../../hooks/useToast";
import { queryClient, apiRequest } from "@/lib/queryClient";

export function FitTypes() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  const [status, setStatus] = useState<"active" | "inactive">("active");
  const { toast } = useToast();

  const { data: fitTypes, isLoading } = useQuery<Variant[]>({
    queryKey: ["/api/admin/variants/fit"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertVariant) => {
      await apiRequest("POST", "/api/admin/variants", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/variants/fit"] });
      toast({ title: "Fit type created successfully" });
      handleCloseDialog();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Variant> }) => {
      await apiRequest("PATCH", `/api/admin/variants/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/variants/fit"] });
      toast({ title: "Fit type updated successfully" });
      handleCloseDialog();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/admin/variants/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/variants/fit"] });
      toast({ title: "Fit type deleted successfully" });
    },
  });

  const handleOpenDialog = (fitType?: Variant) => {
    if (fitType) {
      setEditingId(fitType.id);
      setName(fitType.name);
      setValue(fitType.value);
      setStatus(fitType.status as "active" | "inactive");
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingId(null);
    setName("");
    setValue("");
    setStatus("active");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = { type: "fit", name, value, status };

    if (editingId) {
      updateMutation.mutate({ id: editingId, data });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold" data-testid="text-page-title">
            Fit Types
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage product fit type variants
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()} data-testid="button-add-fit-type">
          <Plus className="mr-2 h-4 w-4" />
          Add Fit Type
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">All Fit Types</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : fitTypes && fitTypes.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fitTypes.map((fitType) => (
                  <TableRow key={fitType.id} data-testid={`row-fit-type-${fitType.id}`}>
                    <TableCell className="font-medium">{fitType.name}</TableCell>
                    <TableCell>{fitType.value}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          fitType.status === "active"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
                        }
                      >
                        {fitType.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenDialog(fitType)}
                          data-testid={`button-edit-${fitType.id}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteMutation.mutate(fitType.id)}
                          data-testid={`button-delete-${fitType.id}`}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="py-12 text-center text-sm text-muted-foreground">
              No fit types yet. Add your first fit type variant.
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Fit Type" : "Add New Fit Type"}</DialogTitle>
            <DialogDescription>
              {editingId ? "Update fit type information" : "Create a new fit type variant"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Fit Type Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Slim Fit"
                  required
                  data-testid="input-fit-type-name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="value">Fit Type Code</Label>
                <Input
                  id="value"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="e.g., SLIM"
                  required
                  data-testid="input-fit-type-value"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={(v: "active" | "inactive") => setStatus(v)}>
                  <SelectTrigger data-testid="select-fit-type-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseDialog}
                data-testid="button-cancel"
              >
                Cancel
              </Button>
              <Button type="submit" data-testid="button-save">
                {editingId ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
