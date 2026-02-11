// Pages/Checkout/components/StepIndicator.tsx
interface StepIndicatorProps {
    currentStep: number;
}

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
    const steps = [
        { number: 1, label: "Cart" },
        { number: 2, label: "Shipping" },
        { number: 3, label: "Payment" },
    ];

    return (
        <div className="flex items-center justify-center gap-4 mb-8">
            {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                    <div className="flex flex-col items-center">
                        <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                                step.number <= currentStep
                                    ? "bg-green-600 text-white"
                                    : "bg-gray-200 text-gray-500"
                            }`}
                        >
                            {step.number < currentStep ? (
                                <svg
                                    className="w-5 h-5"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            ) : (
                                step.number
                            )}
                        </div>
                        <span
                            className={`mt-2 text-sm font-medium ${
                                step.number === currentStep
                                    ? "text-green-600"
                                    : "text-gray-500"
                            }`}
                        >
                            {step.label}
                        </span>
                    </div>

                    {index < steps.length - 1 && (
                        <div
                            className={`w-16 h-0.5 mb-6 mx-2 ${
                                step.number < currentStep
                                    ? "bg-green-600"
                                    : "bg-gray-200"
                            }`}
                        />
                    )}
                </div>
            ))}
        </div>
    );
}