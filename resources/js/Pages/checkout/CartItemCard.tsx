// Pages/Checkout/components/CartItemCard.tsx
import { Minus, Plus, Trash2 } from "lucide-react";

interface CartItemCardProps {
    item: any;
    onQuantityChange: (cartId: number, quantity: number) => void;
    onDelete: (cartId: number) => void;
    theme: any;
}

export default function CartItemCard({
    item,
    onQuantityChange,
    onDelete,
    theme,
}: CartItemCardProps) {
    const variant = item.product_variant || {};
    const product = variant.product || {};
    const itemTotal = item.subtotal ?? 0
    const savings = variant.old_price
        ? (variant.old_price - variant.price) * item.quantity
        : 0;

    return (
        <div
            style={{
                backgroundColor: theme.bgSecondary,
                borderColor: theme.border,
            }}
            className="border rounded-lg p-4 flex gap-4"
        >
            {/* Product Image */}
            <div
                style={{ borderColor: theme.border }}
                className="border rounded w-24 h-24 flex-shrink-0 overflow-hidden"
            >
                {product.thumbnail.url ? (
                    <img
                        src={`${product.thumbnail.url}`}
                        alt={product.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div
                        style={{ backgroundColor: theme.border }}
                        className="w-full h-full flex items-center justify-center"
                    >
                        <span style={{ color: theme.textSecondary }}>
                            No Image
                        </span>
                    </div>
                )}
            </div>

            {/* Product Info */}
            <div className="flex-1">
                <h3 style={{ color: theme.text }} className="font-semibold mb-1">
                    {product.name}
                </h3>
                <p
                    style={{ color: theme.textSecondary }}
                    className="text-sm mb-2"
                >
                    {variant.name}
                </p>

                {product.description && (
                    <p
                        style={{ color: theme.textSecondary }}
                        className="text-xs mb-2 line-clamp-2"
                    >
                        {product.description}
                    </p>
                )}

                <div className="flex items-center gap-2 mb-2">
                    <span style={{ color: theme.text }} className="font-bold">
                        ${variant.price}
                    </span>
                    {variant.old_price && (
                        <>
                            <span
                                style={{ color: theme.textSecondary }}
                                className="text-sm line-through"
                            >
                                ${variant.old_price}
                            </span>
                            <span
                                style={{ color: theme.success }}
                                className="text-xs font-medium"
                            >
                                Save ${savings}
                            </span>
                        </>
                    )}
                </div>

                <div className="text-xs" style={{ color: theme.textSecondary }}>
                    SKU: {variant.sku} • Stock: {variant.stock}
                </div>
            </div>

            {/* Quantity Controls & Price */}
            <div className="flex flex-col items-end justify-between">
                <button
                    type="button"
                    onClick={() => onDelete(item.id)}
                    style={{ color: theme.error }}
                    className="p-2 hover:opacity-70 transition"
                >
                    <Trash2 size={18} />
                </button>

                <div className="text-right">
                    <div
                        style={{ color: theme.text }}
                        className="font-bold text-lg mb-2"
                    >
                        ${itemTotal}
                    </div>

                    <div
                        style={{
                            borderColor: theme.border,
                            backgroundColor: theme.bgPrimary,
                        }}
                        className="flex items-center border rounded"
                    >
                        <button
                            type="button"
                            onClick={() =>
                                onQuantityChange(item.id, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1}
                            style={{ color: theme.text }}
                            className="p-2 hover:opacity-70 disabled:opacity-30"
                        >
                            <Minus size={16} />
                        </button>
                        <span
                            style={{ color: theme.text }}
                            className="px-4 font-medium"
                        >
                            {item.quantity}
                        </span>
                        <button
                            type="button"
                            onClick={() =>
                                onQuantityChange(item.id, item.quantity + 1)
                            }
                            disabled={item.quantity >= variant.stock}
                            style={{ color: theme.text }}
                            className="p-2 hover:opacity-70 disabled:opacity-30"
                        >
                            <Plus size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}