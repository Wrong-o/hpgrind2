import React, { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

interface CategoryStat {
    category_id: number
    category_name: string
    total_attempts: number
    correct_attempts: number
    accuracy: number
}

interface CategoryStatsProps {
    onBack: () => void
}

export const CategoryStats: React.FC<CategoryStatsProps> = ({ onBack }) => {
    const [stats, setStats] = useState<CategoryStat[]>([])
    const { token } = useAuth()

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/category-stats`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                    },
                    credentials: 'include',
                })
                if (response.ok) {
                    const data = await response.json()
                    setStats(data)
                }
            } catch (error) {
                console.error('Failed to fetch category stats:', error)
            }
        }

        if (token) {
            fetchStats()
        }
    }, [token])

    return (
        <div className="w-full max-w-4xl px-4 py-8 relative">
            <button
                onClick={onBack}
                className="absolute top-4 left-4 px-4 py-2 bg-blue-600 text-white 
                         rounded-lg hover:bg-blue-700 transition-colors"
            >
                Tillbaka
            </button>

            <div className="space-y-4 mt-16">
                <h2 className="text-xl font-bold text-blue-600 mb-4 text-center">
                    Dina framsteg per kategori
                </h2>
                <div className="grid gap-4 md:grid-cols-2">
                    {stats.map((stat) => (
                        <div 
                            key={stat.category_id}
                            className="bg-white/50 backdrop-blur-sm rounded-xl p-4 shadow-lg"
                        >
                            <h3 className="font-bold text-lg mb-2">{stat.category_name}</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span>Antal försök:</span>
                                    <span className="font-medium">{stat.total_attempts}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Rätta svar:</span>
                                    <span className="font-medium">{stat.correct_attempts}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Träffsäkerhet:</span>
                                    <span className="font-medium">{stat.accuracy}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div 
                                        className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                                        style={{ width: `${stat.accuracy}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
} 