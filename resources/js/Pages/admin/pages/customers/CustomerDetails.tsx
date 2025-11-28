import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, ShoppingBag, Star, Calendar, FileText, Bell, StickyNote, AlertTriangle, Package, Heart, CreditCard, Edit2 } from 'lucide-react';
import EmptyListSection from '@/admin/components/partials/EmptyListSection';

interface CustomerData {
  name: string;
  age: number;
  accountType: string;
  memberSince: string;
  email: string;
  phone: string;
  address: string;
  accountManager: string;
  status: 'Active' | 'Inactive';
  primaryInterest: string | null;
  allInterests: string[] | null;
  importantNotes: string[] | null;
  recentOrders: any[] | null;
}

export default function CustomerDetails() {
  const [activeTab, setActiveTab] = useState<string>('overview');
  
  // Sample customer data - change values to null to see empty states
  const customer: CustomerData = {
    name: 'Amanda Williams',
    age: 45,
    accountType: 'Premium Member',
    memberSince: '2022',
    email: 'amanda.williams@email.com',
    phone: '(555) 456-7890',
    address: '321 Elm St, Brookline, MA 02445',
    accountManager: 'Sarah Johnson',
    status: 'Active',
    primaryInterest: 'Electronics',
    allInterests: ['Electronics', 'Home & Garden', 'Books'],
    importantNotes: ['Prefers email communication', 'VIP customer'],
    recentOrders: null // Set to null to see empty state
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Heart },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'preferences', label: 'Preferences', icon: Star },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'reminders', label: 'Reminders', icon: Bell },
    { id: 'notes', label: 'Notes', icon: StickyNote }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Back Button */}
      <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors">
        <span className="text-xl">←</span>
        <span className="font-medium">Back to Customers</span>
      </button>

      {/* Customer Header Card */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex gap-6">
            {/* Avatar */}
            <div className="w-32 h-32 bg-gradient-to-br from-slate-300 to-slate-400 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-16 h-16 text-slate-600" />
            </div>

            {/* Customer Info */}
            <div className="space-y-3">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-3xl font-bold text-gray-900">{customer.name}</h1>
                  <button className="text-gray-400 hover:text-gray-600 transition-colors">
                    <Edit2 className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-gray-600">
                  {customer.age} years • {customer.accountType} • Member since {customer.memberSince}
                </p>
              </div>

              <div className="flex items-center gap-2 text-gray-700">
                <Mail className="w-4 h-4 text-gray-400" />
                <span>{customer.email}</span>
                <button className="text-gray-400 hover:text-gray-600 transition-colors ml-1">
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-2 text-gray-700">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span>{customer.address}</span>
              </div>
            </div>
          </div>

          {/* Status Badge */}
          <span className={`px-4 py-2 rounded-md text-sm font-semibold ${
            customer.status === 'Active' 
              ? 'bg-green-500 text-white' 
              : 'bg-gray-400 text-white'
          }`}>
            {customer.status}
          </span>
        </div>

        {/* Contact Row */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2 text-gray-700">
            <Phone className="w-4 h-4 text-gray-400" />
            <span>{customer.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <User className="w-4 h-4 text-gray-400" />
            <span>Account Manager: {customer.accountManager}</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow-sm mb-6 overflow-x-auto">
        <div className="flex border-b border-gray-200 min-w-max">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors relative ${
                  activeTab === tab.id
                    ? 'text-emerald-600 bg-emerald-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600"></div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area - Two Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Customer Interests */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6">
            <Heart className="w-5 h-5 text-gray-600" />
            <h2 className="text-xl font-bold text-gray-900">Customer Interests</h2>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-2">Primary Interest</h3>
              {customer.primaryInterest ? (
                <span className="inline-block bg-emerald-500 text-white px-4 py-2 rounded-md font-medium">
                  {customer.primaryInterest}
                </span>
              ) : (
                <div className="text-gray-400 italic py-2">Customer has no primary interest set</div>
              )}
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-2">All Interests</h3>
              {customer.allInterests && customer.allInterests.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {customer.allInterests.map((interest, index) => (
                    <span
                      key={index}
                      className="bg-white border border-gray-300 text-gray-700 px-3 py-1.5 rounded-md text-sm font-medium"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="text-gray-400 italic py-2">Customer has no interests recorded</div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Important Notes */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <h2 className="text-xl font-bold text-gray-900">Important Notes</h2>
          </div>

          {customer.importantNotes && customer.importantNotes.length > 0 ? (
            <div className="space-y-3">
              {customer.importantNotes.map((note, index) => (
                <div
                  key={index}
                  className="bg-red-50 border border-red-200 rounded-md p-4 flex items-start gap-3"
                >
                  <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span className="text-red-800 font-medium">{note}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-md p-4 text-center">
              <div className="text-gray-400 italic">Customer has no important notes</div>
            </div>
          )}
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
        <div className="flex items-center gap-2 mb-6">
          <Package className="w-5 h-5 text-gray-600" />
          <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
        </div>

        {customer.recentOrders && customer.recentOrders.length > 0 ? (
          <div className="space-y-3">
            {customer.recentOrders.map((order, index) => (
              <div key={index} className="border border-gray-200 rounded-md p-4">
                Order #{order.id} - {order.date}
              </div>
            ))}
          </div>
        ) : (
            <EmptyListSection Icon={Package} label="Customer has no orders yet"  description="Orders will appear here once the customer makes a purchase" />
        )}
      </div>
    </div>
  );
}