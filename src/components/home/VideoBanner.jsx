import React, { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { openWhatsApp } from '../../utils/constants'

export default function VideoBanner({ videoUrl }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const defaultVideo = 'https://videos.pexels.com/video-files/3773486/3773486-uhd_2560_1440_30fps.mp4'

  return (
    <section ref={ref} className="relative h-[60vh] overflow-hidden">
      <video
        autoPlay muted loop playsInline
        className="absolute inset-0 w-full h-full object-cover"
        src={videoUrl || defaultVideo}
      />
      <div className="absolute inset-0 bg-charcoal/60" />

      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="font-poppins text-gold text-xs tracking-[0.3em] uppercase font-medium mb-4"
        >
          Experience Luxury Sleep
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="font-playfair text-white text-4xl md:text-6xl font-bold mb-6"
        >
          Visit Our <span className="text-gold italic">Showroom</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.4 }}
          className="font-poppins text-white/70 text-base max-w-xl mb-8"
        >
          Experience the luxury of lying down on our mattresses in person. Our sleep experts are ready to guide you.
        </motion.p>
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.6 }}
          onClick={() => openWhatsApp('Hi, I want to schedule a showroom visit!')}
          className="font-poppins font-medium text-sm px-8 py-4 bg-gold text-white rounded-full hover:bg-gold-dark transition-all duration-300 shadow-lg hover:scale-105"
        >
          Book a Showroom Visit
        </motion.button>
      </div>
    </section>
  )
}
