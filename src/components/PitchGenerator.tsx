import { motion } from 'framer-motion'
import { Megaphone, Target, Users, Layout, Repeat, DollarSign, HelpCircle } from 'lucide-react'
import './PitchGenerator.css'

interface PitchGeneratorProps {
    title?: string
    hook?: string
    problem?: string
    solution?: string
    marketSize?: string
    businessModel?: string
    ask?: string
}

export function PitchGenerator({
    title = 'Pitch Deck',
    hook = '',
    problem = '',
    solution = '',
    marketSize = '',
    businessModel = '',
    ask = ''
}: PitchGeneratorProps) {
    const sections = [
        { icon: <Megaphone className="pitch-icon" />, label: 'The Hook', content: hook },
        { icon: <HelpCircle className="pitch-icon" />, label: 'The Problem', content: problem },
        { icon: <Target className="pitch-icon" />, label: 'The Solution', content: solution },
        { icon: <Users className="pitch-icon" />, label: 'Market Size', content: marketSize },
        { icon: <Layout className="pitch-icon" />, label: 'Business Model', content: businessModel },
        { icon: <DollarSign className="pitch-icon" />, label: 'The Ask', content: ask }
    ].filter(s => s.content)

    return (
        <motion.div
            className="pitch-card"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
        >
            <header className="pitch-header">
                <div className="pitch-badge">BETA / Pitch Deck</div>
                <h2 className="pitch-title">{title}</h2>
            </header>

            <div className="pitch-content">
                {sections.map((section, idx) => (
                    <motion.div
                        key={idx}
                        className="pitch-section"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                    >
                        <div className="section-title">
                            {section.icon}
                            <span>{section.label}</span>
                        </div>
                        <p className="section-text">{section.content}</p>
                    </motion.div>
                ))}
            </div>

            <footer className="pitch-footer">
                <button className="pitch-btn primary">
                    <span>Export to PDF</span>
                </button>
                <button className="pitch-btn secondary">
                    <Repeat size={16} />
                    <span>Generate V2</span>
                </button>
            </footer>
        </motion.div>
    )
}
