// src/components/layout/Footer.jsx
import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { SITE_CONFIG, NAV_LINKS, WHATSAPP_MESSAGES } from '../../utils/constants'

export default function Footer() {
  const whatsappLink = `https://wa.me/${SITE_CONFIG.whatsapp}?text=${encodeURIComponent(WHATSAPP_MESSAGES.general)}`

  return (
    <footer className="bg-charcoal text-warm-white/80">
      {/* Top gold border */}
      <div className="h-px bg-gradient-to-r from-transparent via-gold to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <h3 className="font-display text-2xl text-warm-white mb-2">Royale Sleepy</h3>
            <p className="text-xs tracking-[0.3em] text-gold mb-4 uppercase">Berhampur · Odisha</p>
            <p className="text-sm leading-relaxed text-warm-white/60 mb-6">
              Berhampur's finest luxury mattress showroom. Crafting perfect sleep experiences since 2010.
            </p>
            <div className="flex gap-3">
              <a href={SITE_CONFIG.instagram} target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-warm-white/20 flex items-center justify-center hover:border-gold hover:text-gold transition-colors text-sm">
                📸
              </a>
              <a href={SITE_CONFIG.facebook} target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-warm-white/20 flex items-center justify-center hover:border-gold hover:text-gold transition-colors text-sm">
                👥
              </a>
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-warm-white/20 flex items-center justify-center hover:border-gold hover:text-gold transition-colors text-sm">
                💬
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-body font-semibold text-warm-white text-sm uppercase tracking-widest mb-5">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="text-sm text-warm-white/60 hover:text-gold transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Collections */}
          <div>
            <h4 className="font-body font-semibold text-warm-white text-sm uppercase tracking-widest mb-5">
              Collections
            </h4>
            <ul className="space-y-3">
              {['Memory Foam', 'Orthopedic', 'Natural Latex', 'Hybrid', 'Spring', 'Kids'].map((cat) => (
                <li key={cat}>
                  <Link to="/mattresses" className="text-sm text-warm-white/60 hover:text-gold transition-colors">
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-body font-semibold text-warm-white text-sm uppercase tracking-widest mb-5">
              Visit Us
            </h4>
            <div className="space-y-4 text-sm text-warm-white/60">
              <div className="flex gap-3">
                <span className="text-gold mt-0.5">📍</span>
                <span>{SITE_CONFIG.address}</span>
              </div>
              <div className="flex gap-3">
                <span className="text-gold">📞</span>
                <a href={`tel:${SITE_CONFIG.phone}`} className="hover:text-gold transition-colors">
                  {SITE_CONFIG.phone}
                </a>
              </div>
              <div className="flex gap-3">
                <span className="text-gold">✉️</span>
                <a href={`mailto:${SITE_CONFIG.email}`} className="hover:text-gold transition-colors">
                  {SITE_CONFIG.email}
                </a>
              </div>
              <div className="flex gap-3">
                <span className="text-gold">🕐</span>
                <span>{SITE_CONFIG.hours}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-warm-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-warm-white/40">
            © {new Date().getFullYear()} Royale Sleepy. All rights reserved.
          </p>
          <p className="text-xs text-warm-white/40">
            Crafted with care for the people of Odisha
          </p>
        </div>
      </div>
    </footer>
  )
}
