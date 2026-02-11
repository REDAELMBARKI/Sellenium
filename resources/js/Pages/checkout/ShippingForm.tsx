// Pages/Checkout/components/ShippingForm.tsx
import { Mail, MapPin, Phone, User } from "lucide-react";

interface ShippingFormProps {
    data: any;
    onChange: (data: any) => void;
    theme: any;
}

export default function ShippingForm({
    data,
    onChange,
    theme,
}: ShippingFormProps) {
    const handleChange = (field: string, value: string) => {
        onChange({ ...data, [field]: value });
    };

    const handleAddressChange = (field: string, value: string) => {
        onChange({
            ...data,
            address: { ...data.address, [field]: value },
        });
    };

    return (
        <div
            style={{
                backgroundColor: theme.card,
                borderColor: theme.border,
            }}
            className="border rounded-lg p-6"
        >
            <h2 style={{ color: theme.text }} className="text-xl font-bold mb-4">
                Shipping Information
            </h2>

            <div className="space-y-4">
                {/* Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label
                            style={{ color: theme.textSecondary }}
                            className="block text-sm mb-2"
                        >
                            <User size={16} className="inline mr-2" />
                            First Name *
                        </label>
                        <input
                            type="text"
                            
                            value={data.first_name}
                            onChange={(e) => handleAddressChange("first_name", e.target.value)}
                            style={{
                                borderColor: theme.border,
                                backgroundColor: theme.bgSecondary,
                                color: theme.text,
                            }}
                            className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2"
                            placeholder="John Doe"
                        />
                    </div>
                    <div>
                        <label
                            style={{ color: theme.textSecondary }}
                            className="block text-sm mb-2"
                        >
                            <User size={16} className="inline mr-2" />
                            Last Name *
                        </label>
                        <input
                            type="text"
                            
                            value={data.last_name}
                            onChange={(e) => handleAddressChange("last_name", e.target.value)}
                            style={{
                                borderColor: theme.border,
                                backgroundColor: theme.bgSecondary,
                                color: theme.text,
                            }}
                            className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2"
                            placeholder="John Doe"
                        />
                    </div>
                </div>
                {/* Email & Phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label
                            style={{ color: theme.textSecondary }}
                            className="block text-sm mb-2"
                        >
                            <Mail size={16} className="inline mr-2" />
                            Email *
                        </label>
                        <input
                            type="email"
                            
                            value={data.email}
                            onChange={(e) =>
                                handleAddressChange("email", e.target.value)
                            }
                            style={{
                                borderColor: theme.border,
                                backgroundColor: theme.bgSecondary,
                                color: theme.text,
                            }}
                            className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2"
                            placeholder="john@example.com"
                        />
                    </div>

                    <div>
                        <label
                            style={{ color: theme.textSecondary }}
                            className="block text-sm mb-2"
                        >
                            <Phone size={16} className="inline mr-2" />
                            Phone *
                        </label>
                        <input
                            type="tel"
                            
                            value={data.phone}
                            onChange={(e) =>
                                handleAddressChange("phone", e.target.value)
                            }
                            style={{
                                borderColor: theme.border,
                                backgroundColor: theme.bgSecondary,
                                color: theme.text,
                            }}
                            className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2"
                            placeholder="+1 (555) 123-4567"
                        />
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-4">

                    {/* Address 1 */}
                <div>
                    <label
                        style={{ color: theme.textSecondary }}
                        className="block text-sm mb-2"
                    >
                        <MapPin size={16} className="inline mr-2" />
                        Address 1 *
                    </label>
                    <input
                        type="text"
                        
                        value={data.address.address_line1}
                        onChange={(e) =>
                            handleAddressChange("address_line1", e.target.value)
                        }
                        style={{
                            borderColor: theme.border,
                            backgroundColor: theme.bgSecondary,
                            color: theme.text,
                        }}
                        className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2"
                        placeholder="123 Main Street"
                    />
                </div>

                {/* address 2 */}
                <div>
                    <label
                        style={{ color: theme.textSecondary }}
                        className="block text-sm mb-2"
                    >
                        <MapPin size={16} className="inline mr-2" />
                         Address 2 (optional)
                    </label>
                    <input
                        type="text"
                        
                        value={data.address.address_line2}
                        onChange={(e) =>
                            handleAddressChange("address_line2", e.target.value)
                        }
                        style={{
                            borderColor: theme.border,
                            backgroundColor: theme.bgSecondary,
                            color: theme.text,
                        }}
                        className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2"
                        placeholder="123 Main Street"
                    />
                </div>
                </div>

                {/* City, State, ZIP */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label
                            style={{ color: theme.textSecondary }}
                            className="block text-sm mb-2"
                        >
                            City *
                        </label>
                        <input
                            type="text"
                            
                            value={data.address.city}
                            onChange={(e) =>
                                handleAddressChange("city", e.target.value)
                            }
                            style={{
                                borderColor: theme.border,
                                backgroundColor: theme.bgSecondary,
                                color: theme.text,
                            }}
                            className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2"
                            placeholder="New York"
                        />
                    </div>

                    <div>
                        <label
                            style={{ color: theme.textSecondary }}
                            className="block text-sm mb-2"
                        >
                            State *
                        </label>
                        <input
                            type="text"
                            
                            value={data.address.state}
                            onChange={(e) =>
                                handleAddressChange("state", e.target.value)
                            }
                            style={{
                                borderColor: theme.border,
                                backgroundColor: theme.bgSecondary,
                                color: theme.text,
                            }}
                            className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2"
                            placeholder="NY"
                        />
                    </div>

                    <div>
                        <label
                            style={{ color: theme.textSecondary }}
                            className="block text-sm mb-2"
                        >
                            ZIP Code *
                        </label>
                        <input
                            type="text"
                            
                            value={data.address.postal_code}
                            onChange={(e) =>
                                handleAddressChange("postal_code", e.target.value)
                            }
                            style={{
                                borderColor: theme.border,
                                backgroundColor: theme.bgSecondary,
                                color: theme.text,
                            }}
                            className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2"
                            placeholder="10001"
                        />
                    </div>
                </div>

                {/* Country */}
                <div>
                    <label
                        style={{ color: theme.textSecondary }}
                        className="block text-sm mb-2"
                    >
                        Country *
                    </label>
                    <textarea
                        value={data.notes}
                        onChange={(e) =>
                            handleChange("notes", e.target.value)
                        }
                        style={{
                            borderColor: theme.border,
                            backgroundColor: theme.bgSecondary,
                            color: theme.text,
                        }}
                        className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2"
                        placeholder="any notes for the delivery ?"
                    />
                </div>
            </div>
        </div>
    );
}