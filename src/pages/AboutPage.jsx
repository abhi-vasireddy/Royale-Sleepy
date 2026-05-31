// src/pages/AboutPage.jsx
import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Link } from 'react-router-dom'

function Reveal({ children, delay = 0, className = '' }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

const milestones = [
  { year: '2010', title: 'Founded', desc: 'Royale Sleepy opened its doors in the heart of Berhampur with a simple mission: help everyone sleep better.' },
  { year: '2014', title: 'Expanded', desc: 'Moved to our current showroom — Odisha\'s largest dedicated mattress experience center.' },
  { year: '2018', title: 'Certified', desc: 'Became an ISI-certified retailer and partnered with India\'s top mattress manufacturers.' },
  { year: '2023', title: 'Today', desc: 'Over 10,000 families sleep better because of us. We continue to redefine the sleep experience.' },
]

const values = [
  { emoji: '🎯', title: 'Customer First', desc: 'Every decision we make starts with one question: will this help our customers sleep better?' },
  { emoji: '💎', title: 'Uncompromising Quality', desc: 'We refuse to stock anything we wouldn\'t sleep on ourselves. Every mattress is personally tested.' },
  { emoji: '🤝', title: 'Trusted Guidance', desc: 'No pushy sales. Just honest, expert advice to help you find exactly what your body needs.' },
  { emoji: '🌱', title: 'Sustainable Choices', desc: 'We prioritize eco-friendly materials and sustainable manufacturing wherever possible.' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-24">
      {/* Hero */}
      <div className="relative bg-charcoal py-24 px-4 text-center overflow-hidden">
        <div
          className="absolute inset-0 opacity-20 bg-cover bg-center"
          style={{ backgroundImage: `url(https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&q=70)` }}
        />
        <div className="relative z-10">
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-gold text-xs tracking-[0.4em] uppercase font-body mb-3"
          >
            Our Story
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="font-display text-5xl md:text-6xl font-bold text-warm-white mb-6"
          >
            Crafting Perfect Sleep<br />
            <span className="text-gradient-gold italic">Since 2010</span>
          </motion.h1>
          <div className="gold-divider mb-6" />
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
            className="text-warm-white/70 font-body max-w-2xl mx-auto text-lg"
          >
            A family-run luxury mattress showroom born out of one family's obsession with perfect sleep.
          </motion.p>
        </div>
      </div>

      {/* Brand story */}
      <section className="py-20 px-4 bg-luxury">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-14 items-center">
            <Reveal>
              <div className="rounded-3xl overflow-hidden shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80"
                  alt="Our showroom"
                  className="w-full h-80 object-cover"
                />
              </div>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="text-gold text-xs tracking-[0.4em] uppercase font-body mb-4">Our Philosophy</p>
              <h2 className="section-title mb-5">Sleep is Sacred</h2>
              <p className="section-subtitle mb-4">
                We started Royale Sleepy with a belief that sleep isn't a luxury — it's a necessity. 
                In a city like Berhampur where people work hard and live fully, they deserve the very best rest.
              </p>
              <p className="text-mink/70 font-body leading-relaxed mb-6">
                Our founder spent years researching sleep science before curating our collection. 
                Every mattress we carry has been personally tested, vetted, and approved by our team. 
                We don't stock anything we wouldn't recommend to our own family.
              </p>
              <div className="flex gap-8">
                <div>
                  <p className="font-display text-3xl font-bold text-gold">10K+</p>
                  <p className="text-xs text-mink font-body">Happy Customers</p>
                </div>
                <div>
                  <p className="font-display text-3xl font-bold text-gold">14+</p>
                  <p className="text-xs text-mink font-body">Years of Trust</p>
                </div>
                <div>
                  <p className="font-display text-3xl font-bold text-gold">100%</p>
                  <p className="text-xs text-mink font-body">ISI Certified</p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 px-4 bg-charcoal">
        <div className="max-w-4xl mx-auto">
          <Reveal className="text-center mb-14">
            <p className="text-gold text-xs tracking-[0.4em] uppercase font-body mb-3">Milestones</p>
            <h2 className="font-display text-4xl font-bold text-warm-white">Our Journey</h2>
          </Reveal>
          <div className="relative">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-gold/50 via-gold to-gold/50" />
            {milestones.map((m, i) => (
              <Reveal key={m.year} delay={i * 0.12}>
                <div className={`flex gap-6 mb-10 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  <div className={`hidden md:block flex-1 ${i % 2 === 0 ? 'text-right' : 'text-left'}`}>
                    <div className={`${i % 2 === 0 ? 'ml-auto' : ''} max-w-xs`}>
                      <p className="font-display text-3xl font-bold text-gold mb-1">{m.year}</p>
                      <h3 className="font-display text-lg text-warm-white mb-2">{m.title}</h3>
                      <p className="text-warm-white/55 font-body text-sm leading-relaxed">{m.desc}</p>
                    </div>
                  </div>
                  <div className="relative flex items-start gap-4 md:contents">
                    <div className="w-8 h-8 rounded-full bg-gold border-4 border-charcoal flex-shrink-0 relative z-10" />
                    <div className="md:hidden">
                      <p className="font-display text-xl font-bold text-gold">{m.year} — {m.title}</p>
                      <p className="text-warm-white/55 font-body text-sm mt-1 leading-relaxed">{m.desc}</p>
                    </div>
                  </div>
                  <div className="hidden md:block flex-1" />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-4 bg-luxury">
        <div className="max-w-5xl mx-auto">
          <Reveal className="text-center mb-14">
            <p className="text-gold text-xs tracking-[0.4em] uppercase font-body mb-3">What We Stand For</p>
            <h2 className="section-title">Our Values</h2>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={i * 0.1}>
                <div className="luxury-card p-7">
                  <div className="text-3xl mb-3">{v.emoji}</div>
                  <h3 className="font-display text-xl font-semibold text-charcoal mb-2">{v.title}</h3>
                  <p className="text-mink/75 font-body text-sm leading-relaxed">{v.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-gold text-center">
        <h2 className="font-display text-3xl font-bold text-white mb-4">Ready to Sleep Better?</h2>
        <p className="text-white/80 font-body mb-6">Visit our showroom or reach out on WhatsApp. We're here to help.</p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/mattresses" className="bg-white text-gold font-body font-semibold px-8 py-3 rounded-full hover:bg-cream transition-colors">
            Browse Mattresses
          </Link>
          <Link to="/contact" className="border border-white text-white font-body font-semibold px-8 py-3 rounded-full hover:bg-white/10 transition-colors">
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  )
}
