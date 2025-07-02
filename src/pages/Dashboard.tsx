import React from 'react'
import { Activity, Database, TrendingUp, Users } from 'lucide-react'
import StatsCard from '../components/StatsCard'

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Overview of your energy data processing system</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Records"
          value={125430}
          icon={Database}
          trend={{ value: 12, isPositive: true }}
          format="number"
        />
        <StatsCard
          title="Processing Rate"
          value={98.5}
          icon={Activity}
          trend={{ value: 2.1, isPositive: true }}
          format="percentage"
          variant="success"
        />
        <StatsCard
          title="Data Quality"
          value={94.2}
          icon={TrendingUp}
          trend={{ value: 1.5, isPositive: false }}
          format="percentage"
          variant="warning"
        />
        <StatsCard
          title="Active Users"
          value={24}
          icon={Users}
          trend={{ value: 8, isPositive: true }}
          format="number"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Data upload completed</span>
              <span className="text-xs text-gray-400">2 minutes ago</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Quality check passed</span>
              <span className="text-xs text-gray-400">15 minutes ago</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">New user registered</span>
              <span className="text-xs text-gray-400">1 hour ago</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Database</span>
              <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                Healthy
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">API Services</span>
              <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                Operational
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Data Pipeline</span>
              <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                Processing
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}