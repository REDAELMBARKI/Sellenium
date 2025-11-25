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

export function Materials() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  const [status, setStatus] = useState<"active" | "inactive">("active");
  const { toast } = useToast();

  const { data: materials, isLoading } = useQuery<Variant[]>({
    queryKey: ["/api/admin/variants/material"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertVariant) => {
      await apiRequest("POST", "/api/admin/variants", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/variants/material"] });
      toast({ title: "Material created successfully" });
      handleCloseDialog();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Variant> }) => {
      await apiRequest("PATCH", `/api/admin/variants/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/variants/material"] });
      toast({ title: "Material updated successfully" });
      handleCloseDialog();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/admin/variants/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/variants/material"] });
      toast({ title: "Material deleted successfully" });
    },
  });

  const handleOpenDialog = (material?: Variant) => {
    if (material) {
      setEditingId(material.id);
      setName(material.name);
      setValue(material.value);
      setStatus(material.status as "active" | "inactive");
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
    const data = { type: "material", name, value, status };

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
            Materials
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage product material variants
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()} data-testid="button-add-material">
          <Plus className="mr-2 h-4 w-4" />
          Add Material
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">All Materials</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : materials && materials.length > 0 ? (
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
                {materials.map((material) => (
                  <TableRow key={material.id} data-testid={`row-material-${material.id}`}>
                    <TableCell className="font-medium">{material.name}</TableCell>
                    <TableCell>{material.value}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          material.status === "active"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
                        }
                      >
                        {material.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenDialog(material)}
                          data-testid={`button-edit-${material.id}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteMutation.mutate(material.id)}
                          data-testid={`button-delete-${material.id}`}
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
              No materials yet. Add your first material variant.
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Material" : "Add New Material"}</DialogTitle>
            <DialogDescription>
              {editingId ? "Update material information" : "Create a new material variant"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Material Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Cotton"
                  required
                  data-testid="input-material-name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="value">Material Code</Label>
                <Input
                  id="value"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="e.g., COT"
                  required
                  data-testid="input-material-value"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={(v: "active" | "inactive") => setStatus(v)}>
                  <SelectTrigger data-testid="select-material-status">
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
