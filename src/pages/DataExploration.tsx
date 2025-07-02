import React, { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Calendar, Filter, Download } from 'lucide-react'

const sampleData = [
  { name: 'Jan', energy: 4000, temperature: 20 },
  { name: 'Feb', energy: 3000, temperature: 18 },
  { name: 'Mar', energy: 2000, temperature: 22 },
  { name: 'Apr', energy: 2780, temperature: 25 },
  { name: 'May', energy: 1890, temperature: 28 },
  { name: 'Jun', energy: 2390, temperature: 32 },
]

export default function DataExploration() {
  const [dateRange, setDateRange] = useState({ start: '', end: '' })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Data Exploration</h1>
          <p className="text-gray-600 mt-2">Analyze and visualize your energy consumption data</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </button>
          <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center space-x-4 mb-6">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Date Range:</span>
          </div>
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-gray-500">to</span>
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sampleData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="energy" fill="#3B82F6" name="Energy Consumption" />
              <Bar dataKey="temperature" fill="#EF4444" name="Temperature" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Records:</span>
              <span className="font-medium">12,543</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Date Range:</span>
              <span className="font-medium">Jan - Jun 2024</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Avg. Consumption:</span>
              <span className="font-medium">2,510 kWh</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Quality</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Completeness:</span>
              <span className="font-medium text-green-600">98.5%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Accuracy:</span>
              <span className="font-medium text-green-600">96.2%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Outliers:</span>
              <span className="font-medium text-yellow-600">1.3%</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Insights</h3>
          <div className="space-y-3">
            <div className="text-sm text-gray-600">
              Peak consumption occurs during summer months
            </div>
            <div className="text-sm text-gray-600">
              Strong correlation between temperature and energy use
            </div>
            <div className="text-sm text-gray-600">
              Data quality has improved by 5% this quarter
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}