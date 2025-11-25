import { useState } from "react";
import { Plus, Pencil, Trash2, FolderTree } from "lucide-react";
import { AdminLayout } from "@/admin/components/layout/AdminLayout";

// Placeholder data
const INITIAL_CATEGORIES = [
  {
    id: "1",
    name: "Men's Clothing",
    slug: "mens-clothing",
    description: "Clothing and accessories for men",
    parentId: null,
    status: "active",
  },
  {
    id: "2",
    name: "Women's Clothing",
    slug: "womens-clothing",
    description: "Clothing and accessories for women",
    parentId: null,
    status: "active",
  },
  {
    id: "3",
    name: "T-Shirts",
    slug: "t-shirts",
    description: "Casual t-shirts for everyday wear",
    parentId: "1",
    status: "active",
  },
  {
    id: "4",
    name: "Dresses",
    slug: "dresses",
    description: "Elegant dresses for all occasions",
    parentId: "2",
    status: "active",
  },
  {
    id: "5",
    name: "Accessories",
    slug: "accessories",
    description: "Fashion accessories",
    parentId: null,
    status: "inactive",
  },
];

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  parentId: string | null;
  status: string;
};

export function CategoriesList() {
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [parentId, setParentId] = useState("");
  const [status, setStatus] = useState<"active" | "inactive">("active");

  const handleOpenDialog = (category?: Category) => {
    if (category) {
      setEditingId(category.id);
      setName(category.name);
      setSlug(category.slug);
      setDescription(category.description || "");
      setParentId(category.parentId || "");
      setStatus(category.status as "active" | "inactive");
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingId(null);
    setName("");
    setSlug("");
    setDescription("");
    setParentId("");
    setStatus("active");
  };

  const slugify = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleNameChange = (value: string) => {
    setName(value);
    if (!editingId) {
      setSlug(slugify(value));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      // Update existing category
      setCategories(prev =>
        prev.map(cat =>
          cat.id === editingId
            ? { ...cat, name, slug, description, parentId: parentId || null, status }
            : cat
        )
      );
    } else {
      // Create new category
      const newCategory: Category = {
        id: Date.now().toString(),
        name,
        slug,
        description,
        parentId: parentId || null,
        status,
      };
      setCategories(prev => [...prev, newCategory]);
    }
    
    handleCloseDialog();
  };

  const handleDelete = () => {
    if (deleteId) {
      setCategories(prev => prev.filter(cat => cat.id !== deleteId));
      setDeleteId(null);
    }
  };

  const parentCategories = categories.filter((c) => !c.parentId);

  return (
    <div className="space-y-6 p-6 bg-gray-900 min-h-screen text-white">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Categories</h1>
          <p className="text-sm text-gray-400">
            Organize your products into categories
          </p>
        </div>
        <button
          onClick={() => handleOpenDialog()}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Category
        </button>
      </div>

      <div className="bg-gray-800 rounded-lg shadow-lg">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-lg font-semibold">All Categories</h2>
        </div>
        <div className="p-6">
          {categories.length > 0 ? (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 font-medium text-gray-400">Name</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-400">Slug</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-400">Parent Category</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-400">Status</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <FolderTree className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">{category.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-sm text-gray-400">{category.slug}</td>
                    <td className="py-3 px-4 text-gray-400">
                      {category.parentId
                        ? categories.find((c) => c.id === category.parentId)?.name || "-"
                        : "-"}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          category.status === "active"
                            ? "bg-green-900/30 text-green-400"
                            : "bg-gray-700 text-gray-400"
                        }`}
                      >
                        {category.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleOpenDialog(category)}
                          className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleteId(category.id)}
                          className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-red-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="py-12 text-center text-sm text-gray-400">
              No categories yet. Create your first category.
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Dialog */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-xl font-semibold">
                {editingId ? "Edit Category" : "Add New Category"}
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                {editingId ? "Update category information" : "Create a new category"}
              </p>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="p-6 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Category Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      placeholder="e.g., Men's Clothing"
                      required
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Slug</label>
                    <input
                      type="text"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      placeholder="mens-clothing"
                      required
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Category description"
                    rows={3}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Parent Category</label>
                    <select
                      value={parentId}
                      onChange={(e) => setParentId(e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">None (Top Level)</option>
                      {parentCategories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Status</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as "active" | "inactive")}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="p-6 border-t border-gray-700 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseDialog}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
                >
                  {editingId ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2">Delete Category</h2>
              <p className="text-gray-400">
                Are you sure you want to delete this category? This action cannot be undone.
              </p>
            </div>
            <div className="p-6 border-t border-gray-700 flex justify-end gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


CategoriesList.layout = (page:any) => <AdminLayout children={page} />