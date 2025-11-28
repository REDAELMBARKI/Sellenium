import { useState } from "react";
import { Plus, Pencil, Trash2, Shield, Check, Upload } from "lucide-react";
import { DeleteConfirmationModal } from "@/components/ui/DeleteConfirmationModal";
import { AdminLayout } from "@/admin/components/layout/AdminLayout";
import { SectionHeader } from "@/admin/components/layout/SectionHeader";
import { Button } from "@/components/ui/button";
import { createPortal } from "react-dom";
import SelectByRadix from "@/components/ui/SelectByRadix";

interface Admin {
    id: string;
    name: string;
    email: string;
    role: "super_admin" | "manager" | "support" | "viewer";
    status: "active" | "inactive";
    lastActivity: string | null;
    profilePhoto?: string;
    permissions: string[];
}

interface FormData {
    name: string;
    email: string;
    password: string;
    role: "super_admin" | "manager" | "support" | "viewer";
    status: "active" | "inactive";
    permissions: string[];
    profilePhoto: File | null;
}

const mockAdmins: Admin[] = [
    {
        id: "1",
        name: "John Admin",
        email: "john@example.com",
        role: "super_admin",
        status: "active",
        lastActivity: "Updated product - 2h ago",
        permissions: [
            "manage_products",
            "orders",
            "customers",
            "view_reports",
            "settings",
        ],
    },
    {
        id: "2",
        name: "Sarah Manager",
        email: "sarah@example.com",
        role: "manager",
        status: "active",
        lastActivity: "Processed order - 1d ago",
        permissions: ["manage_products", "orders", "customers", "view_reports"],
    },
    {
        id: "3",
        name: "Mike Support",
        email: "mike@example.com",
        role: "support",
        status: "inactive",
        lastActivity: null,
        permissions: ["orders", "customers"],
    },
    {
        id: "4",
        name: "Anna Viewer",
        email: "anna@example.com",
        role: "viewer",
        status: "active",
        lastActivity: "Viewed reports - 3d ago",
        permissions: ["view_reports"],
    },
];

const ADMIN_ROLES = [
    { value: "super_admin", label: "Super Admin", description: "Full access" },
    {
        value: "manager",
        label: "Manager",
        description: "Orders, products, customers",
    },
    {
        value: "support",
        label: "Support",
        description: "Orders, customers only",
    },
    { value: "viewer", label: "Viewer", description: "Read-only access" },
];

const PERMISSIONS = [
    { value: "manage_products", label: "Manage Products" },
    { value: "orders", label: "Orders" },
    { value: "customers", label: "Customers" },
    { value: "view_reports", label: "View Reports" },
    { value: "settings", label: "Settings" },
];

