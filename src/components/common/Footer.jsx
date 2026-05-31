import React from 'react'
import { Link } from 'react-router-dom'
import { FaWhatsapp, FaInstagram, FaFacebook, FaPhoneAlt, FaMapMarkerAlt, FaEnvelope } from 'react-icons/fa'
import { STORE_INFO } from '../../utils/constants'
import { openWhatsApp } from '../../utils/whatsapp'

export default function Footer() {
  return (
    <footer className="bg-charcoal text-white/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <h3 className="font-serif text-2xl text-white mb-2">Royale Sleepy</h3>
            <p className="text-xs tracking-[0.3em] text-gold mb-4">BERHAMPUR, ODISHA</p>
            <p className="text-sm leading-relaxed mb-6">
              Crafting exceptional sleep experiences with premium mattresses for over a decade. Your comfort is our legacy.
            </p>
            <div className="flex gap-4">
              <a href={STORE_INFO.instagram} target="_blank" rel="noreferrer" className="w-9 h-9 border border-white/20 rounded-full flex items-center justify-center hover:border-gold hover:text-gold transition-colors">
                <FaInstagram size={15} />
              </a>
              <a href={STORE_INFO.facebook} target="_blank" rel="noreferrer" className="w-9 h-9 border border-white/20 rounded-full flex items-center justify-center hover:border-gold hover:text-gold transition-colors">
                <FaFacebook size={15} />
              </a>
              <button onClick={() => openWhatsApp()} className="w-9 h-9 border border-white/20 rounded-full flex items-center justify-center hover:border-green-400 hover:text-green-400 transition-colors">
                <FaWhatsapp size={15} />
              </button>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold tracking-wider text-sm mb-6">EXPLORE</h4>
            <ul className="space-y-3 text-sm">
              {[['Home', '/'], ['Mattresses', '/mattresses'], ['About Us', '/about'], ['Reviews', '/reviews'], ['Contact', '/contact']].map(([label, path]) => (
                <li key={path}>
                  <Link to={path} className="hover:text-gold transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-white font-semibold tracking-wider text-sm mb-6">OUR RANGE</h4>
            <ul className="space-y-3 text-sm">
              {['Orthopedic Mattresses', 'Memory Foam', 'Latex Mattresses', 'Pocket Spring', 'Luxury Collection', 'Kids Mattresses'].map(item => (
                <li key={item}>
                  <Link to="/mattresses" className="hover:text-gold transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold tracking-wider text-sm mb-6">VISIT US</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex gap-3">
                <FaMapMarkerAlt className="text-gold mt-0.5 shrink-0" size={14} />
                <span>{STORE_INFO.address}</span>
              </li>
              <li className="flex gap-3">
                <FaPhoneAlt className="text-gold mt-0.5 shrink-0" size={14} />
                <a href={`tel:${STORE_INFO.phone}`} className="hover:text-gold transition-colors">{STORE_INFO.phone}</a>
              </li>
              <li className="flex gap-3">
                <FaEnvelope className="text-gold mt-0.5 shrink-0" size={14} />
                <a href={`mailto:${STORE_INFO.email}`} className="hover:text-gold transition-colors">{STORE_INFO.email}</a>
              </li>
            </ul>
            <div className="mt-6 text-sm">
              <p className="font-medium text-white mb-1">Store Hours</p>
              <p>Mon–Sat: 10:00 AM – 8:00 PM</p>
              <p>Sun: 11:00 AM – 6:00 PM</p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
          <p>© {new Date().getFullYear()} Royale Sleepy. All rights reserved. Berhampur, Odisha.</p>
          <p>Best Mattress Store in Berhampur | Luxury Mattresses Odisha</p>
        </div>
      </div>
    </footer>
  )
}
