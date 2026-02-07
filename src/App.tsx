import { useState, useEffect } from 'react'
import { useTamboThread, useTamboThreadInput } from '@tambo-ai/react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Send, Loader2, Sun, Moon } from 'lucide-react'
import './App.css'

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const { thread } = useTamboThread()
  const { value, setValue, submit, isPending } = useTamboThreadInput()

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (value.trim() && !isPending) {
      submit()
    }
  }

  return (
    <div className="app">
      {/* Background gradient */}
      <div className="bg-gradient" />

      {/* Theme Toggle Button - Top Right */}
      <button
        className="theme-toggle"
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
      </button>

      {/* Header */}
      <header className="header">
        <motion.div
          className="logo"
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
        <AnimatePresence mode="wait">
          {thread?.messages && thread.messages.length > 0 && (
            <motion.div
              className="components-area"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {thread.messages.map((message) => (
                <div key={message.id} className="message-container">
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
                            <p key={i} className="ai-text">{part.text}</p>
                          ) : null
                        )
                      ) : (
                        <p className="ai-text">{String(message.content)}</p>
                      )}
                    </div>
                  )}

                  {/* Rendered component from AI */}
                  {message.renderedComponent && (
                    <motion.div
                      className="rendered-component"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      {message.renderedComponent}
                    </motion.div>
                  )}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Intent input - always visible */}
      <motion.form
        className={`intent-form ${thread?.messages?.length ? 'has-messages' : ''}`}
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="input-container">
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Describe what you want to do..."
            className="intent-input"
            disabled={isPending}
          />
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
              "Track my job applications",
              "Help me focus",
              "Show my productivity stats"
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