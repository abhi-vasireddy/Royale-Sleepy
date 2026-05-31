import React from 'react'
import HeroSection from '../components/home/HeroSection'
import FeaturedCollection from '../components/home/FeaturedCollection'
import WhyChooseUs from '../components/home/WhyChooseUs'
import TestimonialsSlider from '../components/home/TestimonialsSlider'
import OfferPopup from '../components/home/OfferPopup'
import LeadPopup from '../components/common/LeadPopup'
import { motion } from 'framer-motion'
import { openWhatsApp } from '../utils/whatsapp'
import { FaWhatsapp } from 'react-icons/fa'

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturedCollection />
      <WhyChooseUs />

      {/* Video Banner Placeholder */}
      <section className="py-24 bg-charcoal/5">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden aspect-video bg-beige"
          >
            <img
              src="https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=1200&q=80"
              alt="Luxury showroom"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center">
              <p className="text-gold text-sm tracking-[0.4em] uppercase mb-3">Experience</p>
              <h2 className="font-serif text-4xl text-white mb-4">Visit Our Showroom</h2>
              <p className="text-white/80 mb-6">Berhampur's finest mattress showroom, now open 7 days a week.</p>
              <button
                onClick={() => openWhatsApp('Hi! I would like to know more about your showroom and visiting hours.')}
                className="flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-full font-medium hover:bg-green-600 transition-colors"
              >
                <FaWhatsapp size={18} />
                Book a Visit
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <TestimonialsSlider />

      {/* CTA Banner */}
      <section className="py-20 bg-warm-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-4xl sm:text-5xl text-charcoal mb-4">
              Ready for Your Best <span className="italic text-gold">Sleep?</span>
            </h2>
            <p className="text-warm-gray text-lg mb-8">
              Visit our showroom in Berhampur or reach us on WhatsApp for personalized recommendations.
            </p>
            <button
              onClick={() => openWhatsApp()}
              className="inline-flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white px-10 py-4 rounded-full font-semibold text-sm tracking-wide hover:scale-105 transition-all shadow-xl"
            >
              <FaWhatsapp size={22} />
              Chat with Our Sleep Expert
            </button>
          </motion.div>
        </div>
      </section>

      <OfferPopup />
      <LeadPopup />
    </>
  )
}