export default function AdminsList() {
    const [admins, setAdmins] = useState<Admin[]>(mockAdmins);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [adminToDelete, setAdminToDelete] = useState<Admin | null>(null);
    const [profilePhotoPreview, setProfilePhotoPreview] = useState<
        string | null
    >(null);
    const [processing, setProcessing] = useState(false);


    const [data, setData] = useState<FormData>({
        name: "",
        email: "",
        password: "",
        role: "manager",
        status: "active",
        permissions: [],
        profilePhoto: null,
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
                permissions: admin.permissions || [],
                profilePhoto: null,
            });
            setProfilePhotoPreview(admin.profilePhoto || null);
        } else {
            setEditingAdmin(null);
            setData({
                name: "",
                email: "",
                password: "",
                role: "manager",
                status: "active",
                permissions: [],
                profilePhoto: null,
            });
            setProfilePhotoPreview(null);
        }
        setIsDialogOpen(true);
    };

    const handleDelete = (admin: Admin) => {
        setAdminToDelete(admin);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (adminToDelete) {
            setAdmins(admins.filter((a) => a.id !== adminToDelete.id));
            setIsDeleteModalOpen(false);
            setAdminToDelete(null);
        }
    };
   
    const handleDeleteFromModal = () => {
        if (editingAdmin) {
            handleCloseDialog();
            setAdminToDelete(editingAdmin);
            setIsDeleteModalOpen(true);
        }
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setEditingAdmin(null);
        setProfilePhotoPreview(null);
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData({ ...data, profilePhoto: file });
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePhotoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const togglePermission = (permission: string) => {
        const newPermissions = data.permissions.includes(permission)
            ? data.permissions.filter((p) => p !== permission)
            : [...data.permissions, permission];
        setData({ ...data, permissions: newPermissions });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        setTimeout(() => {
            if (editingAdmin) {
                setAdmins(
                    admins.map((a) =>
                        a.id === editingAdmin.id
                            ? {
                                  ...a,
                                  name: data.name,
                                  email: data.email,
                                  role: data.role,
                                  status: data.status,
                                  permissions: data.permissions,
                                  profilePhoto:
                                      profilePhotoPreview || a.profilePhoto,
                              }
                            : a
                    )
                );
            } else {
                const newAdmin: Admin = {
                    id: String(Date.now()),
                    name: data.name,
                    email: data.email,
                    role: data.role,
                    status: data.status,
                    permissions: data.permissions,
                    lastActivity: "Just added",
                    profilePhoto: profilePhotoPreview || undefined,
                };
                setAdmins([...admins, newAdmin]);
            }
            setProcessing(false);
            handleCloseDialog();
        }, 500);
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 ">
            <div className="space-y-6 p-6 max-w-7xl mx-auto">
               

                <SectionHeader title="Admin Management Section" 
                  description="Manage admin users and their permissions"
                  >
                    <Button 
                     onClick={() => handleOpenDialog()}
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Admin
                    </Button>
                </SectionHeader>

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
                                            Last Activity
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
                                                    {ADMIN_ROLES.find(
                                                        (r) =>
                                                            r.value ===
                                                            admin.role
                                                    )?.label || admin.role}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 text-slate-500 dark:text-slate-400">
                                                {admin.lastActivity ||
                                                    "No recent activity"}
                                            </td>
                                            <td className="px-4 py-4">
                                                <span
                                                    className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${
                                                        admin.status ===
                                                        "active"
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
                                                        onClick={() =>
                                                            handleOpenDialog(
                                                                admin
                                                            )
                                                        }
                                                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleDelete(admin)
                                                        }
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

                <DeleteConfirmationModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => {
                        setIsDeleteModalOpen(false);
                        setAdminToDelete(null);
                    }}
                    onConfirm={confirmDelete}
                    name={adminToDelete?.name || ""}
                    entityType="admin"
                />
                {isDialogOpen ? (
                    <AdminAddEditForm 
                        asModel={true}
                        editingAdmin={editingAdmin}
                        profilePhotoPreview={profilePhotoPreview}
                        data={data}
                        setData={setData}
                        handleDeleteFromModal={handleDeleteFromModal}
                        handleCloseDialog={handleCloseDialog}
                        handleSubmit={handleSubmit}
                        handlePhotoChange={handlePhotoChange}
                        togglePermission={togglePermission} 
                        processing={processing}
                    />
                ) : null}
            </div>
        </div>
    );
}

interface AdminAddEditFormProps {
    asModel?: boolean ;
    editingAdmin : Admin | null ;
    profilePhotoPreview : string | null;
    data : FormData;
    setData :React.Dispatch<React.SetStateAction<FormData>>;
    handleDeleteFromModal : () => void ;
    handleCloseDialog : () => void ; 
    handleSubmit :  (e: React.FormEvent) => void ; 
    handlePhotoChange : (e: React.ChangeEvent<HTMLInputElement>) => void ; 
    togglePermission : (permission: string) => void
    processing : boolean
}

