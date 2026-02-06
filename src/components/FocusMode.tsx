import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import './FocusMode.css'

interface FocusModeProps {
    title: string
    breathingPattern?: {
        inhale: number
        hold: number
        exhale: number
    }
    color?: 'blue' | 'purple' | 'green'
}

const colorThemes = {
    blue: { primary: '#3b82f6', secondary: '#0ea5e9' },
    purple: { primary: '#8b5cf6', secondary: '#a855f7' },
    green: { primary: '#10b981', secondary: '#14b8a6' }
}

export function FocusMode({ title, breathingPattern, color = 'purple' }: FocusModeProps) {
    const pattern = breathingPattern || { inhale: 4, hold: 4, exhale: 4 }
    const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale')
    const [countdown, setCountdown] = useState(pattern.inhale)
    const theme = colorThemes[color]

    useEffect(() => {
        const interval = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    setPhase(currentPhase => {
                        if (currentPhase === 'inhale') {
                            return 'hold'
                        } else if (currentPhase === 'hold') {
                            return 'exhale'
                        } else {
                            return 'inhale'
                        }
                    })
                    if (phase === 'inhale') return pattern.hold
                    if (phase === 'hold') return pattern.exhale
                    return pattern.inhale
                }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(interval)
    }, [phase, pattern])

    return (
        <motion.div
            className="focus-mode"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            style={{
                '--primary-color': theme.primary,
                '--secondary-color': theme.secondary
            } as React.CSSProperties}
        >
            <h2 className="focus-title">{title}</h2>

            <div className="breathing-container">
                <motion.div
                    className="breathing-circle"
                    animate={{
                        scale: phase === 'inhale' ? 1.3 : phase === 'hold' ? 1.3 : 1,
                    }}
                    transition={{
                        duration: phase === 'inhale' ? pattern.inhale :
                            phase === 'hold' ? 0.1 : pattern.exhale,
                        ease: 'easeInOut'
                    }}
                >
                    <div className="inner-circle">
                        <span className="phase-text">{phase}</span>
                        <span className="countdown">{countdown}</span>
                    </div>
                </motion.div>
            </div>

            <div className="pattern-info">
                <span>Inhale {pattern.inhale}s</span>
                <span>•</span>
                <span>Hold {pattern.hold}s</span>
                <span>•</span>
                <span>Exhale {pattern.exhale}s</span>
            </div>
        </motion.div>
    )
}