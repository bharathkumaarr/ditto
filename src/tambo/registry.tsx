import { z } from 'zod'

// Import components
import { Dashboard } from '../components/Dashboard'
import { TaskTracker } from '../components/TaskTracker'
import { FocusMode } from '../components/FocusMode'
import { NotesPanel } from '../components/NotesPanel'
import { Timer } from '../components/Timer'
import { ReadinessScore } from '../components/ReadinessScore'
import { PitchGenerator } from '../components/PitchGenerator'
import { TaskPrioritizer } from '../components/TaskPrioritizer'

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

// Timer Schema
const TimerSchema = z.object({
    type: z.enum(['timer', 'stopwatch']).default('timer'),
    durationInSeconds: z.number().describe('Duration in seconds. Calculate this correctly (e.g., 2 minutes = 120, 5 minutes = 300).').default(60),
    label: z.string().describe('Short label for what the timer is for (e.g., "Boiling Eggs").').default('Timer')
})

// ReadinessScore Schema
const ReadinessScoreSchema = z.object({
    score: z.number().min(0).max(100).default(50),
    title: z.string().default('Readiness Assessment'),
    summary: z.string().default('Analysis of your current state.'),
    criteria: z.array(z.object({
        label: z.string(),
        value: z.number().min(0).max(100),
        reasoning: z.string().optional()
    })).default([])
})

// PitchGenerator Schema
const PitchGeneratorSchema = z.object({
    title: z.string().default('Pitch Deck'),
    hook: z.string().default(''),
    problem: z.string().default(''),
    solution: z.string().default(''),
    marketSize: z.string().optional(),
    businessModel: z.string().optional(),
    ask: z.string().optional()
})

// TaskPrioritizer Schema
const TaskPrioritizerSchema = z.object({
    title: z.string().default('Prioritized Tasks'),
    tasks: z.array(z.object({
        id: z.string().default(() => Math.random().toString(36).substr(2, 9)),
        title: z.string(),
        priority: z.enum(['high', 'medium', 'low']).default('medium'),
        impactScore: z.number().min(1).max(10).default(5),
        reasoning: z.string().optional()
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
    },
    {
        name: 'Timer',
        description: 'Countdown timer or stopwatch. Use when the user wants to set a timer, start a countdown, use a stopwatch, or track time for an activity.',
        component: Timer,
        propsSchema: TimerSchema
    },
    {
        name: 'ReadinessScore',
        description: 'Visual readiness score/assessment. Use when users ask how ready a project, idea, or startup is for launch or investment.',
        component: ReadinessScore,
        propsSchema: ReadinessScoreSchema
    },
    {
        name: 'PitchGenerator',
        description: 'Structured business pitch generator. Use when users want an elevator pitch, pitch deck content, or a summary of their business idea.',
        component: PitchGenerator,
        propsSchema: PitchGeneratorSchema
    },
    {
        name: 'TaskPrioritizer',
        description: 'Advanced task prioritization board. Use when users have multiple tasks and need to know what to do first based on impact and priority.',
        component: TaskPrioritizer,
        propsSchema: TaskPrioritizerSchema
    }
]