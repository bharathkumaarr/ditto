import { z } from 'zod'

// Import components
import { Dashboard } from '../components/Dashboard'
import { TaskTracker } from '../components/TaskTracker'
import { FocusMode } from '../components/FocusMode'
import { NotesPanel } from '../components/NotesPanel'

// Dashboard Schema - more flexible with defaults
const DashboardSchema = z.object({
    title: z.string().default('Dashboard'),
    metrics: z.array(z.object({
        label: z.string().default('Metric'),
        value: z.number().default(0),
        change: z.number().optional()
    })).default([]),
    chartData: z.array(z.object({
        name: z.string().default('Item'),
        value: z.number().default(0)
    })).optional().default([])
})

// TaskTracker Schema - more flexible with defaults
const TaskTrackerSchema = z.object({
    title: z.string().default('Task Tracker'),
    tasks: z.array(z.object({
        id: z.string().default(() => Math.random().toString(36).substr(2, 9)),
        title: z.string().default('New Task'),
        status: z.enum(['todo', 'in-progress', 'done']).default('todo'),
        priority: z.enum(['low', 'medium', 'high']).optional()
    })).default([])
})

// FocusMode Schema - more flexible with defaults
const FocusModeSchema = z.object({
    title: z.string().default('Take a moment to breathe'),
    breathingPattern: z.object({
        inhale: z.number().default(4),
        hold: z.number().default(4),
        exhale: z.number().default(4)
    }).optional(),
    color: z.enum(['blue', 'purple', 'green']).optional().default('purple')
})

// NotesPanel Schema - more flexible with defaults
const NotesPanelSchema = z.object({
    title: z.string().default('Notes'),
    notes: z.array(z.object({
        id: z.string().default(() => Math.random().toString(36).substr(2, 9)),
        content: z.string().default(''),
        color: z.enum(['yellow', 'blue', 'green', 'pink']).optional().default('yellow')
    })).default([])
})

// Register all components
export const dittoComponents = [
    {
        name: 'Dashboard',
        description: 'Analytics dashboard with metrics and charts. Use when user wants to analyze data, view statistics, track productivity, or visualize any numerical information.',
        component: Dashboard,
        propsSchema: DashboardSchema
    },
    {
        name: 'TaskTracker',
        description: 'Task management board with status tracking. Use when user wants to track tasks, manage to-dos, plan projects, track job applications, or organize work.',
        component: TaskTracker,
        propsSchema: TaskTrackerSchema
    },
    {
        name: 'FocusMode',
        description: 'Calming focus interface with breathing exercises. Use when user is stressed, needs to relax, wants meditation guidance, or needs to focus.',
        component: FocusMode,
        propsSchema: FocusModeSchema
    },
    {
        name: 'NotesPanel',
        description: 'Notes and ideas board. Use when user wants to take notes, brainstorm, jot down ideas, or keep reminders.',
        component: NotesPanel,
        propsSchema: NotesPanelSchema
    }
]