import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX } from 'react-icons/fi'
import { db } from '../../firebase/config'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import toast from 'react-hot-toast'

export default function LeadPopup() {
  const [show, setShow] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const seen = sessionStorage.getItem('lead_popup_seen')
    if (!seen) {
      const t = setTimeout(() => setShow(true), 8000)
      return () => clearTimeout(t)
    }
  }, [])

  const handleClose = () => {
    setShow(false)
    sessionStorage.setItem('lead_popup_seen', 'true')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.phone) return toast.error('Please fill all fields')
    if (form.phone.length < 10) return toast.error('Enter a valid phone number')
    setLoading(true)
    try {
      await addDoc(collection(db, 'leads'), {
        name: form.name,
        phone: form.phone,
        source: 'popup',
        createdAt: serverTimestamp(),
      })
      toast.success('Thank you! We will contact you soon.')
      handleClose()
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="bg-white rounded-3xl p-8 max-w-md w-full relative shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <button onClick={handleClose} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-beige transition-colors text-warm-gray">
              <FiX size={18} />
            </button>

            <div className="text-center mb-6">
              <div className="w-16 h-16 gold-gradient rounded-2xl mx-auto mb-4 flex items-center justify-center text-white text-2xl">🛏️</div>
              <h3 className="font-serif text-2xl text-charcoal mb-2">Get a Free Consultation</h3>
              <p className="text-warm-gray text-sm">Share your details and our sleep expert will help you find the perfect mattress.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Your Name"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full border border-beige rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
                maxLength={10}
                className="w-full border border-beige rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full gold-gradient text-white py-3.5 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-60"
              >
                {loading ? 'Submitting...' : 'Get Free Consultation →'}
              </button>
            </form>
            <p className="text-center text-xs text-warm-gray mt-4">We respect your privacy. No spam ever.</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
