import { motion, AnimatePresence } from 'framer-motion'
import { StickyNote, Sparkles } from 'lucide-react'
import { useState } from 'react'
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
    const [hoveredNote, setHoveredNote] = useState<string | null>(null)

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
                            whileDrag={{ scale: 1.1, rotate: 5, zIndex: 1000 }}
                            drag
                            dragSnapToOrigin
                            onDragStart={() => {
                                window.dispatchEvent(new CustomEvent('noteDragStart', { detail: { id: note.id } }))
                            }}
                            onDragEnd={(_, info) => {
                                window.dispatchEvent(new CustomEvent('noteDragEnd', {
                                    detail: {
                                        id: note.id,
                                        content: note.content,
                                        point: info.point
                                    }
                                }))
                            }}
                            onMouseEnter={() => setHoveredNote(note.id)}
                            onMouseLeave={() => setHoveredNote(null)}
                        >
                            <p className="note-content">{note.content}</p>

                            <div className="note-sparkle">
                                <Sparkles size={14} />
                            </div>

                            <AnimatePresence>
                                {hoveredNote === note.id && (
                                    <motion.div
                                        className="note-tooltip"
                                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 5, scale: 0.9 }}
                                    >
                                        <div className="tooltip-badge">Tambo AI</div>
                                        <p>Drag to the bottom zone to transform this note into a structured workflow.</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    )
                })}
            </div>
        </motion.div>
    )
}