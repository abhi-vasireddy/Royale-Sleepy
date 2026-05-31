import React from 'react'
import { motion } from 'framer-motion'
import { FaStar, FaQuoteLeft } from 'react-icons/fa'
import { useReviews } from '../hooks/useReviews'

export default function Reviews() {
  const { reviews, loading } = useReviews()

  return (
    <div className="min-h-screen pt-20">
      <section className="bg-beige/40 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-gold text-sm tracking-[0.4em] uppercase font-medium mb-4">Testimonials</p>
            <h1 className="font-serif text-5xl text-charcoal">Our Happy Customers</h1>
            <p className="text-warm-gray text-lg mt-4">5,000+ families trust Royale Sleepy for their sleep needs.</p>
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => <div key={i} className="bg-beige rounded-2xl h-48 animate-pulse" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.map((r, i) => (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="bg-white p-6 rounded-2xl card-shadow hover:luxury-shadow transition-all duration-300"
                >
                  <FaQuoteLeft className="text-gold/30 text-3xl mb-4" />
                  <p className="text-warm-gray text-sm leading-relaxed mb-6">"{r.text}"</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 gold-gradient rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {r.avatar || r.name?.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-charcoal text-sm">{r.name}</p>
                        <p className="text-warm-gray text-xs">{r.city}</p>
                      </div>
                    </div>
                    <div className="flex gap-0.5">
                      {Array.from({ length: r.rating || 5 }).map((_, j) => (
                        <FaStar key={j} className="text-gold" size={12} />
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
