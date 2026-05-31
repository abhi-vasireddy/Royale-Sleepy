// src/components/ui/OfferPopup.jsx
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../config/firebase'

export default function OfferPopup() {
  const [show, setShow] = useState(false)
  const [offer, setOffer] = useState(null)

  useEffect(() => {
    const dismissed = sessionStorage.getItem('offerPopupDismissed')
    if (dismissed) return

    // Fetch offer config from Firestore
    const fetchOffer = async () => {
      try {
        const docRef = doc(db, 'offers', 'current')
        const snap = await getDoc(docRef)
        if (snap.exists()) {
          const data = snap.data()
          if (data.enabled) {
            setOffer(data)
            setTimeout(() => setShow(true), 3000)
          }
        }
      } catch (err) {
        console.log('No offer configured')
      }
    }
    fetchOffer()
  }, [])

  const handleClose = () => {
    setShow(false)
    sessionStorage.setItem('offerPopupDismissed', 'true')
  }

  if (!offer) return null

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-charcoal/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="relative bg-cream rounded-3xl overflow-hidden shadow-2xl max-w-md w-full"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 z-10 w-8 h-8 bg-charcoal/20 rounded-full flex items-center justify-center text-white hover:bg-charcoal/40 transition-colors"
            >
              ✕
            </button>

            {/* Banner image */}
            {offer.bannerUrl && (
              <img src={offer.bannerUrl} alt="Special Offer" className="w-full h-48 object-cover" />
            )}

            <div className="p-8 text-center">
              <span className="text-3xl">{offer.emoji || '🎉'}</span>
              <h2 className="font-display text-2xl font-bold text-charcoal mt-3 mb-2">{offer.title || 'Special Offer!'}</h2>
              <p className="text-mink font-body text-sm leading-relaxed mb-5">{offer.description}</p>
              {offer.code && (
                <div className="bg-gold/10 border border-gold/30 rounded-xl px-6 py-3 mb-5">
                  <p className="text-xs text-mink font-body mb-1">Use code at our store:</p>
                  <p className="font-display text-2xl font-bold text-gold tracking-widest">{offer.code}</p>
                </div>
              )}
              <button onClick={handleClose} className="btn-gold w-full justify-center">
                Shop Now
              </button>
              <p className="text-xs text-mink/40 mt-3 font-body">Valid until {offer.validUntil || 'limited period'}</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
