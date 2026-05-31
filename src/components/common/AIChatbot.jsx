import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiSend, FiMessageSquare } from 'react-icons/fi'
import { openWhatsApp } from '../../utils/whatsapp'

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY

const SYSTEM_PROMPT = `You are a friendly sleep consultant for Royale Sleepy, a premium mattress store in Berhampur, Odisha, India. 
Your job is to help customers find the right mattress.
Ask about:
1. Sleep issues (back pain, hot sleeper, etc.)
2. Budget range
3. Size needed (Single/Double/Queen/King)
4. Preferred firmness (Soft/Medium/Firm)
5. Any special requirements

Our products: Orthopedic, Memory Foam, Latex, Pocket Spring, Luxury Collection, Kids Mattresses.
Price range: ₹12,999 to ₹64,999.

After gathering requirements, recommend 1-2 specific products and suggest they visit or WhatsApp us.
Keep responses short (2-3 sentences max). Be warm and professional.`

export default function AIChatbot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! 👋 I\'m your personal sleep consultant at Royale Sleepy. What kind of mattress are you looking for? Tell me about your sleep needs!' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef()

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || loading) return
    const userMsg = { role: 'user', content: input }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      if (!GEMINI_API_KEY) throw new Error('No API key')
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              { role: 'user', parts: [{ text: SYSTEM_PROMPT }] },
              { role: 'model', parts: [{ text: 'Understood! I will help customers find their perfect mattress.' }] },
              ...newMessages.map(m => ({
                role: m.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: m.content }]
              }))
            ]
          })
        }
      )
      const data = await response.json()
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'd love to help! Please WhatsApp us for personalized recommendations."
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'I\'d be happy to help you choose the perfect mattress! 🛏️ WhatsApp us and our team will guide you personally.'
      }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Toggle button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 2.5, type: 'spring' }}
        onClick={() => setOpen(!open)}
        className="fixed bottom-24 right-6 z-50 w-14 h-14 gold-gradient text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform"
        aria-label="AI Consultant"
      >
        {open ? <FiX size={22} /> : <FiMessageSquare size={22} />}
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed bottom-44 right-6 z-50 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-beige overflow-hidden"
          >
            {/* Header */}
            <div className="gold-gradient p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-xl">🛏️</div>
                <div>
                  <h4 className="text-white font-semibold text-sm">Sleep Consultant</h4>
                  <p className="text-white/80 text-xs">Royale Sleepy • Online now</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="h-72 overflow-y-auto p-4 space-y-3 bg-cream/30">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                    msg.role === 'user'
                      ? 'bg-charcoal text-white rounded-br-sm'
                      : 'bg-white text-charcoal rounded-bl-sm shadow-sm border border-beige'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-beige rounded-2xl rounded-bl-sm px-4 py-3">
                    <div className="flex gap-1">
                      {[0, 1, 2].map(i => (
                        <div key={i} className="w-2 h-2 bg-gold rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-beige flex gap-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                placeholder="Ask about mattresses..."
                className="flex-1 text-sm border border-beige rounded-xl px-3 py-2 focus:outline-none focus:border-gold"
              />
              <button
                onClick={sendMessage}
                disabled={loading}
                className="w-10 h-10 gold-gradient rounded-xl flex items-center justify-center text-white disabled:opacity-50"
              >
                <FiSend size={16} />
              </button>
            </div>

            <div className="px-3 pb-3">
              <button
                onClick={() => openWhatsApp('Hi! I was chatting with your AI consultant and need more help.')}
                className="w-full text-xs text-green-600 font-medium py-2 bg-green-50 rounded-xl hover:bg-green-100 transition-colors"
              >
                💬 Continue on WhatsApp
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
