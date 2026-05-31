// src/components/layout/Navbar.jsx
import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { NAV_LINKS, SITE_CONFIG, WHATSAPP_MESSAGES } from '../../utils/constants'

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 30)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => { setIsMenuOpen(false) }, [location.pathname])

  const whatsappLink = `https://wa.me/${SITE_CONFIG.whatsapp}?text=${encodeURIComponent(WHATSAPP_MESSAGES.general)}`

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled ? 'bg-warm-white/95 backdrop-blur-md shadow-sm border-b border-gold-light/30' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <Link to="/" className="flex flex-col leading-none group">
              <span className="font-display text-xl font-bold text-charcoal group-hover:text-gold transition-colors">
                Royale Sleepy
              </span>
              <span className="text-[10px] tracking-[0.3em] text-gold font-body uppercase">
                Berhampur · Odisha
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`font-body text-sm tracking-wide transition-colors duration-200 ${
                    location.pathname === link.href
                      ? 'text-gold font-medium'
                      : 'text-charcoal/70 hover:text-gold'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:flex btn-whatsapp text-sm py-2.5 px-5"
              >
                <span>💬</span>
                <span>WhatsApp</span>
              </a>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-lg text-charcoal hover:text-gold transition-colors"
                aria-label="Toggle menu"
              >
                <div className="w-6 h-5 flex flex-col justify-between">
                  <motion.span animate={isMenuOpen ? { rotate: 45, y: 9 } : { rotate: 0, y: 0 }} className="w-full h-0.5 bg-current block" />
                  <motion.span animate={isMenuOpen ? { opacity: 0 } : { opacity: 1 }} className="w-full h-0.5 bg-current block" />
                  <motion.span animate={isMenuOpen ? { rotate: -45, y: -9 } : { rotate: 0, y: 0 }} className="w-full h-0.5 bg-current block" />
                </div>
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed top-[72px] left-0 right-0 z-40 bg-warm-white/98 backdrop-blur-lg border-b border-gold-light/30 shadow-xl md:hidden"
          >
            <div className="px-6 py-6 flex flex-col gap-4">
              {NAV_LINKS.map((link, i) => (
                <motion.div key={link.href} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}>
                  <Link
                    to={link.href}
                    className={`font-body text-base block py-2 border-b border-beige ${
                      location.pathname === link.href ? 'text-gold font-medium' : 'text-charcoal'
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }} className="pt-2">
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="btn-whatsapp w-full justify-center">
                  <span>💬</span><span>Chat on WhatsApp</span>
                </a>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
