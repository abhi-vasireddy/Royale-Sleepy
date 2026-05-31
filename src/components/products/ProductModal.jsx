import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { FaWhatsapp, FaStar, FaTag } from 'react-icons/fa'
import { productWhatsApp } from '../../utils/whatsapp'

export default function ProductModal({ product, onClose }) {
  const [imgIdx, setImgIdx] = useState(0)
  const [selectedSize, setSelectedSize] = useState(null)
  const [selectedVariant, setSelectedVariant] = useState(null)

  if (!product) return null

  const discountedPrice = product.discount
    ? Math.round(product.price * (1 - product.discount / 100))
    : product.price

  const images = product.images || ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80']

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
          onClick={e => e.stopPropagation()}
        >
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Image */}
            <div className="relative aspect-square bg-beige rounded-t-3xl md:rounded-l-3xl md:rounded-tr-none overflow-hidden">
              <img
                src={images[imgIdx]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {images.length > 1 && (
                <>
                  <button onClick={() => setImgIdx(i => (i - 1 + images.length) % images.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center">
                    <FiChevronLeft />
                  </button>
                  <button onClick={() => setImgIdx(i => (i + 1) % images.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center">
                    <FiChevronRight />
                  </button>
                </>
              )}
              {product.discount > 0 && (
                <div className="absolute top-3 left-3 bg-gold text-white text-xs px-2.5 py-1 rounded-full flex items-center gap-1">
                  <FaTag size={10} /> {product.discount}% OFF
                </div>
              )}
            </div>

            {/* Details */}
            <div className="p-6 md:p-8 flex flex-col">
              <button onClick={onClose} className="self-end w-8 h-8 flex items-center justify-center rounded-full hover:bg-beige transition-colors text-warm-gray mb-4">
                <FiX size={18} />
              </button>

              <p className="text-xs text-gold tracking-wider uppercase font-medium mb-2">{product.category}</p>
              <h2 className="font-serif text-2xl text-charcoal mb-2">{product.name}</h2>

              <div className="flex items-center gap-3 mb-4">
                <span className="font-serif text-3xl text-charcoal">₹{discountedPrice.toLocaleString()}</span>
                {product.discount > 0 && (
                  <span className="text-warm-gray line-through text-sm">₹{product.price.toLocaleString()}</span>
                )}
              </div>

              <p className="text-warm-gray text-sm leading-relaxed mb-6">{product.description}</p>

              {/* Sizes */}
              {product.sizes?.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-semibold text-charcoal tracking-wider uppercase mb-2">Size</p>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map(s => (
                      <button
                        key={s}
                        onClick={() => setSelectedSize(s)}
                        className={`px-4 py-1.5 rounded-full text-sm border transition-all ${
                          selectedSize === s ? 'border-gold bg-gold text-white' : 'border-beige text-warm-gray hover:border-gold'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Variants */}
              {product.variants?.length > 0 && (
                <div className="mb-6">
                  <p className="text-xs font-semibold text-charcoal tracking-wider uppercase mb-2">Firmness</p>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map(v => (
                      <button
                        key={v}
                        onClick={() => setSelectedVariant(v)}
                        className={`px-4 py-1.5 rounded-full text-sm border transition-all ${
                          selectedVariant === v ? 'border-gold bg-gold text-white' : 'border-beige text-warm-gray hover:border-gold'
                        }`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-auto">
                <button
                  onClick={() => productWhatsApp(`${product.name}${selectedSize ? ` (${selectedSize})` : ''}${selectedVariant ? ` - ${selectedVariant}` : ''}`)}
                  className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-3.5 rounded-xl font-semibold text-sm transition-all hover:scale-[1.02]"
                >
                  <FaWhatsapp size={20} />
                  Ask on WhatsApp
                </button>
                <p className="text-center text-xs text-warm-gray mt-3">
                  {product.stock ? '✅ In Stock — Available for immediate delivery' : '❌ Currently out of stock'}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
