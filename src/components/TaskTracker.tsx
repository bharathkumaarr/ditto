import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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

export function TaskTracker({ title, tasks: initialTasks }: TaskTrackerProps) {
    const [localTasks, setLocalTasks] = useState(initialTasks)
    const boardRef = useRef<HTMLDivElement>(null)
    const columnRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})
    const [activeId, setActiveId] = useState<string | null>(null)
    const [hoveredColumn, setHoveredColumn] = useState<string | null>(null)

    useEffect(() => {
        setLocalTasks(initialTasks)
    }, [initialTasks])

    const checkColumnHit = (point: { x: number, y: number }) => {
        const { x, y } = point
        let hit: string | null = null

        Object.entries(columnRefs.current).forEach(([status, ref]) => {
            if (ref) {
                const rect = ref.getBoundingClientRect()
                // Use a strict bounding box check
                if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
                    hit = status
                }
            }
        })
        return hit
    }

    const handleDrag = (_: any, info: any) => {
        const hit = checkColumnHit(info.point)
        if (hit !== hoveredColumn) {
            setHoveredColumn(hit)
        }
    }

    const handleDragEnd = (taskId: string, info: any) => {
        setActiveId(null)
        const newStatus = checkColumnHit(info.point)
        setHoveredColumn(null)

        if (newStatus) {
            setLocalTasks(prev => {
                const task = prev.find(t => t.id === taskId)
                if (task && task.status !== newStatus) {
                    return prev.map(t =>
                        t.id === taskId ? { ...t, status: newStatus as Task['status'] } : t
                    )
                }
                return prev
            })
        }
    }

    const columns = {
        'todo': localTasks.filter(t => t.status === 'todo'),
        'in-progress': localTasks.filter(t => t.status === 'in-progress'),
        'done': localTasks.filter(t => t.status === 'done')
    }

    return (
        <motion.div
            className="task-tracker"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <h2 className="tracker-title">{title}</h2>

            <div className="kanban-board" ref={boardRef}>
                {Object.entries(columns).map(([status, columnTasks]) => (
                    <div
                        key={status}
                        className={`kanban-column ${hoveredColumn === status ? 'hovered' : ''}`}
                        ref={el => { columnRefs.current[status] = el }}
                    >
                        <div className="column-header">
                            {statusIcons[status as keyof typeof statusIcons]}
                            <span>{status.replace('-', ' ')}</span>
                            <span className="task-count">{columnTasks.length}</span>
                        </div>
                        <div className="column-tasks">
                            <AnimatePresence mode="popLayout" initial={false}>
                                {columnTasks.map((task) => (
                                    <motion.div
                                        key={task.id}
                                        layoutId={task.id}
                                        className={`task-card ${activeId === task.id ? 'is-dragging' : ''}`}
                                        drag
                                        dragConstraints={boardRef}
                                        dragElastic={0}
                                        dragMomentum={false}
                                        onDragStart={() => setActiveId(task.id)}
                                        onDrag={handleDrag}
                                        onDragEnd={(_, info) => handleDragEnd(task.id, info)}
                                        whileDrag={{
                                            scale: 1.02,
                                            zIndex: 1000,
                                            boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                                            cursor: 'grabbing'
                                        }}
                                        whileTap={{ scale: 0.98 }}
                                        transition={{
                                            type: "tween",
                                            ease: "easeInOut",
                                            duration: 0.2
                                        }}
                                        dragTransition={{ bounceStiffness: 1000, bounceDamping: 1000 }} // Kill spring on release
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
                            </AnimatePresence>
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    )
}