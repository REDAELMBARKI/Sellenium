import { isEmpty } from "lodash";
import { useEffect } from "react";

interface StepIndicatorProps {
    currentStep: number;
    errors?: any;
}

export default function StepIndicator({ currentStep, errors }: StepIndicatorProps) {
    
    const { submit, ...withoutSubmit } = errors || {};
    const filteredErrors = currentStep === 1 ? withoutSubmit : errors;
    const hasError = !isEmpty(filteredErrors);



    const steps = [
        { number: 1, label: "Shipping" },
        { number: 2, label: "Payment" },
    ];

    const getCircleClass = (stepNumber: number) => {
        const base = "w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all";

        if(hasError && currentStep > stepNumber ) return `${base} bg-red-500 text-white`;
      else if(stepNumber >= currentStep)    return `${base} bg-gray-200 text-gray-500`;
        else return `${base} bg-green-600 text-white`;
    };

    const getLabelClass = (stepNumber: number) => {
        const base = "mt-2 text-sm font-medium";
        if(hasError && currentStep > stepNumber )  return `${base} text-red-500`;
        else if(stepNumber >= currentStep)            return `${base} text-gray-600`;
        else  return  `${base} text-green-500`;
    };

    return (
        <div className="flex items-center justify-center gap-4 mb-8">
            {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                    <div className="flex flex-col items-center">
                        <div className={getCircleClass(step.number)}>
                            {(step.number < currentStep && (!hasError && (step.number == 1)))  ? (
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
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
                        <span className={getLabelClass(step.number)}>
                            {step.label}
                        </span>
                    </div>

                    {index < steps.length - 1 && (
                        <div
                            className={`w-16 h-0.5 mb-6 mx-2 bg-gray-500`}
                        />
                    )}
                </div>
            ))}
        </div>
    );
}