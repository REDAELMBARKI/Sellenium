import React from "react";
import { Info, Package, Globe, Calendar, Shield } from "lucide-react";

interface SpecItem {
    icon: React.ReactNode;
    label: string;
    value: string | string[];
}

interface SpecsProps {
    materials?: Array<{ id: string; name: string }>;
    madeCountry?: { code: string; name: string };
    fits?: Array<{ id: string; name: string }>;
    season?: string[];
    gender?: string[];
    styles?: string[];
    sku?: string;
    weight?: string;
    dimensions?: string;
}

export const Specs = ({
    materials,
    madeCountry,
    fits,
    season,
    gender,
    styles,
    sku,
}: SpecsProps) => {
    const careInstructions = [
        "Machine wash cold with like colors",
        "Do not bleach",
        "Tumble dry low",
        "Iron on low heat if needed",
        "Do not dry clean",
    ];

    return (
        <div className="space-y-8">
            {/* Specifications Grid */}
           
            <ShortSpecs
                {...{
                    materials,
                    madeCountry,
                    fits,
                    season,
                    gender,
                    styles,
                    sku,
                }}
            />
            {/* Care Instructions */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-lg">
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                    Care Instructions
                </h3>
                <ul className="space-y-3">
                    {careInstructions.map((instruction, index) => (
                        <li
                            key={index}
                            className="flex items-start gap-3 text-slate-700"
                        >
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">
                                {index + 1}
                            </div>
                            <span className="leading-relaxed">
                                {instruction}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Warranty & Returns */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-2xl border border-slate-700 shadow-xl text-white">
                <h3 className="text-xl font-bold mb-6">Warranty & Returns</h3>
                <div className="space-y-4">
                    <div className="flex items-start gap-3">
                        <Shield className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-1" />
                        <div>
                            <h4 className="font-semibold mb-1">
                                1-Year Warranty
                            </h4>
                            <p className="text-slate-300 text-sm">
                                All products come with a comprehensive 1-year
                                warranty covering manufacturing defects.
                            </p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <Package className="w-5 h-5 text-blue-400 flex-shrink-0 mt-1" />
                        <div>
                            <h4 className="font-semibold mb-1">
                                30-Day Returns
                            </h4>
                            <p className="text-slate-300 text-sm">
                                Not satisfied? Return within 30 days for a full
                                refund, no questions asked.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Specs;

const ShortSpecs = ({
    materials,
    madeCountry,
    fits,
    season,
    gender,
    styles,
    sku,
}: SpecsProps) => {
    return (
        <div className="py-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Technical Specifications
            </h3>

            <div className="grid gap-4">
                <div className="flex py-3 border-b border-gray-200">
                    <span className="font-semibold text-gray-900 w-40">
                        SKU
                    </span>
                    <span className="text-gray-700">{sku}</span>
                </div>

                {materials && materials.length > 0 && (
                    <div className="flex py-3 border-b border-gray-200">
                        <span className="font-semibold text-gray-900 w-40">
                            Materials
                        </span>
                        <span className="text-gray-700">
                            {materials.map((m) => m.name).join(", ")}
                        </span>
                    </div>
                )}

                {fits && fits.length > 0 && (
                    <div className="flex py-3 border-b border-gray-200">
                        <span className="font-semibold text-gray-900 w-40">
                            Fit
                        </span>
                        <span className="text-gray-700">
                            {fits.map((f) => f.name).join(", ")}
                        </span>
                    </div>
                )}

                {season && season.length > 0 && (
                    <div className="flex py-3 border-b border-gray-200">
                        <span className="font-semibold text-gray-900 w-40">
                            Season
                        </span>
                        <span className="text-gray-700 capitalize">
                            {season.join(", ")}
                        </span>
                    </div>
                )}

                {styles && styles.length > 0 && (
                    <div className="flex py-3 border-b border-gray-200">
                        <span className="font-semibold text-gray-900 w-40">
                            Style
                        </span>
                        <span className="text-gray-700 capitalize">
                            {styles.join(", ")}
                        </span>
                    </div>
                )}

                {gender && gender.length > 0 && (
                    <div className="flex py-3 border-b border-gray-200">
                        <span className="font-semibold text-gray-900 w-40">
                            Gender
                        </span>
                        <span className="text-gray-700 capitalize">
                            {gender.join(", ")}
                        </span>
                    </div>
                )}

                {madeCountry && (
                    <div className="flex py-3 border-b border-gray-200">
                        <span className="font-semibold text-gray-900 w-40">
                            Made In
                        </span>
                        <span className="text-gray-700">
                            {madeCountry.name}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};
