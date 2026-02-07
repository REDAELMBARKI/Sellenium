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
                <div>
                    <label
                        style={{ color: theme.textSecondary }}
                        className="block text-sm mb-2"
                    >
                        <User size={16} className="inline mr-2" />
                        Full Name *
                    </label>
                    <input
                        type="text"
                        required
                        value={data.guest_name}
                        onChange={(e) => handleChange("guest_name", e.target.value)}
                        style={{
                            borderColor: theme.border,
                            backgroundColor: theme.bgSecondary,
                            color: theme.text,
                        }}
                        className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2"
                        placeholder="John Doe"
                    />
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
                            required
                            value={data.guest_email}
                            onChange={(e) =>
                                handleChange("guest_email", e.target.value)
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
                            required
                            value={data.guest_phone}
                            onChange={(e) =>
                                handleChange("guest_phone", e.target.value)
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

                {/* Address */}
                <div>
                    <label
                        style={{ color: theme.textSecondary }}
                        className="block text-sm mb-2"
                    >
                        <MapPin size={16} className="inline mr-2" />
                        Street Address *
                    </label>
                    <input
                        type="text"
                        required
                        value={data.address.street}
                        onChange={(e) =>
                            handleAddressChange("street", e.target.value)
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
                            required
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
                            required
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
                            required
                            value={data.address.zip_code}
                            onChange={(e) =>
                                handleAddressChange("zip_code", e.target.value)
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
                    <input
                        type="text"
                        required
                        value={data.address.country}
                        onChange={(e) =>
                            handleAddressChange("country", e.target.value)
                        }
                        style={{
                            borderColor: theme.border,
                            backgroundColor: theme.bgSecondary,
                            color: theme.text,
                        }}
                        className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2"
                        placeholder="United States"
                    />
                </div>
            </div>
        </div>
    );
}