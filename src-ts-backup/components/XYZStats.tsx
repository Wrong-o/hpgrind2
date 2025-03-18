import React, { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

interface SubcategoryStats {
  subcategory: string
  correct_percentage: number
  average_time: number
  total_questions: number
}

export const XYZStats: React.FC = () => {
  const [stats, setStats] = useState<SubcategoryStats[]>([])
  const { token } = useAuth()

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/xyz/stats`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        })
        const data = await response.json()
        setStats(data)
      } catch (error) {
        console.error('Failed to fetch XYZ stats:', error)
      }
    }

    fetchStats()
  }, [token])

  return (
    <div className="grid gap-4">
      {stats.map((stat, index) => (
        <div 
          key={index}
          className="bg-white/50 backdrop-blur-sm p-6 rounded-xl shadow-lg
                     hover:bg-white/60 transition-all cursor-pointer"
        >
          <h3 className="text-xl font-bold text-blue-600 mb-2">
            {stat.subcategory}
          </h3>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <div className="text-gray-600">Korrekt</div>
              <div className="text-2xl font-bold text-green-600">
                {stat.correct_percentage}%
              </div>
            </div>
            <div>
              <div className="text-gray-600">Snitt tid</div>
              <div className="text-2xl font-bold text-blue-600">
                {Math.round(stat.average_time)}s
              </div>
            </div>
            <div>
              <div className="text-gray-600">Antal frågor</div>
              <div className="text-2xl font-bold text-purple-600">
                {stat.total_questions}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
} 