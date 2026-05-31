import React from 'react'
import { motion } from 'framer-motion'

const FEATURES = [
  { icon: '🏆', title: 'Premium Comfort', desc: 'Handpicked materials from global suppliers for a sleep experience like no other.' },
  { icon: '🦴', title: 'Orthopedic Support', desc: 'Scientifically engineered to support your spine and relieve pressure points.' },
  { icon: '✅', title: 'Trusted Quality', desc: '10+ years of delivering sleep excellence to families across Odisha.' },
  { icon: '💎', title: 'Luxury Materials', desc: 'From natural latex to cashmere layers — only the finest for our customers.' },
  { icon: '🚚', title: 'Free Delivery', desc: 'Complimentary doorstep delivery within Berhampur and nearby areas.' },
  { icon: '🔄', title: '5-Year Warranty', desc: 'Industry-leading warranty with hassle-free replacement support.' },
]

export default function WhyChooseUs() {
  return (
    <section className="py-24 bg-beige/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <p className="text-gold text-sm tracking-[0.4em] uppercase font-medium mb-4">Why Royale Sleepy</p>
          <h2 className="font-serif text-4xl sm:text-5xl text-charcoal">Crafted for Royalty</h2>
          <div className="w-16 h-0.5 bg-gold mx-auto mt-6" />
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="bg-white p-8 rounded-2xl card-shadow hover:luxury-shadow transition-all duration-300"
            >
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="font-serif text-xl text-charcoal mb-3">{f.title}</h3>
              <p className="text-warm-gray text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
