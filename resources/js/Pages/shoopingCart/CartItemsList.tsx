// Pages/Checkout/components/CartItemsList.tsx
import { Trash2 } from "lucide-react";
import CartItemCard from "./CartItemCard";

interface CartItemsListProps {
    items: any[];
    onQuantityChange: (cartId: number, quantity: number) => void;
    onDelete: (cartId: number) => void;
    theme: any;
}

export default function CartItemsList({
    items,
    onQuantityChange,
    onDelete,
    theme,
}: CartItemsListProps) {
    if (!items || items.length === 0) {
        return (
            <div
                style={{
                    backgroundColor: theme.card,
                    borderColor: theme.border,
                }}
                className="border rounded-lg text-center"
            >
                <p style={{ color: theme.textSecondary }}>Your cart is empty</p>
            </div>
        );
    }

    return (
        <div
            style={{
                backgroundColor: theme.card,
                borderColor: theme.border,
            }}
            className="border rounded-lg p-6"
        >
            <h2 style={{ color: theme.text }} className="text-xl font-bold mb-4">
                Cart Items ({items.length})
            </h2>

            <div className="space-y-4">
                {items.map((item) => (
                    <CartItemCard
                        key={item.id}
                        item={item}
                        onQuantityChange={onQuantityChange}
                        onDelete={onDelete}
                        theme={theme}
                    />
                ))}
            </div>
        </div>
    );
}