// src/components/products/ProductCard.jsx
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { SITE_CONFIG, WHATSAPP_MESSAGES } from '../../utils/constants'

export default function ProductCard({ product, onClick }) {
  const [imgLoaded, setImgLoaded] = useState(false)
  const discountedPrice = product.discount > 0
    ? Math.round(product.price * (1 - product.discount / 100))
    : product.price

  const waLink = `https://wa.me/${SITE_CONFIG.whatsapp}?text=${encodeURIComponent(WHATSAPP_MESSAGES.product(product.name))}`

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.4 }}
      className="luxury-card group cursor-pointer"
      onClick={onClick}
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-[4/3] bg-beige">
        {/* Discount badge */}
        {product.discount > 0 && (
          <div className="absolute top-3 left-3 z-10 bg-gold text-white text-xs font-body font-semibold px-2.5 py-1 rounded-full">
            {product.discount}% OFF
          </div>
        )}
        {/* Stock badge */}
        {!product.stock && (
          <div className="absolute top-3 right-3 z-10 bg-charcoal/80 text-warm-white text-xs px-2.5 py-1 rounded-full">
            Out of Stock
          </div>
        )}

        {/* Shimmer loader */}
        {!imgLoaded && (
          <div className="absolute inset-0 bg-gradient-to-r from-beige via-warm-white to-beige bg-[length:200%_100%] animate-shimmer" />
        )}

        <img
          src={product.images?.[0] || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80'}
          alt={product.name}
          onLoad={() => setImgLoaded(true)}
          className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${
            imgLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

        {/* Quick WA button on hover */}
        <div className="absolute bottom-3 inset-x-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            className="btn-whatsapp w-full justify-center text-xs py-2"
          >
            <span>💬</span><span>Ask on WhatsApp</span>
          </a>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Category tag */}
        {product.category && (
          <span className="text-[10px] font-body font-medium text-gold tracking-widest uppercase">
            {product.category}
          </span>
        )}
        <h3 className="font-display text-lg font-semibold text-charcoal mt-1 mb-2 leading-snug">
          {product.name}
        </h3>

        {/* Sizes */}
        {product.sizes?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {product.sizes.map(size => (
              <span key={size} className="text-[10px] font-body border border-gold-light text-mink px-2 py-0.5 rounded-full">
                {size}
              </span>
            ))}
          </div>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-2 mt-3">
          <span className="font-display text-xl font-bold text-charcoal">
            ₹{discountedPrice.toLocaleString('en-IN')}
          </span>
          {product.discount > 0 && (
            <span className="text-sm font-body text-mink/60 line-through">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
          )}
        </div>

        {/* View details hint */}
        <p className="text-xs text-gold/70 font-body mt-2 group-hover:text-gold transition-colors">
          Click to view details →
        </p>
      </div>
    </motion.div>
  )
}
