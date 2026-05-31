import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX } from 'react-icons/fi'
import { db } from '../../firebase/config'
import { doc, getDoc } from 'firebase/firestore'
import { openWhatsApp } from '../../utils/whatsapp'

export default function OfferPopup() {
  const [show, setShow] = useState(false)
  const [offer, setOffer] = useState(null)

  useEffect(() => {
    const fetchOffer = async () => {
      try {
        const snap = await getDoc(doc(db, 'offers', 'current'))
        if (snap.exists() && snap.data().enabled) {
          setOffer(snap.data())
          const seen = sessionStorage.getItem('offer_seen')
          if (!seen) {
            setTimeout(() => setShow(true), 3000)
          }
        }
      } catch {
        // Demo offer
        setOffer({
          enabled: true,
          title: '🎉 Grand Summer Sale!',
          subtitle: 'Up to 25% off on all premium mattresses',
          description: 'Limited time offer. Visit our showroom in Berhampur or WhatsApp us now!',
          cta: 'Claim Offer on WhatsApp',
        })
        const seen = sessionStorage.getItem('offer_seen')
        if (!seen) setTimeout(() => setShow(true), 3000)
      }
    }
    fetchOffer()
  }, [])

  const handleClose = () => {
    setShow(false)
    sessionStorage.setItem('offer_seen', 'true')
  }

  if (!offer) return null

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/50"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="bg-white rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="gold-gradient p-6 text-center text-white">
              <h3 className="font-serif text-2xl mb-1">{offer.title}</h3>
              <p className="text-white/90 text-sm">{offer.subtitle}</p>
            </div>
            <div className="p-6 text-center">
              <p className="text-warm-gray text-sm mb-6">{offer.description}</p>
              <button
                onClick={() => { openWhatsApp('Hi! I saw your offer and would like to know more.'); handleClose() }}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-semibold text-sm transition-colors"
              >
                {offer.cta || 'Claim Offer'}
              </button>
              <button onClick={handleClose} className="mt-3 text-warm-gray text-xs hover:text-charcoal transition-colors">
                Maybe later
              </button>
            </div>
            <button onClick={handleClose} className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30">
              <FiX size={16} />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
