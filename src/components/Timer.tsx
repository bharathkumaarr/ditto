import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, RotateCcw, Timer as TimerIcon, StopCircle } from 'lucide-react'
import './Timer.css'

interface TimerProps {
    type?: 'timer' | 'stopwatch'
    durationInSeconds?: number
    label?: string
}

export function Timer({
    type = 'timer',
    durationInSeconds = 60,
    label = 'Timer'
}: TimerProps) {
    const [seconds, setSeconds] = useState(type === 'timer' ? durationInSeconds : 0)
    const [isActive, setIsActive] = useState(false)
    const [isFinished, setIsFinished] = useState(false)

    // Sync state with props if they change
    useEffect(() => {
        setSeconds(type === 'timer' ? durationInSeconds : 0)
        setIsActive(false)
        setIsFinished(false)
    }, [type, durationInSeconds])

    const formatTime = (totalSeconds: number) => {
        const hrs = Math.floor(totalSeconds / 3600)
        const mins = Math.floor((totalSeconds % 3600) / 60)
        const secs = totalSeconds % 60
        return {
            hrs: hrs.toString().padStart(2, '0'),
            mins: mins.toString().padStart(2, '0'),
            secs: secs.toString().padStart(2, '0')
        }
    }

    const { hrs, mins, secs } = formatTime(seconds)

    useEffect(() => {
        let interval: any = null
        if (isActive) {
            interval = setInterval(() => {
                setSeconds((prevSeconds) => {
                    if (type === 'timer') {
                        if (prevSeconds <= 1) {
                            setIsActive(false)
                            setIsFinished(true)
                            return 0
                        }
                        return prevSeconds - 1
                    } else {
                        return prevSeconds + 1
                    }
                })
            }, 1000)
        } else {
            clearInterval(interval)
        }
        return () => clearInterval(interval)
    }, [isActive, type])

    const toggle = () => setIsActive(!isActive)

    const reset = useCallback(() => {
        setIsActive(false)
        setIsFinished(false)
        setSeconds(type === 'timer' ? durationInSeconds : 0)
    }, [type, durationInSeconds])

    const progress = type === 'timer'
        ? (seconds / durationInSeconds) * 100
        : (seconds % 60 / 60) * 100

    return (
        <motion.div
            className={`timer-card ${isFinished ? 'finished' : ''}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
            <div className="timer-header">
                <div className="timer-type">
                    {type === 'timer' ? <TimerIcon size={18} /> : <StopCircle size={18} />}
                    <span>{type === 'timer' ? 'Timer' : 'Stopwatch'}</span>
                </div>
                <h3 className="timer-label">{label}</h3>
            </div>

            <div className="timer-display">
                <div className="time-unit">
                    <AnimatePresence mode="popLayout">
                        <motion.span
                            key={hrs}
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -10, opacity: 0 }}
                        >
                            {hrs}
                        </motion.span>
                    </AnimatePresence>
                    <span className="unit-label">H</span>
                </div>
                <span className="separator">:</span>
                <div className="time-unit">
                    <AnimatePresence mode="popLayout">
                        <motion.span
                            key={mins}
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -10, opacity: 0 }}
                        >
                            {mins}
                        </motion.span>
                    </AnimatePresence>
                    <span className="unit-label">M</span>
                </div>
                <span className="separator">:</span>
                <div className="time-unit">
                    <AnimatePresence mode="popLayout">
                        <motion.span
                            key={secs}
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -10, opacity: 0 }}
                        >
                            {secs}
                        </motion.span>
                    </AnimatePresence>
                    <span className="unit-label">S</span>
                </div>
            </div>

            <div className="timer-progress-container">
                <motion.div
                    className="timer-progress-bar"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, ease: "linear" }}
                />
            </div>

            <div className="timer-controls">
                <button
                    className={`control-btn ${isActive ? 'active' : ''}`}
                    onClick={toggle}
                    disabled={isFinished}
                >
                    {isActive ? <Pause size={24} /> : <Play size={24} />}
                </button>
                <button className="control-btn reset" onClick={reset}>
                    <RotateCcw size={20} />
                </button>
            </div>
        </motion.div>
    )
}