function AdminAddEditForm({
    asModel =  false,
    editingAdmin,
    profilePhotoPreview,
    data,
    setData,
    handleDeleteFromModal , 
    handleCloseDialog , 
    handleSubmit , 
    handlePhotoChange , 
    togglePermission , 
    processing , 

  
}: AdminAddEditFormProps) {
    

    
   
    const Form =  (
        <>
            <div className="fixed inset-0 z-50 overflow-y-auto" 
            style={{
                    backdropFilter: "blur(10px)",
                    background: "rgba(0, 0, 0, 0.4)",
                }}
            >
                <div className="flex min-h-full items-center justify-center p-4">
                    <div
                        className="fixed inset-0 bg-black/50 "
                        
                        onClick={handleCloseDialog}
                    />
                    <div  className="relative  w-full max-w-2xl  bg-white dark:bg-slate-800  shadow-xl max-h-[90vh] overflow-hidden "
                     style={{borderRadius : "30px" }}
                    >
                        <div className="p-4 border-b border-slate-200 dark:border-slate-700 absolute w-full top-0 bg-white dark:bg-slate-800 ">
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                                {editingAdmin
                                    ? "Edit Admin"
                                    : "Create New Admin"}
                            </h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                {editingAdmin
                                    ? "Update admin details"
                                    : "Add a new admin user"}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} >
                            <div className="p-4 space-y-6  ">
                                <div style={{marginTop : "100px"}}>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                                        Profile Photo
                                    </label>
                                    <div className="flex items-center gap-4">
                                        <div className="relative">
                                            <div className="w-20 h-20 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center overflow-hidden">
                                                {profilePhotoPreview ? (
                                                    <img
                                                        src={
                                                            profilePhotoPreview
                                                        }
                                                        alt="Profile"
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <Shield className="h-8 w-8 text-slate-400" />
                                                )}
                                            </div>
                                        </div>
                                        <label className="cursor-pointer">
                                            <div className="inline-flex items-center px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                                                <Upload className="mr-2 h-4 w-4" />
                                                Upload Photo
                                            </div>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handlePhotoChange}
                                                className="hidden"
                                            />
                                        </label>
                                    </div>
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            value={data.name}
                                            onChange={(e) =>
                                                setData({
                                                    ...data,
                                                    name: e.target.value,
                                                })
                                            }
                                            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="John Doe"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            value={data.email}
                                            onChange={(e) =>
                                                setData({
                                                    ...data,
                                                    email: e.target.value,
                                                })
                                            }
                                            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="john@example.com"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                            Password{" "}
                                            {editingAdmin &&
                                                "(leave blank to keep current)"}
                                        </label>
                                        <input
                                            type="password"
                                            value={data.password}
                                            onChange={(e) =>
                                                setData({
                                                    ...data,
                                                    password: e.target.value,
                                                })
                                            }
                                            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder={
                                                editingAdmin
                                                    ? "••••••••"
                                                    : "Enter password"
                                            }
                                            required={!editingAdmin}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                            Role
                                        </label>
                                        <select
                                            value={data.role}
                                            onChange={(e) =>
                                                setData({
                                                    ...data,
                                                    role: e.target
                                                        .value as Admin["role"],
                                                })
                                            }
                                            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            {ADMIN_ROLES.map((r) => (
                                                <option
                                                    key={r.value}
                                                    value={r.value}
                                                >
                                                    {r.label}
                                                </option>
                                            ))}
                                        </select>


                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                                        Permissions
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {PERMISSIONS.map((permission) => {
                                            const isSelected =
                                                data.permissions.includes(
                                                    permission.value
                                                );
                                            return (
                                                <button
                                                    key={permission.value}
                                                    type="button"
                                                    onClick={() =>
                                                        togglePermission(
                                                            permission.value
                                                        )
                                                    }
                                                    className={`inline-flex items-center px-4 py-2.5 rounded-lg border-2 transition-all ${
                                                        isSelected
                                                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400"
                                                            : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-400 dark:hover:border-slate-500"
                                                    }`}
                                                >
                                                    {isSelected && (
                                                        <Check className="mr-2 h-4 w-4" />
                                                    )}
                                                    {permission.label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                                        Status
                                    </label>
                                    <div className="flex items-center gap-3">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setData({
                                                    ...data,
                                                    status:
                                                        data.status === "active"
                                                            ? "inactive"
                                                            : "active",
                                                })
                                            }
                                            className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors ${
                                                data.status === "active"
                                                    ? "bg-green-500"
                                                    : "bg-slate-300 dark:bg-slate-600"
                                            }`}
                                        >
                                            <span
                                                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                                                    data.status === "active"
                                                        ? "translate-x-8"
                                                        : "translate-x-1"
                                                }`}
                                            />
                                        </button>
                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                            {data.status === "active"
                                                ? "Active"
                                                : "Inactive"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between items-center p-4 border-t border-slate-200 dark:border-slate-700 sticky bottom-0 bg-white dark:bg-slate-800">
                                <div>
                                    {editingAdmin && (
                                        <button
                                            type="button"
                                            onClick={handleDeleteFromModal}
                                            className="inline-flex items-center px-4 py-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                                        >
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Delete Admin
                                        </button>
                                    )}
                                </div>
                                <div className="flex gap-3">
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
                                        {processing
                                            ? "Saving..."
                                            : editingAdmin
                                            ? "Update"
                                            : "Create"}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );




    return asModel ? createPortal(Form , document.body) : Form ;
}

AdminsList.layout = (page: any) => <AdminLayout children={page} />;
