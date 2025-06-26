import React from 'react'
import { DivideIcon as LucideIcon } from 'lucide-react'

interface SettingsSectionProps {
  title: string
  description: string
  icon: LucideIcon
  children: React.ReactNode
}

export default function SettingsSection({ title, description, icon: Icon, children }: SettingsSectionProps) {
  return (
    <div className="card">
      <div className="flex items-center mb-4">
        <Icon className="h-6 w-6 text-primary-600 mr-3" />
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
      {children}
    </div>
  )
}