import { motion } from 'framer-motion'
import { CheckCircle2, Circle, Clock } from 'lucide-react'
import './TaskTracker.css'

interface Task {
    id: string
    title: string
    status: 'todo' | 'in-progress' | 'done'
    priority?: 'low' | 'medium' | 'high'
}

interface TaskTrackerProps {
    title: string
    tasks: Task[]
}

const statusIcons = {
    'todo': <Circle size={18} />,
    'in-progress': <Clock size={18} />,
    'done': <CheckCircle2 size={18} />
}

const priorityColors = {
    'low': '#10b981',
    'medium': '#f59e0b',
    'high': '#ef4444'
}

export function TaskTracker({ title, tasks }: TaskTrackerProps) {
    const columns = {
        'todo': tasks.filter(t => t.status === 'todo'),
        'in-progress': tasks.filter(t => t.status === 'in-progress'),
        'done': tasks.filter(t => t.status === 'done')
    }

    return (
        <motion.div
            className="task-tracker"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <h2 className="tracker-title">{title}</h2>

            <div className="kanban-board">
                {Object.entries(columns).map(([status, columnTasks]) => (
                    <div key={status} className="kanban-column">
                        <div className="column-header">
                            {statusIcons[status as keyof typeof statusIcons]}
                            <span>{status.replace('-', ' ')}</span>
                            <span className="task-count">{columnTasks.length}</span>
                        </div>
                        <div className="column-tasks">
                            {columnTasks.map((task, index) => (
                                <motion.div
                                    key={task.id}
                                    className="task-card"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <span className="task-title">{task.title}</span>
                                    {task.priority && (
                                        <span
                                            className="task-priority"
                                            style={{ backgroundColor: priorityColors[task.priority] }}
                                        >
                                            {task.priority}
                                        </span>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    )
}