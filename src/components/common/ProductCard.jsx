import React from 'react'
import { motion } from 'framer-motion'
import { FaWhatsapp, FaStar, FaTag } from 'react-icons/fa'
import { productWhatsApp } from '../../utils/whatsapp'

export default function ProductCard({ product, onClick }) {
  const discountedPrice = product.discount
    ? Math.round(product.price * (1 - product.discount / 100))
    : product.price

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="bg-white rounded-2xl overflow-hidden card-shadow hover:card-shadow-hover transition-shadow duration-300 cursor-pointer group"
      onClick={() => onClick && onClick(product)}
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-[4/3] bg-beige">
        <img
          src={product.images?.[0] || 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=70'}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {product.discount > 0 && (
          <div className="absolute top-3 left-3 bg-gold text-white text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
            <FaTag size={10} />
            {product.discount}% OFF
          </div>
        )}
        {!product.stock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white text-charcoal text-sm font-semibold px-4 py-2 rounded-full">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <p className="text-xs text-gold font-medium tracking-wider uppercase mb-1">{product.category}</p>
        <h3 className="font-serif text-lg text-charcoal mb-2 leading-snug">{product.name}</h3>

        {/* Sizes */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {product.sizes?.map(size => (
            <span key={size} className="text-xs bg-beige text-warm-gray px-2 py-0.5 rounded-full">{size}</span>
          ))}
        </div>

        {/* Price */}
        <div className="flex items-center gap-3 mb-4">
          <span className="font-serif text-xl text-charcoal font-semibold">₹{discountedPrice.toLocaleString()}</span>
          {product.discount > 0 && (
            <span className="text-sm text-warm-gray line-through">₹{product.price.toLocaleString()}</span>
          )}
        </div>

        <button
          onClick={e => { e.stopPropagation(); productWhatsApp(product.name) }}
          className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-2.5 rounded-xl text-sm font-medium transition-all hover:scale-[1.02]"
        >
          <FaWhatsapp size={16} />
          Ask on WhatsApp
        </button>
      </div>
    </motion.div>
  )
}
