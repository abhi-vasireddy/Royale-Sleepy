import React from 'react'
import { motion } from 'framer-motion'
import { FaWhatsapp, FaPlay } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { openWhatsApp } from '../../utils/whatsapp'

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.25, 0.1, 0.25, 1], delay } })
}

export default function HeroSection({ videoUrl }) {
  return (
    <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Video / Image Background */}
      {videoUrl ? (
        <video
          autoPlay muted loop playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
      ) : (
        <img
          src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1800&q=80"
          alt="Luxury Mattress"
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* Luxury overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
      
      {/* Warm tint overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-900/10 to-transparent" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.div
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          <motion.p
            variants={fadeUp}
            custom={0.2}
            className="text-gold-light text-sm tracking-[0.5em] uppercase font-medium"
          >
            Royale Sleepy • Berhampur, Odisha
          </motion.p>

          <motion.h1
            variants={fadeUp}
            custom={0.4}
            className="font-serif text-5xl sm:text-6xl lg:text-7xl text-white leading-tight"
          >
            Sleep Better.
            <br />
            <span className="italic text-gold-light">Live Better.</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            custom={0.6}
            className="text-white/80 text-lg sm:text-xl max-w-xl mx-auto leading-relaxed"
          >
            Premium mattresses designed for ultimate comfort. 
            Experience the luxury of perfect sleep.
          </motion.p>

          <motion.div
            variants={fadeUp}
            custom={0.8}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2"
          >
            <Link
              to="/mattresses"
              className="group flex items-center gap-3 bg-white text-charcoal px-8 py-4 rounded-full font-semibold text-sm tracking-wide hover:bg-cream transition-all hover:scale-105 shadow-xl"
            >
              <span>Explore Collection</span>
              <span className="w-6 h-6 bg-gold rounded-full flex items-center justify-center group-hover:translate-x-1 transition-transform">
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
              </span>
            </Link>
            <button
              onClick={() => openWhatsApp()}
              className="flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-full font-semibold text-sm tracking-wide hover:scale-105 transition-all shadow-xl"
            >
              <FaWhatsapp size={20} />
              WhatsApp Inquiry
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-white/60 text-xs tracking-[0.3em] uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-px h-8 bg-gradient-to-b from-white/60 to-transparent"
        />
      </motion.div>
    </section>
  )
}
