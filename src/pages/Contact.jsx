import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { FaWhatsapp, FaPhoneAlt, FaMapMarkerAlt, FaEnvelope } from 'react-icons/fa'
import { db } from '../firebase/config'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import toast from 'react-hot-toast'
import { STORE_INFO } from '../utils/constants'
import { openWhatsApp } from '../utils/whatsapp'

export default function Contact() {
  const [form, setForm] = useState({ name: '', phone: '', message: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.phone) return toast.error('Please fill required fields')
    setLoading(true)
    try {
      await addDoc(collection(db, 'leads'), {
        ...form,
        source: 'contact_form',
        createdAt: serverTimestamp()
      })
      toast.success('Message sent! We will reach out to you soon.')
      setForm({ name: '', phone: '', message: '' })
    } catch {
      toast.error('Something went wrong. Please try WhatsApp instead.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen pt-20">
      <section className="bg-beige/40 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-gold text-sm tracking-[0.4em] uppercase font-medium mb-4">Get In Touch</p>
            <h1 className="font-serif text-5xl text-charcoal">Contact Us</h1>
            <p className="text-warm-gray text-lg mt-4">We'd love to hear from you. Visit us or reach out anytime.</p>
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Info */}
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h2 className="font-serif text-3xl text-charcoal mb-8">Visit Our Showroom</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 gold-gradient rounded-xl flex items-center justify-center text-white shrink-0">
                  <FaMapMarkerAlt size={18} />
                </div>
                <div>
                  <p className="font-semibold text-charcoal mb-1">Address</p>
                  <p className="text-warm-gray text-sm">{STORE_INFO.address}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 gold-gradient rounded-xl flex items-center justify-center text-white shrink-0">
                  <FaPhoneAlt size={18} />
                </div>
                <div>
                  <p className="font-semibold text-charcoal mb-1">Phone</p>
                  <a href={`tel:${STORE_INFO.phone}`} className="text-warm-gray text-sm hover:text-gold transition-colors">{STORE_INFO.phone}</a>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 gold-gradient rounded-xl flex items-center justify-center text-white shrink-0">
                  <FaEnvelope size={18} />
                </div>
                <div>
                  <p className="font-semibold text-charcoal mb-1">Email</p>
                  <a href={`mailto:${STORE_INFO.email}`} className="text-warm-gray text-sm hover:text-gold transition-colors">{STORE_INFO.email}</a>
                </div>
              </div>
            </div>

            <div className="mt-8 p-6 bg-beige/40 rounded-2xl">
              <p className="font-semibold text-charcoal mb-3">Store Hours</p>
              <div className="space-y-1 text-sm text-warm-gray">
                <p className="flex justify-between"><span>Monday – Saturday</span><span>10:00 AM – 8:00 PM</span></p>
                <p className="flex justify-between"><span>Sunday</span><span>11:00 AM – 6:00 PM</span></p>
              </div>
            </div>

            <button
              onClick={() => openWhatsApp()}
              className="mt-8 flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-full font-semibold text-sm transition-all hover:scale-105"
            >
              <FaWhatsapp size={22} />
              Message Us on WhatsApp
            </button>
          </motion.div>

          {/* Form */}
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div className="bg-white p-8 rounded-3xl card-shadow">
              <h2 className="font-serif text-3xl text-charcoal mb-6">Send an Inquiry</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-charcoal tracking-wider uppercase mb-2">Name *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="Your full name"
                    className="w-full border border-beige rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-charcoal tracking-wider uppercase mb-2">Phone *</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                    placeholder="Your phone number"
                    maxLength={10}
                    className="w-full border border-beige rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-charcoal tracking-wider uppercase mb-2">Message</label>
                  <textarea
                    rows={4}
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell us what you're looking for..."
                    className="w-full border border-beige rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full gold-gradient text-white py-4 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-60"
                >
                  {loading ? 'Sending...' : 'Send Inquiry →'}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
