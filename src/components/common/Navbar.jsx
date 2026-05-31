import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMenu, FiX } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import { openWhatsApp } from '../../utils/whatsapp'

const NAV_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'Mattresses', path: '/mattresses' },
  { label: 'About', path: '/about' },
  { label: 'Reviews', path: '/reviews' },
  { label: 'Contact', path: '/contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => setOpen(false), [location])

  return (
    <>
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? 'bg-warm-white/95 backdrop-blur-md shadow-sm border-b border-beige' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex flex-col leading-tight">
              <span className={`font-serif text-2xl font-bold tracking-wide transition-colors ${scrolled ? 'text-charcoal' : 'text-white'}`}>
                Royale Sleepy
              </span>
              <span className={`text-xs tracking-[0.3em] uppercase transition-colors ${scrolled ? 'text-gold' : 'text-gold-light'}`}>
                Berhampur, Odisha
              </span>
            </Link>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-8">
              {NAV_LINKS.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-medium tracking-wide transition-all duration-200 hover:text-gold relative group ${
                    location.pathname === link.path ? 'text-gold' : scrolled ? 'text-charcoal' : 'text-white/90'
                  }`}
                >
                  {link.label}
                  <span className={`absolute -bottom-1 left-0 h-px bg-gold transition-all duration-300 ${
                    location.pathname === link.path ? 'w-full' : 'w-0 group-hover:w-full'
                  }`} />
                </Link>
              ))}
              <button
                onClick={() => openWhatsApp()}
                className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105 shadow-md"
              >
                <FaWhatsapp size={16} />
                WhatsApp
              </button>
            </div>

            {/* Mobile hamburger */}
            <button
              className={`md:hidden p-2 rounded-lg transition-colors ${scrolled ? 'text-charcoal' : 'text-white'}`}
              onClick={() => setOpen(!open)}
            >
              {open ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed top-20 left-0 right-0 z-40 bg-warm-white border-b border-beige shadow-xl md:hidden"
          >
            <div className="px-6 py-6 flex flex-col gap-4">
              {NAV_LINKS.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-base font-medium py-2 border-b border-beige last:border-0 transition-colors ${
                    location.pathname === link.path ? 'text-gold' : 'text-charcoal'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <button
                onClick={() => openWhatsApp()}
                className="flex items-center justify-center gap-2 bg-green-500 text-white px-6 py-3 rounded-full text-sm font-medium mt-2"
              >
                <FaWhatsapp size={18} />
                Chat on WhatsApp
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
