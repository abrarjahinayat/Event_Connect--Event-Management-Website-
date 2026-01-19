'use client';

import { Settings } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account settings</p>
      </div>

      <div className="bg-white rounded-xl shadow-md p-12 text-center">
        <Settings className="mx-auto text-gray-400 mb-4" size={64} />
        <h3 className="text-xl font-bold text-gray-900 mb-2">Settings Coming Soon</h3>
        <p className="text-gray-600">
          Update your profile and preferences
        </p>
      </div>
    </div>
  );
}