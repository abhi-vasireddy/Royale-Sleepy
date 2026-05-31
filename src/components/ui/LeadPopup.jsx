// src/components/ui/LeadPopup.jsx
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../../config/firebase'

export default function LeadPopup() {
  const [show, setShow] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  // Show popup after 8 seconds, only once per session
  useEffect(() => {
    const dismissed = sessionStorage.getItem('leadPopupDismissed')
    if (dismissed) return
    const timer = setTimeout(() => setShow(true), 8000)
    return () => clearTimeout(timer)
  }, [])

  const handleDismiss = () => {
    setShow(false)
    sessionStorage.setItem('leadPopupDismissed', 'true')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim() || !phone.trim()) return
    setLoading(true)
    try {
      await addDoc(collection(db, 'leads'), {
        name: name.trim(),
        phone: phone.trim(),
        source: 'popup',
        createdAt: serverTimestamp(),
      })
      setSubmitted(true)
      setTimeout(handleDismiss, 3000)
    } catch (err) {
      console.error('Lead save failed:', err)
    }
    setLoading(false)
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-charcoal/50 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={handleDismiss}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ type: 'spring', damping: 20 }}
            className="bg-warm-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Decorative top */}
            <div className="h-2 bg-gradient-to-r from-gold-light via-gold to-gold-dark" />

            <div className="p-8">
              {!submitted ? (
                <>
                  <button onClick={handleDismiss} className="absolute top-4 right-4 text-mink/50 hover:text-mink text-xl">✕</button>
                  <div className="text-center mb-6">
                    <span className="text-4xl block mb-3">🎁</span>
                    <h2 className="font-display text-2xl font-bold text-charcoal mb-2">
                      Exclusive Offer
                    </h2>
                    <p className="text-sm text-mink/80 font-body">
                      Share your details and get a special discount on your first purchase!
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-3">
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Your Name"
                      required
                      className="w-full border border-gold-light rounded-xl px-4 py-3 text-sm font-body text-charcoal placeholder-mink/40 outline-none focus:border-gold bg-beige/40"
                    />
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="Phone Number"
                      required
                      className="w-full border border-gold-light rounded-xl px-4 py-3 text-sm font-body text-charcoal placeholder-mink/40 outline-none focus:border-gold bg-beige/40"
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-gold w-full justify-center py-3"
                    >
                      {loading ? 'Saving...' : 'Claim My Offer ✨'}
                    </button>
                  </form>
                  <p className="text-center text-xs text-mink/40 mt-3 font-body">
                    No spam. We'll call you to help choose the right mattress.
                  </p>
                </>
              ) : (
                <div className="text-center py-6">
                  <span className="text-5xl block mb-4">🌙</span>
                  <h3 className="font-display text-xl font-bold text-charcoal mb-2">Thank You!</h3>
                  <p className="text-sm text-mink font-body">
                    Our team will contact you shortly with an exclusive offer. Sweet dreams ahead! ✨
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
