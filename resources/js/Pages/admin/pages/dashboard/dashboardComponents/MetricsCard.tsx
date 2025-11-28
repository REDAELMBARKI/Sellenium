import React from 'react';

interface MetricsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}

export function MetricsCard({ title, value, icon }: MetricsCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className="text-blue-600">{icon}</div>
      </div>
    </div>
  );
}
