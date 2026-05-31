import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { FaStar, FaChevronLeft, FaChevronRight, FaQuoteLeft } from 'react-icons/fa'
import { DEMO_REVIEWS } from '../../utils/constants'
import { getReviews } from '../../utils/firebase_helpers'

export default function TestimonialsSection() {
  const [reviews, setReviews] = useState(DEMO_REVIEWS)
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    getReviews().then(r => { if (r.length) setReviews(r) }).catch(() => {})
  }, [])

  useEffect(() => {
    const t = setInterval(() => { setDirection(1); setCurrent(c => (c + 1) % reviews.length) }, 5000)
    return () => clearInterval(t)
  }, [reviews.length])

  const go = (dir) => {
    setDirection(dir)
    setCurrent(c => (c + dir + reviews.length) % reviews.length)
  }

  const variants = {
    enter: (d) => ({ x: d > 0 ? 100 : -100, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d) => ({ x: d > 0 ? -100 : 100, opacity: 0 }),
  }

  return (
    <section ref={ref} className="py-24 px-6 bg-beige overflow-hidden">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-14"
        >
          <span className="font-poppins text-gold text-xs tracking-[0.3em] uppercase font-medium">Testimonials</span>
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-charcoal mt-3">
            What Our Customers Say
          </h2>
        </motion.div>

        <div className="relative">
          {/* Review Card */}
          <div className="relative h-64 md:h-48 flex items-center">
            <AnimatePresence custom={direction} mode="wait">
              <motion.div
                key={current}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4 }}
                className="absolute inset-0 bg-white rounded-3xl p-8 md:p-10 shadow-lg flex flex-col justify-center"
              >
                <FaQuoteLeft className="text-gold/30 mb-4" size={32} />
                <p className="font-poppins text-charcoal text-base md:text-lg leading-relaxed mb-6 italic">
                  "{reviews[current].text}"
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-playfair text-charcoal font-semibold">{reviews[current].name}</p>
                    <p className="font-poppins text-muted text-sm">{reviews[current].location}</p>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className={i < reviews[current].rating ? 'text-gold' : 'text-beige'} size={14} />
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button onClick={() => go(-1)} className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow hover:bg-gold hover:text-white transition-all duration-300">
              <FaChevronLeft size={14} />
            </button>
            <div className="flex gap-2">
              {reviews.map((_, i) => (
                <button key={i} onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i) }}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${i === current ? 'bg-gold w-6' : 'bg-gold/30'}`} />
              ))}
            </div>
            <button onClick={() => go(1)} className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow hover:bg-gold hover:text-white transition-all duration-300">
              <FaChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
