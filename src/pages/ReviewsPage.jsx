// src/pages/ReviewsPage.jsx
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import { db } from '../config/firebase'
import { DEFAULT_REVIEWS, SITE_CONFIG } from '../utils/constants'

function StarRating({ rating }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={`text-base ${i < rating ? 'text-gold' : 'text-gold/20'}`}>★</span>
      ))}
    </div>
  )
}

function ReviewCard({ review, delay = 0 }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      className="luxury-card p-7 flex flex-col h-full"
    >
      <StarRating rating={review.rating} />
      <p className="text-charcoal/75 font-body text-sm leading-relaxed my-4 flex-1 italic">
        "{review.text}"
      </p>
      <div className="flex items-center gap-3 pt-4 border-t border-gold-light/30">
        <div className="w-10 h-10 bg-gradient-to-br from-gold/30 to-gold-light rounded-full flex items-center justify-center text-gold font-display font-bold text-sm">
          {review.avatar || review.name?.[0] || '?'}
        </div>
        <div>
          <p className="font-body font-semibold text-charcoal text-sm">{review.name}</p>
          <p className="font-body text-mink/60 text-xs">{review.location}</p>
        </div>
      </div>
    </motion.div>
  )
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const waLink = `https://wa.me/${SITE_CONFIG.whatsapp}?text=${encodeURIComponent("Hi! I'd like to share my experience with Royale Sleepy.")}`

  useEffect(() => {
    const fetch = async () => {
      try {
        const q = query(collection(db, 'reviews'), orderBy('createdAt', 'desc'))
        const snap = await getDocs(q)
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() }))
        setReviews(data.length > 0 ? data : DEFAULT_REVIEWS)
      } catch {
        setReviews(DEFAULT_REVIEWS)
      }
      setLoading(false)
    }
    fetch()
  }, [])

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '5.0'

  return (
    <div className="min-h-screen pt-24">
      {/* Header */}
      <div className="bg-charcoal py-20 px-4 text-center">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-gold text-xs tracking-[0.4em] uppercase font-body mb-3">
          Customer Love
        </motion.p>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-display text-5xl font-bold text-warm-white mb-4">
          Real Stories, Real Sleep
        </motion.h1>
        <div className="gold-divider mb-6" />

        {/* Rating stats */}
        <div className="flex items-center justify-center gap-3 mb-2">
          <span className="font-display text-5xl font-bold text-gold">{avgRating}</span>
          <div>
            <div className="flex gap-1 mb-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className="text-gold text-xl">★</span>
              ))}
            </div>
            <p className="text-warm-white/50 font-body text-sm">{reviews.length}+ verified reviews</p>
          </div>
        </div>
      </div>

      {/* Reviews grid */}
      <section className="py-20 px-4 bg-luxury">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="luxury-card h-56 animate-pulse bg-beige rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.map((review, i) => (
                <ReviewCard key={review.id} review={review} delay={i * 0.07} />
              ))}
            </div>
          )}

          {/* Share review CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-16 text-center"
          >
            <div className="luxury-card p-10 max-w-xl mx-auto">
              <span className="text-4xl block mb-4">💬</span>
              <h3 className="font-display text-2xl font-bold text-charcoal mb-2">Share Your Experience</h3>
              <p className="text-mink font-body text-sm mb-5">
                How's your Royale Sleepy mattress treating you? We'd love to hear your story.
              </p>
              <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn-whatsapp">
                <span>💬</span><span>Share on WhatsApp</span>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
