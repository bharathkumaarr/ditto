import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { motion } from 'framer-motion'
import './Dashboard.css'

interface Metric {
    label: string
    value: number
    change?: number
}

interface ChartData {
    name: string
    value: number
}

interface DashboardProps {
    title: string
    metrics: Metric[]
    chartData?: ChartData[]
}

export function Dashboard({ title, metrics, chartData }: DashboardProps) {
    return (
        <motion.div
            className="dashboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <h2 className="dashboard-title">{title}</h2>

            <div className="metrics-grid">
                {metrics.map((metric, index) => (
                    <motion.div
                        key={index}
                        className="metric-card"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <span className="metric-label">{metric.label}</span>
                        <span className="metric-value">{metric.value.toLocaleString()}</span>
                        {metric.change !== undefined && (
                            <span className={`metric-change ${metric.change >= 0 ? 'positive' : 'negative'}`}>
                                {metric.change >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                                {Math.abs(metric.change)}%
                            </span>
                        )}
                    </motion.div>
                ))}
            </div>

            {chartData && chartData.length > 0 && (
                <motion.div
                    className="chart-container"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={chartData}>
                            <XAxis dataKey="name" stroke="#888" />
                            <YAxis stroke="#888" />
                            <Tooltip
                                contentStyle={{
                                    background: 'rgba(0,0,0,0.8)',
                                    border: 'none',
                                    borderRadius: '8px'
                                }}
                            />
                            <Bar dataKey="value" fill="url(#gradient)" radius={[4, 4, 0, 0]} />
                            <defs>
                                <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#8b5cf6" />
                                    <stop offset="100%" stopColor="#6366f1" />
                                </linearGradient>
                            </defs>
                        </BarChart>
                    </ResponsiveContainer>
                </motion.div>
            )}
        </motion.div>
    )
}