import { useState, useEffect, useRef } from 'react'
import { useTamboThread, useTamboThreadInput } from '@tambo-ai/react'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
import { Sparkles, Send, Loader2, Sun, Moon, Command, Wand2, Plus } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import './App.css'

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [isDraggingNote, setIsDraggingNote] = useState(false)
  const [isOverDropZone, setIsOverDropZone] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropZoneRef = useRef<HTMLDivElement>(null)
  const scrollEndRef = useRef<HTMLDivElement>(null)
  const { thread } = useTamboThread()
  const { value, setValue, submit, isPending } = useTamboThreadInput()

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Focus input: Cmd/Ctrl + K or /
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
      } else if (e.key === '/' && document.activeElement !== inputRef.current) {
        e.preventDefault()
        inputRef.current?.focus()
      }

      // Toggle theme: Alt + T
      if (e.altKey && e.key === 't') {
        e.preventDefault()
        setTheme(prev => prev === 'light' ? 'dark' : 'light')
      }

      // Blur input: Esc
      if (e.key === 'Escape') {
        inputRef.current?.blur()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Drag and Drop Transformation Logic
  useEffect(() => {
    const handleDragStart = () => setIsDraggingNote(true)
    const handleDragEnd = (e: any) => {
      const { content, point } = e.detail

      // Check if dropped within the bottom 25% of the screen (where the zone is fixed)
      const thresholdY = window.innerHeight * 0.75
      const droppedInside = point.y > thresholdY

      setIsDraggingNote(false)
      setIsOverDropZone(false)

      if (droppedInside) {
        const prompt = `Convert this note into a structured kanban workflow: "${content}"`
        setValue(prompt)
        // Ensure the input value state has propagated before submitting
        setTimeout(() => {
          submit()
        }, 150)
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingNote && dropZoneRef.current) {
        const rect = dropZoneRef.current.getBoundingClientRect()
        const isInside = (
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom
        )
        setIsOverDropZone(isInside)
      }
    }

    window.addEventListener('noteDragStart', handleDragStart)
    window.addEventListener('noteDragEnd', handleDragEnd)
    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('noteDragStart', handleDragStart)
      window.removeEventListener('noteDragEnd', handleDragEnd)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [isDraggingNote, setValue, submit])

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (value.trim() && !isPending) {
      submit()
    }
  }

  const handleNewChat = () => {
    window.location.reload()
  }

  const handleGoHome = () => {
    window.location.reload()
  }

  // Auto-scroll logic
  useEffect(() => {
    if (thread?.messages?.length || isPending) {
      scrollEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [thread?.messages?.length, isPending])

  return (
    <div className={`app ${isDraggingNote ? 'dragging-note' : ''}`}>
      {/* Background gradient */}
      <div className="bg-gradient" />

      {/* Top Controls */}
      <div className="top-controls">
        <button
          className="new-chat-btn"
          onClick={handleNewChat}
          aria-label="New Chat"
        >
          <Plus size={20} />
          <span>New Chat</span>
        </button>

        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      </div>

      {/* Header */}
      <header className="header">
        <motion.div
          className="logo clickable"
          onClick={handleGoHome}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Sparkles className="logo-icon" />
          <span>ditto</span>
        </motion.div>
        <p className="tagline">The UI that builds itself</p>
      </header>

      {/* Main content area */}
      <main className="main-content">
        {/* Show intent input prominently when no messages */}
        {(!thread?.messages || thread.messages.length === 0) && (
          <motion.div
            className="hero-section"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="hero-title">What do you want to do?</h1>
            <p className="hero-subtitle">Type your intent and watch the UI transform</p>
          </motion.div>
        )}

        {/* Rendered components area */}
        <AnimatePresence mode="popLayout">
          {thread?.messages && thread.messages.length > 0 && (
            <motion.div
              className="components-area"
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.1
                  }
                }
              }}
            >
              <LayoutGroup>
                {thread.messages.map((message) => (
                  <motion.div
                    key={message.id}
                    layout
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                      mass: 0.8
                    }}
                    className="message-container"
                  >
                    {/* User message */}
                    {message.role === 'user' && (
                      <div className="user-message">
                        <span className="message-label">You</span>
                        <p>
                          {Array.isArray(message.content)
                            ? message.content.map((part) =>
                              typeof part === 'string' ? part : part.type === 'text' ? part.text : ''
                            ).join('')
                            : typeof message.content === 'string'
                              ? message.content
                              : ''}
                        </p>
                      </div>
                    )}

                    {/* AI text response */}
                    {message.role === 'assistant' && (
                      <div className="assistant-message">
                        {Array.isArray(message.content) ? (
                          message.content.map((part, i) =>
                            part.type === 'text' ? (
                              <div key={i} className="ai-text">
                                <ReactMarkdown>{part.text}</ReactMarkdown>
                              </div>
                            ) : null
                          )
                        ) : (
                          <div className="ai-text">
                            <ReactMarkdown>{String(message.content)}</ReactMarkdown>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Rendered component from AI */}
                    {message.renderedComponent && (
                      <motion.div
                        className="rendered-component"
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 260,
                          damping: 20,
                          delay: 0.2
                        }}
                      >
                        {message.renderedComponent}
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </LayoutGroup>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading indicator */}
        {isPending && (
          <motion.div
            className="loading-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="loading-spinner">
              <Loader2 className="spin" size={40} />
            </div>
            <p className="loading-text">Generating your UI...</p>
          </motion.div>
        )}

        {/* Scroll anchor */}
        <div ref={scrollEndRef} style={{ height: 1, width: '100%' }} />
      </main>

      {/* Transformation Drop Zone */}
      <AnimatePresence>
        {isDraggingNote && (
          <motion.div
            ref={dropZoneRef}
            className={`transformation-zone ${isOverDropZone ? 'active' : ''}`}
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
          >
            <div className="zone-content">
              <Wand2 className={`zone-icon ${isOverDropZone ? 'sparkle' : ''}`} size={32} />
              <div className="zone-text">
                <h3>{isOverDropZone ? 'Release to Transform' : 'Drop Note Here'}</h3>
                <p>Convert to structured workflow</p>
              </div>
            </div>
            {isOverDropZone && (
              <motion.div
                className="zone-glow"
                layoutId="zone-glow"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Intent input - always visible */}
      <motion.form
        className={`intent-form ${thread?.messages?.length ? 'has-messages' : ''}`}
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="input-container">
          <div className="shortcut-hint-prefix">/</div>
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Describe what you want to do..."
            className="intent-input"
            disabled={isPending}
          />
          <div className="command-hint">
            <Command size={14} />
            <span>K</span>
          </div>
          <button
            type="submit"
            className="submit-btn"
            disabled={isPending || !value.trim()}
          >
            {isPending ? (
              <Loader2 className="spin" size={20} />
            ) : (
              <Send size={20} />
            )}
          </button>
        </div>

        {/* Quick suggestions */}
        {(!thread?.messages || thread.messages.length === 0) && (
          <div className="suggestions">
            <span className="suggestion-label">Try:</span>
            {[
              "Generate a study notes plan for me",
              "Plan my tasks for this week",
              "Brainstorm startup ideas",
              "Start a focus session for 25 minutes",
              "Set a 2 minute timer for boiling eggs"
            ].map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                className="suggestion-chip"
                onClick={() => setValue(suggestion)}
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </motion.form>
    </div>
  )
}

export default App