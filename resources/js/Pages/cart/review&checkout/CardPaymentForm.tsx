// Pages/Checkout/components/CardPaymentForm.tsx
import { CreditCard, Lock } from "lucide-react";
import { useStoreConfigCtx } from "@/contextHooks/useStoreConfigCtx";

interface CardPaymentFormProps {
    data: any;
    onChange: (data: any) => void;
}

export default function CardPaymentForm({
    data,
    onChange,
}: CardPaymentFormProps) {
    const handleChange = (field: string, value: string) => {
        onChange({ ...data, [field]: value });
    };
    const {state:{currentTheme : theme}} = useStoreConfigCtx();
    return (
        <div
            style={{
                backgroundColor: theme.card,
                borderColor: theme.border,
            }}
            className="border rounded-lg p-6"
        >
            <div className="flex items-center justify-between mb-4">
                <h2 style={{ color: theme.text }} className="text-xl font-bold">
                    Card Details
                </h2>
                <div
                    className="flex items-center gap-1"
                    style={{ color: theme.success }}
                >
                    <Lock size={16} />
                    <span className="text-sm">Secure</span>
                </div>
            </div>

            <div className="space-y-4">
                {/* Card Number */}
                <div>
                    <label
                        style={{ color: theme.textSecondary }}
                        className="block text-sm mb-2"
                    >
                        <CreditCard size={16} className="inline mr-2" />
                        Card Number *
                    </label>
                    <input
                        type="text"
                        required
                        value={data.card_number}
                        onChange={(e) =>
                            handleChange("card_number", e.target.value)
                        }
                        style={{
                            borderColor: theme.border,
                            backgroundColor: theme.bgSecondary,
                            color: theme.text,
                        }}
                        className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2"
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                    />
                </div>

                {/* Expiry & CVV */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label
                            style={{ color: theme.textSecondary }}
                            className="block text-sm mb-2"
                        >
                            Expiry Date *
                        </label>
                        <input
                            type="text"
                            required
                            value={data.expiry}
                            onChange={(e) => handleChange("expiry", e.target.value)}
                            style={{
                                borderColor: theme.border,
                                backgroundColor: theme.bgSecondary,
                                color: theme.text,
                            }}
                            className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2"
                            placeholder="MM/YY"
                            maxLength={5}
                        />
                    </div>

                    <div>
                        <label
                            style={{ color: theme.textSecondary }}
                            className="block text-sm mb-2"
                        >
                            CVV *
                        </label>
                        <input
                            type="text"
                            required
                            value={data.cvv}
                            onChange={(e) => handleChange("cvv", e.target.value)}
                            style={{
                                borderColor: theme.border,
                                backgroundColor: theme.bgSecondary,
                                color: theme.text,
                            }}
                            className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2"
                            placeholder="123"
                            maxLength={4}
                        />
                    </div>
                </div>

                {/* Cardholder Name */}
                <div>
                    <label
                        style={{ color: theme.textSecondary }}
                        className="block text-sm mb-2"
                    >
                        Cardholder Name *
                    </label>
                    <input
                        type="text"
                        required
                        value={data.cardholder_name}
                        onChange={(e) =>
                            handleChange("cardholder_name", e.target.value)
                        }
                        style={{
                            borderColor: theme.border,
                            backgroundColor: theme.bgSecondary,
                            color: theme.text,
                        }}
                        className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2"
                        placeholder="JOHN DOE"
                    />
                </div>
            </div>
        </div>
    );
}