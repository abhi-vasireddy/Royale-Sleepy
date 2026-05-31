import React from 'react'
import { motion } from 'framer-motion'
import { FaStar, FaQuoteLeft } from 'react-icons/fa'
import { useReviews } from '../../hooks/useReviews'

export default function TestimonialsSlider() {
  const { reviews } = useReviews()
  const [active, setActive] = React.useState(0)

  React.useEffect(() => {
    const t = setInterval(() => setActive(a => (a + 1) % reviews.length), 5000)
    return () => clearInterval(t)
  }, [reviews.length])

  if (!reviews.length) return null

  return (
    <section className="py-24 bg-charcoal text-white overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <p className="text-gold text-sm tracking-[0.4em] uppercase font-medium mb-4">Testimonials</p>
          <h2 className="font-serif text-4xl sm:text-5xl text-white">What Our Customers Say</h2>
          <div className="w-16 h-0.5 bg-gold mx-auto mt-6" />
        </motion.div>

        <div className="relative min-h-[200px] flex items-center justify-center">
          {reviews.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: i === active ? 1 : 0, scale: i === active ? 1 : 0.95 }}
              transition={{ duration: 0.5 }}
              className={`absolute inset-0 flex flex-col items-center ${i !== active ? 'pointer-events-none' : ''}`}
            >
              <FaQuoteLeft className="text-gold/30 text-5xl mb-6" />
              <p className="text-white/90 text-lg sm:text-xl leading-relaxed mb-8 max-w-2xl">
                "{r.text}"
              </p>
              <div className="flex gap-1 mb-4">
                {Array.from({ length: r.rating || 5 }).map((_, j) => (
                  <FaStar key={j} className="text-gold" size={16} />
                ))}
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 gold-gradient rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {r.avatar || r.name?.slice(0, 2).toUpperCase()}
                </div>
                <div className="text-left">
                  <p className="font-semibold text-white text-sm">{r.name}</p>
                  <p className="text-white/50 text-xs">{r.city}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {reviews.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${i === active ? 'bg-gold w-6' : 'bg-white/30'}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
