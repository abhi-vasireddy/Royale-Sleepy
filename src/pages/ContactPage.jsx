// src/pages/ContactPage.jsx
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../config/firebase'
import { SITE_CONFIG, WHATSAPP_MESSAGES } from '../utils/constants'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', phone: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const waLink = `https://wa.me/${SITE_CONFIG.whatsapp}?text=${encodeURIComponent(WHATSAPP_MESSAGES.general)}`

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await addDoc(collection(db, 'leads'), {
        name: form.name,
        phone: form.phone,
        message: form.message,
        source: 'contact_form',
        createdAt: serverTimestamp(),
      })
      setSubmitted(true)
    } catch (err) {
      console.error('Submission failed:', err)
    }
    setLoading(false)
  }

  const contactItems = [
    { icon: '📍', label: 'Address', value: SITE_CONFIG.address, link: null },
    { icon: '📞', label: 'Phone', value: SITE_CONFIG.phone, link: `tel:${SITE_CONFIG.phone}` },
    { icon: '📧', label: 'Email', value: SITE_CONFIG.email, link: `mailto:${SITE_CONFIG.email}` },
    { icon: '🕐', label: 'Hours', value: SITE_CONFIG.hours, link: null },
  ]

  return (
    <div className="min-h-screen pt-24">
      {/* Header */}
      <div className="bg-charcoal py-20 px-4 text-center">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-gold text-xs tracking-[0.4em] uppercase font-body mb-3">
          Get In Touch
        </motion.p>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-display text-5xl font-bold text-warm-white mb-4">
          Visit Our Showroom
        </motion.h1>
        <div className="gold-divider mb-4" />
        <p className="text-warm-white/60 font-body">Come experience the mattresses in person. We're here to help.</p>
      </div>

      <section className="py-20 px-4 bg-luxury">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10">
            {/* Contact Info */}
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <h2 className="font-display text-2xl font-bold text-charcoal mb-6">Find Us</h2>

              <div className="space-y-5 mb-8">
                {contactItems.map(item => (
                  <div key={item.label} className="flex gap-4">
                    <span className="text-xl flex-shrink-0 mt-0.5">{item.icon}</span>
                    <div>
                      <p className="text-xs font-body font-semibold text-mink/60 uppercase tracking-wider mb-0.5">{item.label}</p>
                      {item.link ? (
                        <a href={item.link} className="text-charcoal font-body hover:text-gold transition-colors">{item.value}</a>
                      ) : (
                        <p className="text-charcoal font-body">{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* WhatsApp CTA */}
              <div className="bg-[#25D366]/10 border border-[#25D366]/30 rounded-2xl p-5">
                <h3 className="font-display text-lg font-semibold text-charcoal mb-2">Quickest Response</h3>
                <p className="text-mink font-body text-sm mb-4">WhatsApp us for instant replies. Our team typically responds within minutes.</p>
                <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn-whatsapp w-full justify-center">
                  <span>💬</span><span>Open WhatsApp Chat</span>
                </a>
              </div>
            </motion.div>

            {/* Inquiry Form */}
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              <div className="luxury-card p-8">
                {!submitted ? (
                  <>
                    <h2 className="font-display text-2xl font-bold text-charcoal mb-2">Send an Inquiry</h2>
                    <p className="text-mink font-body text-sm mb-6">We'll reach out within 24 hours.</p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="text-xs font-body font-semibold text-charcoal/70 uppercase tracking-wider mb-1 block">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={form.name}
                          onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                          placeholder="Your name"
                          className="w-full border border-gold-light rounded-xl px-4 py-3 text-sm font-body text-charcoal placeholder-mink/40 outline-none focus:border-gold bg-beige/40 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-body font-semibold text-charcoal/70 uppercase tracking-wider mb-1 block">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          required
                          value={form.phone}
                          onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                          placeholder="+91 98765 43210"
                          className="w-full border border-gold-light rounded-xl px-4 py-3 text-sm font-body text-charcoal placeholder-mink/40 outline-none focus:border-gold bg-beige/40 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-body font-semibold text-charcoal/70 uppercase tracking-wider mb-1 block">
                          Message
                        </label>
                        <textarea
                          value={form.message}
                          onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                          placeholder="Tell us what you're looking for..."
                          rows={4}
                          className="w-full border border-gold-light rounded-xl px-4 py-3 text-sm font-body text-charcoal placeholder-mink/40 outline-none focus:border-gold bg-beige/40 transition-colors resize-none"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={loading}
                        className="btn-gold w-full justify-center py-3"
                      >
                        {loading ? 'Sending...' : 'Send Inquiry →'}
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="text-center py-10">
                    <span className="text-5xl block mb-4">✅</span>
                    <h3 className="font-display text-2xl font-bold text-charcoal mb-2">Thank You!</h3>
                    <p className="text-mink font-body">We've received your inquiry and will be in touch shortly. Sweet dreams ahead!</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}
