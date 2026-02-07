import { motion } from 'framer-motion'
import { ShieldCheck, Zap } from 'lucide-react'
import './ReadinessScore.css'

interface Criterion {
    label: string
    value: number
    reasoning?: string
}

interface ReadinessScoreProps {
    score?: number
    title?: string
    summary?: string
    criteria?: Criterion[]
}

export function ReadinessScore({
    score = 50,
    title = 'Readiness Assessment',
    summary = 'Analysis of your current state.',
    criteria = []
}: ReadinessScoreProps) {
    const getScoreColor = (value: number) => {
        if (value >= 80) return 'var(--accent-primary)'
        if (value >= 50) return '#fbbf24' // Yellow
        return '#f87171' // Red
    }

    const strokeDasharray = 2 * Math.PI * 45 // 45 is the radius
    const strokeDashoffset = strokeDasharray - (strokeDasharray * score) / 100

    return (
        <motion.div
            className="readiness-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <div className="readiness-header">
                <div className="score-gauge-container">
                    <svg className="score-gauge" viewBox="0 0 100 100">
                        <circle
                            className="gauge-bg"
                            cx="50" cy="50" r="45"
                        />
                        <motion.circle
                            className="gauge-progress"
                            cx="50" cy="50" r="45"
                            initial={{ strokeDashoffset: strokeDasharray }}
                            animate={{ strokeDashoffset: strokeDashoffset }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            style={{
                                strokeDasharray: strokeDasharray,
                                stroke: getScoreColor(score)
                            }}
                        />
                    </svg>
                    <div className="score-value">
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            {score}
                        </motion.span>
                        <span className="score-label">%</span>
                    </div>
                </div>
                <div className="header-text">
                    <h3 className="readiness-title">{title}</h3>
                    <p className="readiness-summary">{summary}</p>
                </div>
            </div>

            <div className="criteria-list">
                {criteria.map((item, idx) => (
                    <motion.div
                        key={idx}
                        className="criterion-item"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1 + (idx * 0.1) }}
                    >
                        <div className="criterion-info">
                            <span className="criterion-label">{item.label}</span>
                            <span className="criterion-value" style={{ color: getScoreColor(item.value) }}>
                                {item.value}%
                            </span>
                        </div>
                        <div className="criterion-progress-bg">
                            <motion.div
                                className="criterion-progress-fill"
                                initial={{ width: 0 }}
                                animate={{ width: `${item.value}%` }}
                                transition={{ duration: 1, delay: 1.2 + (idx * 0.1) }}
                                style={{ backgroundColor: getScoreColor(item.value) }}
                            />
                        </div>
                        {item.reasoning && <p className="criterion-reasoning">{item.reasoning}</p>}
                    </motion.div>
                ))}
            </div>

            <div className="readiness-footer">
                <div className="footer-badge">
                    <ShieldCheck size={16} />
                    <span>AI Analysis Verified</span>
                </div>
                <div className="footer-badge accent">
                    <Zap size={16} />
                    <span>Next Steps Generated</span>
                </div>
            </div>
        </motion.div>
    )
}
