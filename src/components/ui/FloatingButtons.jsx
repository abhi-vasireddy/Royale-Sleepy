// src/components/ui/FloatingButtons.jsx
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SITE_CONFIG, WHATSAPP_MESSAGES } from '../../utils/constants'

// ---- AI Chatbot ----
function AIChatbot({ onClose }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi! I'm Sleepy, your personal sleep consultant 🌙 Tell me about your sleep needs and I'll help you find the perfect mattress!" }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY

  const sendMessage = async () => {
    if (!input.trim() || loading) return
    const userMsg = input.trim()
    setInput('')
    const newMessages = [...messages, { role: 'user', content: userMsg }]
    setMessages(newMessages)
    setLoading(true)

    try {
      // Build conversation history for Gemini
      const history = newMessages.slice(1).map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }))

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system_instruction: {
              parts: [{
                text: `You are "Sleepy", a friendly luxury mattress consultant for Royale Sleepy store in Berhampur, Odisha, India.
                Help customers choose the right mattress. Ask about: sleep position, back pain, budget, bed size.
                Our products: Memory Foam (₹18K-35K), Orthopedic (₹15K-28K), Natural Latex (₹30K-50K), Hybrid (₹25K-45K), Spring (₹10K-20K).
                Always end with encouraging them to visit the showroom or contact on WhatsApp: +91-98765-43210.
                Keep responses short (2-3 sentences), warm, and helpful.`
              }]
            },
            contents: history
          })
        }
      )
      const data = await res.json()
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "I'd love to help! Please visit our showroom or WhatsApp us at +91-98765-43210 for personalized guidance. 🌙"
      setMessages([...newMessages, { role: 'assistant', content: reply }])
    } catch (err) {
      setMessages([...newMessages, {
        role: 'assistant',
        content: "I'm having trouble connecting. Please WhatsApp us at +91-98765-43210 for instant help! 💬"
      }])
    }
    setLoading(false)
  }

  const waLink = `https://wa.me/${SITE_CONFIG.whatsapp}?text=${encodeURIComponent(WHATSAPP_MESSAGES.general)}`

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: 20 }}
      className="absolute bottom-20 right-0 w-80 sm:w-96 bg-warm-white rounded-2xl shadow-2xl border border-gold-light/40 overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-gold-dark to-gold p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-warm-white/20 rounded-full flex items-center justify-center text-lg">🌙</div>
          <div>
            <p className="font-body font-semibold text-white text-sm">Sleepy AI</p>
            <p className="text-white/70 text-xs">Your sleep consultant</p>
          </div>
        </div>
        <button onClick={onClose} className="text-white/70 hover:text-white text-xl leading-none">✕</button>
      </div>

      {/* Messages */}
      <div className="h-64 overflow-y-auto p-4 space-y-3 bg-beige/30">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
              msg.role === 'user'
                ? 'bg-gold text-white rounded-br-none'
                : 'bg-warm-white border border-gold-light/40 text-charcoal rounded-bl-none'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-warm-white border border-gold-light/40 rounded-2xl rounded-bl-none px-4 py-3">
              <div className="flex gap-1">
                {[0,1,2].map(i => (
                  <div key={i} className="w-2 h-2 bg-gold rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-3 border-t border-gold-light/30 bg-warm-white">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            placeholder="Ask about mattresses..."
            className="flex-1 bg-beige rounded-full px-4 py-2 text-sm text-charcoal placeholder-mink/50 outline-none border border-gold-light/30 focus:border-gold"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            className="w-9 h-9 bg-gold rounded-full flex items-center justify-center text-white hover:bg-gold-dark transition-colors disabled:opacity-40"
          >
            ➤
          </button>
        </div>
        <a href={waLink} target="_blank" rel="noopener noreferrer"
          className="mt-2 w-full btn-whatsapp justify-center text-xs py-2">
          <span>💬</span><span>Continue on WhatsApp</span>
        </a>
      </div>
    </motion.div>
  )
}

// ---- Main Floating Buttons ----
export default function FloatingButtons() {
  const [showChat, setShowChat] = useState(false)
  const whatsappLink = `https://wa.me/${SITE_CONFIG.whatsapp}?text=${encodeURIComponent(WHATSAPP_MESSAGES.general)}`

  return (
    <div className="fixed bottom-6 right-4 sm:right-6 z-40 flex flex-col items-end gap-3">
      {/* AI Chatbot popup */}
      <AnimatePresence>
        {showChat && <AIChatbot onClose={() => setShowChat(false)} />}
      </AnimatePresence>

      {/* WhatsApp button */}
      <motion.a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg shadow-[#25D366]/30 hover:bg-[#128C7E] transition-colors"
        title="Chat on WhatsApp"
      >
        <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </motion.a>

      {/* AI Chatbot button */}
      <motion.button
        onClick={() => setShowChat(!showChat)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-colors ${
          showChat ? 'bg-charcoal' : 'bg-gradient-to-br from-gold to-gold-dark'
        } shadow-gold/20`}
        title="Chat with AI"
      >
        <span className="text-2xl">{showChat ? '✕' : '🌙'}</span>
      </motion.button>
    </div>
  )
}
