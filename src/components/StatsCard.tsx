import React from 'react'
import { DivideIcon as LucideIcon } from 'lucide-react'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: number
  icon: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
  format?: 'number' | 'currency' | 'percentage'
  variant?: 'default' | 'success' | 'warning' | 'error'
}

export default function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  format = 'number',
  variant = 'default'
}: StatsCardProps) {
  const formatValue = (val: number) => {
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-US', { 
          style: 'currency', 
          currency: 'USD' 
        }).format(val)
      case 'percentage':
        return `${val}%`
      case 'number':
        return new Intl.NumberFormat('en-US').format(val)
      default:
        return val.toString()
    }
  }

  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return 'border-success-200 bg-success-50'
      case 'warning':
        return 'border-warning-200 bg-warning-50'
      case 'error':
        return 'border-error-200 bg-error-50'
      default:
        return 'border-gray-200 bg-white'
    }
  }

  const getIconStyles = () => {
    switch (variant) {
      case 'success':
        return 'text-success-600'
      case 'warning':
        return 'text-warning-600'
      case 'error':
        return 'text-error-600'
      default:
        return 'text-primary-600'
    }
  }

  return (
    <div className={`card ${getVariantStyles()}`}>
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <Icon className={`h-8 w-8 ${getIconStyles()}`} />
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-gray-500 truncate">
              {title}
            </dt>
            <dd className="flex items-baseline">
              <div className="text-2xl font-semibold text-gray-900">
                {formatValue(value)}
              </div>
              {trend && (
                <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                  trend.isPositive ? 'text-success-600' : 'text-error-600'
                }`}>
                  {trend.isPositive ? (
                    <TrendingUp className="h-4 w-4 flex-shrink-0 self-center" />
                  ) : (
                    <TrendingDown className="h-4 w-4 flex-shrink-0 self-center" />
                  )}
                  <span className="ml-1">{trend.value}%</span>
                </div>
              )}
            </dd>
          </dl>
        </div>
      </div>
    </div>
  )
}