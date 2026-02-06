import { motion } from 'framer-motion'
import { StickyNote } from 'lucide-react'
import './NotesPanel.css'

interface Note {
    id: string
    content: string
    color?: 'yellow' | 'blue' | 'green' | 'pink'
}

interface NotesPanelProps {
    title: string
    notes: Note[]
}

const noteColors = {
    yellow: { bg: 'rgba(250, 204, 21, 0.15)', border: 'rgba(250, 204, 21, 0.3)' },
    blue: { bg: 'rgba(59, 130, 246, 0.15)', border: 'rgba(59, 130, 246, 0.3)' },
    green: { bg: 'rgba(34, 197, 94, 0.15)', border: 'rgba(34, 197, 94, 0.3)' },
    pink: { bg: 'rgba(236, 72, 153, 0.15)', border: 'rgba(236, 72, 153, 0.3)' }
}

export function NotesPanel({ title, notes }: NotesPanelProps) {
    return (
        <motion.div
            className="notes-panel"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="notes-header">
                <StickyNote size={24} />
                <h2 className="notes-title">{title}</h2>
            </div>

            <div className="notes-grid">
                {notes.map((note, index) => {
                    const colors = noteColors[note.color || 'yellow']
                    return (
                        <motion.div
                            key={note.id}
                            className="note-card"
                            style={{
                                backgroundColor: colors.bg,
                                borderColor: colors.border
                            }}
                            initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.02, rotate: 1 }}
                        >
                            <p className="note-content">{note.content}</p>
                        </motion.div>
                    )
                })}
            </div>
        </motion.div>
    )
}