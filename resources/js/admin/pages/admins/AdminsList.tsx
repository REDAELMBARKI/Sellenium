// admin/pages/admins/AdminsList.tsx

import { useState } from "react";
import { router, useForm } from "@inertiajs/react";
import { Plus, Pencil, Trash2, Shield } from "lucide-react";

// Types
interface Admin {
    id: string;
    name: string;
    email: string;
    role: "super_admin" | "manager" | "support" | "viewer";
    status: "active" | "inactive";
    lastLogin: string | null;
}

interface AdminsListProps {
    admins: Admin[];
}

// Mock data - replace with Inertia props from Laravel
const mockAdmins: Admin[] = [
    { id: "1", name: "John Admin", email: "john@example.com", role: "super_admin", status: "active", lastLogin: "2024-01-15T10:30:00Z" },
    { id: "2", name: "Sarah Manager", email: "sarah@example.com", role: "manager", status: "active", lastLogin: "2024-01-14T08:15:00Z" },
    { id: "3", name: "Mike Support", email: "mike@example.com", role: "support", status: "inactive", lastLogin: null },
    { id: "4", name: "Anna Viewer", email: "anna@example.com", role: "viewer", status: "active", lastLogin: "2024-01-10T14:00:00Z" },
];

const ADMIN_ROLES = [
    { value: "super_admin", label: "Super Admin", description: "Full access" },
    { value: "manager", label: "Manager", description: "Orders, products, customers" },
    { value: "support", label: "Support", description: "Orders, customers only" },
    { value: "viewer", label: "Viewer", description: "Read-only access" },
];

const formatDateTime = (date: string) => {
    return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(date));
};

export default function AdminsList({ admins = mockAdmins }: AdminsListProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: "",
        email: "",
        password: "",
        role: "manager",
        status: "active" as "active" | "inactive",
    });

    const handleOpenDialog = (admin?: Admin) => {
        if (admin) {
            setEditingAdmin(admin);
            setData({
                name: admin.name,
                email: admin.email,
                password: "",
                role: admin.role,
                status: admin.status,
            });
        } else {
            setEditingAdmin(null);
            reset();
        }
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setEditingAdmin(null);
        reset();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingAdmin) {
            put(`/admin/admins/${editingAdmin.id}`, {
                onSuccess: () => handleCloseDialog(),
            });
        } else {
            post("/admin/admins", {
                onSuccess: () => handleCloseDialog(),
            });
        }
    };

    const handleDelete = (id: string) => {
        if (confirm("Are you sure you want to delete this admin?")) {
            router.delete(`/admin/admins/${id}`);
        }
    };

    return (
        <div className="space-y-6 p-6">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                        Admin Management
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Manage admin users and their permissions
                    </p>
                </div>
                <button
                    onClick={() => handleOpenDialog()}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Admin
                </button>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                        All Admins
                    </h2>
                </div>

                {admins.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-700/50">
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase">
                                        Name
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase">
                                        Email
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase">
                                        Role
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase">
                                        Last Login
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase">
                                        Status
                                    </th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                {admins.map((admin) => (
                                    <tr
                                        key={admin.id}
                                        className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                                    >
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-2">
                                                <Shield className="h-4 w-4 text-slate-400" />
                                                <span className="font-medium text-slate-900 dark:text-slate-100">
                                                    {admin.name}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-slate-500 dark:text-slate-400">
                                            {admin.email}
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className="inline-flex px-2.5 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                                                {ADMIN_ROLES.find((r) => r.value === admin.role)?.label || admin.role}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-slate-500 dark:text-slate-400">
                                            {admin.lastLogin ? formatDateTime(admin.lastLogin) : "Never"}
                                        </td>
                                        <td className="px-4 py-4">
                                            <span
                                                className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${
                                                    admin.status === "active"
                                                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                                        : "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-400"
                                                }`}
                                            >
                                                {admin.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleOpenDialog(admin)}
                                                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(admin.id)}
                                                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="py-12 text-center text-slate-500 dark:text-slate-400">
                        No admins yet. Create your first admin user.
                    </div>
                )}
            </div>

            {/* Modal */}
            {isDialogOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <div
                            className="fixed inset-0 bg-black/50"
                            onClick={handleCloseDialog}
                        />
                        <div className="relative w-full max-w-2xl bg-white dark:bg-slate-800 rounded-xl shadow-xl">
                            <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                                    {editingAdmin ? "Edit Admin" : "Create New Admin"}
                                </h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    {editingAdmin ? "Update admin details" : "Add a new admin user"}
                                </p>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="p-4 space-y-4">
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                                Full Name
                                            </label>
                                            <input
                                                type="text"
                                                value={data.name}
                                                onChange={(e) => setData("name", e.target.value)}
                                                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="John Doe"
                                                required
                                            />
                                            {errors.name && (
                                                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                value={data.email}
                                                onChange={(e) => setData("email", e.target.value)}
                                                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="john@example.com"
                                                required
                                            />
                                            {errors.email && (
                                                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                                Password {editingAdmin && "(leave blank to keep current)"}
                                            </label>
                                            <input
                                                type="password"
                                                value={data.password}
                                                onChange={(e) => setData("password", e.target.value)}
                                                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder={editingAdmin ? "••••••••" : "Enter password"}
                                                required={!editingAdmin}
                                            />
                                            {errors.password && (
                                                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                                Role
                                            </label>
                                            <select
                                                value={data.role}
                                                onChange={(e) => setData("role", e.target.value)}
                                                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            >
                                                {ADMIN_ROLES.map((r) => (
                                                    <option key={r.value} value={r.value}>
                                                        {r.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                            Status
                                        </label>
                                        <select
                                            value={data.status}
                                            onChange={(e) => setData("status", e.target.value as "active" | "inactive")}
                                            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 p-4 border-t border-slate-200 dark:border-slate-700">
                                    <button
                                        type="button"
                                        onClick={handleCloseDialog}
                                        className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
                                    >
                                        {processing ? "Saving..." : editingAdmin ? "Update" : "Create"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}