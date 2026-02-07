import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpRight, TrendingUp, CheckCircle2 } from 'lucide-react'
import './TaskPrioritizer.css'

interface PrioritizedTask {
    id: string
    title: string
    priority: 'high' | 'medium' | 'low'
    impactScore: number
    reasoning?: string
}

interface TaskPrioritizerProps {
    title?: string
    tasks?: PrioritizedTask[]
}

export function TaskPrioritizer({
    title = 'Prioritized Tasks',
    tasks = []
}: TaskPrioritizerProps) {
    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'var(--accent-primary)'
            case 'medium': return '#fbbf24'
            case 'low': return '#3b82f6'
            default: return 'var(--text-secondary)'
        }
    }

    const sortedTasks = [...tasks].sort((a, b) => b.impactScore - a.impactScore)

    return (
        <motion.div
            className="prioritizer-card"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
        >
            <div className="prioritizer-header">
                <div className="header-icon-box">
                    <TrendingUp size={20} />
                </div>
                <h2 className="prioritizer-title">{title}</h2>
            </div>

            <div className="task-list-container">
                <AnimatePresence>
                    {sortedTasks.map((task, idx) => (
                        <motion.div
                            key={task.id}
                            className="ranked-task-item"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                        >
                            <div className="rank-indicator">
                                <span>#{idx + 1}</span>
                            </div>

                            <div className="task-info">
                                <div className="task-title-row">
                                    <h4 className="task-title">{task.title}</h4>
                                    <div
                                        className="priority-badge"
                                        style={{
                                            backgroundColor: `${getPriorityColor(task.priority)}20`,
                                            color: getPriorityColor(task.priority),
                                            borderColor: getPriorityColor(task.priority)
                                        }}
                                    >
                                        {task.priority}
                                    </div>
                                </div>

                                {task.reasoning && (
                                    <p className="task-reasoning">{task.reasoning}</p>
                                )}

                                <div className="impact-indicator">
                                    <span className="impact-label">Impact Score</span>
                                    <div className="impact-dots">
                                        {[...Array(10)].map((_, i) => (
                                            <div
                                                key={i}
                                                className={`impact-dot ${i < task.impactScore ? 'active' : ''}`}
                                                style={{
                                                    backgroundColor: i < task.impactScore ? getPriorityColor(task.priority) : 'var(--glass-border)'
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <button className="action-button">
                                <ArrowUpRight size={18} />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            <div className="prioritizer-summary">
                <div className="summary-item">
                    <CheckCircle2 size={16} />
                    <span>Focus on TOP 3 for maximum leverage</span>
                </div>
            </div>
        </motion.div>
    )
}
