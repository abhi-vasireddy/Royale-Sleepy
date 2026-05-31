import React from 'react'
import { motion } from 'framer-motion'

export default function About() {
  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <section className="relative py-32 bg-charcoal text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1400&q=50)',
          backgroundSize: 'cover', backgroundPosition: 'center'
        }} />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <p className="text-gold text-sm tracking-[0.4em] uppercase font-medium mb-4">Our Story</p>
            <h1 className="font-serif text-5xl sm:text-6xl text-white mb-6">Where Luxury Meets Sleep</h1>
            <p className="text-white/70 text-lg leading-relaxed">
              Born in Berhampur. Trusted across Odisha. A legacy of premium sleep solutions.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <img
              src="https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=700&q=80"
              alt="Royale Sleepy showroom"
              className="rounded-3xl w-full aspect-[4/3] object-cover card-shadow"
            />
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <p className="text-gold text-sm tracking-[0.4em] uppercase font-medium mb-4">Since 2012</p>
            <h2 className="font-serif text-4xl text-charcoal mb-6">A Legacy of Comfort</h2>
            <div className="space-y-4 text-warm-gray leading-relaxed">
              <p>Royale Sleepy was founded with a simple but powerful belief: everyone deserves to sleep like royalty. Starting as a modest store in Berhampur, we have grown into Odisha's most trusted name in premium mattresses.</p>
              <p>Over a decade of experience, thousands of happy customers, and an unwavering commitment to quality — these are the pillars on which Royale Sleepy stands. Every mattress we sell is personally curated and quality-checked by our team.</p>
              <p>We partner with India's finest mattress manufacturers to bring you a collection that balances luxury, longevity, and real orthopedic benefit.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-beige/30">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl text-charcoal">Our Promises to You</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { title: 'Premium Quality', icon: '🏅', text: 'Every product passes our 12-point quality check before reaching your home.' },
              { title: 'Honest Pricing', icon: '💰', text: 'No hidden costs. What you see is what you pay — fair prices always.' },
              { title: 'After-Sale Support', icon: '🤝', text: 'Our relationship doesn\'t end at the sale. We are here whenever you need us.' },
            ].map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                className="text-center p-8 bg-white rounded-2xl card-shadow"
              >
                <div className="text-4xl mb-4">{v.icon}</div>
                <h3 className="font-serif text-xl text-charcoal mb-3">{v.title}</h3>
                <p className="text-warm-gray text-sm leading-relaxed">{v.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-charcoal text-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[['10+', 'Years of Excellence'], ['5000+', 'Happy Families'], ['50+', 'Premium Products'], ['5★', 'Customer Rating']].map(([num, label]) => (
              <motion.div key={label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <p className="font-serif text-4xl text-gold mb-2">{num}</p>
                <p className="text-white/60 text-sm">{label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
