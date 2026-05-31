// src/pages/AdminDashboardPage.jsx
// ============================================================
// Complete Admin Dashboard for Royale Sleepy
// Features: Products, Reviews, Leads, Media, Homepage management
// ============================================================
import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  collection, getDocs, addDoc, updateDoc, deleteDoc,
  doc, orderBy, query, serverTimestamp, setDoc, getDoc
} from 'firebase/firestore'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { db, storage } from '../config/firebase'
import { useAuth } from '../context/AuthContext'
import { DEFAULT_PRODUCTS, DEFAULT_REVIEWS, PRODUCT_CATEGORIES, PRODUCT_SIZES } from '../utils/constants'

// ---- Reusable: Upload button with progress ----
function UploadButton({ label, accept = 'image/*', storageFolder, onUploaded }) {
  const [progress, setProgress] = useState(0)
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef()

  const handleUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    const storageRef = ref(storage, `${storageFolder}/${Date.now()}_${file.name}`)
    const task = uploadBytesResumable(storageRef, file)
    task.on(
      'state_changed',
      snap => setProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100)),
      err => { console.error(err); setUploading(false) },
      async () => {
        const url = await getDownloadURL(task.snapshot.ref)
        onUploaded(url)
        setUploading(false)
        setProgress(0)
      }
    )
  }

  return (
    <div>
      <input ref={inputRef} type="file" accept={accept} onChange={handleUpload} className="hidden" />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="btn-outline text-sm py-2 px-4"
      >
        {uploading ? `${progress}%` : label}
      </button>
    </div>
  )
}

// ---- Toast notification ----
function Toast({ message, type = 'success' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full text-sm font-body font-medium shadow-xl ${
        type === 'success' ? 'bg-charcoal text-warm-white' : 'bg-red-500 text-white'
      }`}
    >
      {message}
    </motion.div>
  )
}

// ========================
// SECTION: Products
// ========================
function ProductsSection() {
  const [products, setProducts] = useState([])
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({
    name: '', description: '', price: '', discount: '0',
    category: 'Memory Foam', sizes: [], variants: [],
    stock: true, featured: false, images: []
  })
  const [toast, setToast] = useState(null)
  const [showForm, setShowForm] = useState(false)

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const fetchProducts = async () => {
    try {
      const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'))
      const snap = await getDocs(q)
      setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    } catch {
      setProducts(DEFAULT_PRODUCTS)
    }
  }

  useEffect(() => { fetchProducts() }, [])

  const resetForm = () => {
    setForm({ name: '', description: '', price: '', discount: '0', category: 'Memory Foam', sizes: [], variants: [], stock: true, featured: false, images: [] })
    setEditing(null)
    setShowForm(false)
  }

  const handleEdit = (product) => {
    setEditing(product.id)
    setForm({ ...product, price: String(product.price), discount: String(product.discount || 0) })
    setShowForm(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    const data = { ...form, price: Number(form.price), discount: Number(form.discount), updatedAt: serverTimestamp() }
    try {
      if (editing) {
        await updateDoc(doc(db, 'products', editing), data)
        showToast('Product updated!')
      } else {
        await addDoc(collection(db, 'products'), { ...data, createdAt: serverTimestamp() })
        showToast('Product added!')
      }
      fetchProducts()
      resetForm()
    } catch (err) {
      showToast('Error saving product', 'error')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return
    try {
      await deleteDoc(doc(db, 'products', id))
      showToast('Product deleted')
      fetchProducts()
    } catch { showToast('Delete failed', 'error') }
  }

  const toggleSize = (size) => {
    setForm(p => ({
      ...p,
      sizes: p.sizes.includes(size) ? p.sizes.filter(s => s !== size) : [...p.sizes, size]
    }))
  }

  return (
    <div>
      <AnimatePresence>{toast && <Toast message={toast.msg} type={toast.type} />}</AnimatePresence>

      <div className="flex justify-between items-center mb-6">
        <h2 className="font-display text-2xl font-bold text-charcoal">Products</h2>
        <button onClick={() => { resetForm(); setShowForm(true) }} className="btn-gold py-2 px-5 text-sm">
          + Add Product
        </button>
      </div>

      {/* Product Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-beige/50 border border-gold-light rounded-2xl p-6 mb-6 overflow-hidden"
          >
            <form onSubmit={handleSave} className="space-y-4">
              <h3 className="font-display text-lg font-semibold text-charcoal">{editing ? 'Edit' : 'Add'} Product</h3>

              <div className="grid sm:grid-cols-2 gap-4">
                <input required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  placeholder="Product Name *" className="admin-input" />
                <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} className="admin-input">
                  {PRODUCT_CATEGORIES.filter(c => c !== 'All').map(c => <option key={c}>{c}</option>)}
                </select>
                <input required type="number" value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))}
                  placeholder="Price (₹) *" className="admin-input" />
                <input type="number" value={form.discount} onChange={e => setForm(p => ({ ...p, discount: e.target.value }))}
                  placeholder="Discount %" className="admin-input" />
              </div>

              <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                placeholder="Description" rows={3} className="admin-input w-full resize-none" />

              {/* Sizes */}
              <div>
                <p className="text-xs font-body font-semibold text-charcoal/60 uppercase tracking-wider mb-2">Sizes</p>
                <div className="flex flex-wrap gap-2">
                  {PRODUCT_SIZES.map(size => (
                    <button type="button" key={size} onClick={() => toggleSize(size)}
                      className={`px-3 py-1 rounded-full text-xs font-body border transition-all ${
                        form.sizes.includes(size) ? 'bg-gold text-white border-gold' : 'border-gold-light text-mink hover:border-gold'
                      }`}>
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Variants */}
              <div>
                <p className="text-xs font-body font-semibold text-charcoal/60 uppercase tracking-wider mb-2">Variants (comma-separated)</p>
                <input
                  value={form.variants?.join(', ')}
                  onChange={e => setForm(p => ({ ...p, variants: e.target.value.split(',').map(v => v.trim()).filter(Boolean) }))}
                  placeholder="Soft, Medium, Firm"
                  className="admin-input w-full"
                />
              </div>

              {/* Image upload */}
              <div>
                <p className="text-xs font-body font-semibold text-charcoal/60 uppercase tracking-wider mb-2">Product Images</p>
                <div className="flex flex-wrap gap-2 mb-2">
                  {form.images?.map((url, i) => (
                    <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden">
                      <img src={url} alt="" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => setForm(p => ({ ...p, images: p.images.filter((_, j) => j !== i) }))}
                        className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-bl">✕</button>
                    </div>
                  ))}
                </div>
                <UploadButton label="📸 Upload Image" storageFolder="products"
                  onUploaded={url => setForm(p => ({ ...p, images: [...(p.images || []), url] }))} />
              </div>

              {/* Toggles */}
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.stock} onChange={e => setForm(p => ({ ...p, stock: e.target.checked }))} className="accent-gold" />
                  <span className="text-sm font-body text-charcoal">In Stock</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.featured} onChange={e => setForm(p => ({ ...p, featured: e.target.checked }))} className="accent-gold" />
                  <span className="text-sm font-body text-charcoal">Featured on Home</span>
                </label>
              </div>

              <div className="flex gap-3">
                <button type="submit" className="btn-gold py-2 px-6">{editing ? 'Update' : 'Save'} Product</button>
                <button type="button" onClick={resetForm} className="btn-outline py-2 px-6">Cancel</button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Products table */}
      <div className="space-y-3">
        {products.map(product => (
          <div key={product.id} className="luxury-card p-4 flex items-center gap-4">
            <img
              src={product.images?.[0] || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=100'}
              alt={product.name}
              className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="font-body font-semibold text-charcoal text-sm truncate">{product.name}</p>
              <p className="text-xs text-mink/60 font-body">₹{Number(product.price).toLocaleString('en-IN')} · {product.category}</p>
              <div className="flex gap-2 mt-1">
                {product.featured && <span className="text-[10px] bg-gold/10 text-gold px-2 py-0.5 rounded-full">Featured</span>}
                {product.stock ? <span className="text-[10px] bg-green-50 text-green-600 px-2 py-0.5 rounded-full">In Stock</span>
                  : <span className="text-[10px] bg-red-50 text-red-500 px-2 py-0.5 rounded-full">Out of Stock</span>}
              </div>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button onClick={() => handleEdit(product)} className="text-xs btn-outline py-1.5 px-3">Edit</button>
              <button onClick={() => handleDelete(product.id)} className="text-xs border border-red-200 text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-full transition-colors">Delete</button>
            </div>
          </div>
        ))}
        {products.length === 0 && (
          <div className="text-center py-12 text-mink/50 font-body">No products yet. Add your first mattress!</div>
        )}
      </div>
    </div>
  )
}

// ========================
// SECTION: Reviews
// ========================
function ReviewsSection() {
  const [reviews, setReviews] = useState([])
  const [form, setForm] = useState({ name: '', location: '', rating: 5, text: '', avatar: '' })
  const [showForm, setShowForm] = useState(false)
  const [toast, setToast] = useState(null)

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000) }

  const fetchReviews = async () => {
    try {
      const snap = await getDocs(query(collection(db, 'reviews'), orderBy('createdAt', 'desc')))
      setReviews(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    } catch { setReviews(DEFAULT_REVIEWS) }
  }
  useEffect(() => { fetchReviews() }, [])

  const handleSave = async (e) => {
    e.preventDefault()
    try {
      await addDoc(collection(db, 'reviews'), { ...form, createdAt: serverTimestamp() })
      showToast('Review added!')
      setShowForm(false)
      setForm({ name: '', location: '', rating: 5, text: '', avatar: '' })
      fetchReviews()
    } catch { showToast('Error') }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this review?')) return
    await deleteDoc(doc(db, 'reviews', id))
    showToast('Deleted')
    fetchReviews()
  }

  return (
    <div>
      <AnimatePresence>{toast && <Toast message={toast} />}</AnimatePresence>
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-display text-2xl font-bold text-charcoal">Reviews</h2>
        <button onClick={() => setShowForm(!showForm)} className="btn-gold py-2 px-5 text-sm">+ Add Review</button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="bg-beige/50 border border-gold-light rounded-2xl p-6 mb-6 overflow-hidden">
            <form onSubmit={handleSave} className="space-y-3">
              <div className="grid sm:grid-cols-2 gap-3">
                <input required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  placeholder="Customer Name *" className="admin-input" />
                <input value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))}
                  placeholder="Location" className="admin-input" />
                <input value={form.avatar} onChange={e => setForm(p => ({ ...p, avatar: e.target.value }))}
                  placeholder="Initials (e.g. RS)" className="admin-input" />
                <select value={form.rating} onChange={e => setForm(p => ({ ...p, rating: Number(e.target.value) }))} className="admin-input">
                  {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{r} Stars</option>)}
                </select>
              </div>
              <textarea required value={form.text} onChange={e => setForm(p => ({ ...p, text: e.target.value }))}
                placeholder="Review text *" rows={3} className="admin-input w-full resize-none" />
              <div className="flex gap-3">
                <button type="submit" className="btn-gold py-2 px-5">Save Review</button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-outline py-2 px-5">Cancel</button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-3">
        {reviews.map(review => (
          <div key={review.id} className="luxury-card p-4 flex items-start gap-4">
            <div className="w-10 h-10 bg-gold/20 rounded-full flex items-center justify-center text-gold font-bold text-sm flex-shrink-0">
              {review.avatar || review.name?.[0]}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-body font-semibold text-charcoal text-sm">{review.name}</p>
                <p className="text-xs text-mink/60">{review.location}</p>
                <div className="flex">{Array.from({ length: review.rating }).map((_, i) => <span key={i} className="text-gold text-xs">★</span>)}</div>
              </div>
              <p className="text-sm text-mink/75 font-body italic">"{review.text}"</p>
            </div>
            <button onClick={() => handleDelete(review.id)} className="text-xs border border-red-200 text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-full">Delete</button>
          </div>
        ))}
      </div>
    </div>
  )
}

// ========================
// SECTION: Leads
// ========================
function LeadsSection() {
  const [leads, setLeads] = useState([])

  useEffect(() => {
    const fetch = async () => {
      try {
        const q = query(collection(db, 'leads'), orderBy('createdAt', 'desc'))
        const snap = await getDocs(q)
        setLeads(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      } catch {}
    }
    fetch()
  }, [])

  return (
    <div>
      <h2 className="font-display text-2xl font-bold text-charcoal mb-6">Customer Leads</h2>
      <div className="luxury-card overflow-hidden">
        <table className="w-full text-sm font-body">
          <thead className="bg-beige">
            <tr>
              <th className="text-left p-4 text-xs font-semibold text-charcoal/60 uppercase tracking-wider">Name</th>
              <th className="text-left p-4 text-xs font-semibold text-charcoal/60 uppercase tracking-wider">Phone</th>
              <th className="text-left p-4 text-xs font-semibold text-charcoal/60 uppercase tracking-wider hidden sm:table-cell">Source</th>
              <th className="text-left p-4 text-xs font-semibold text-charcoal/60 uppercase tracking-wider hidden md:table-cell">Date</th>
              <th className="text-left p-4 text-xs font-semibold text-charcoal/60 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gold-light/30">
            {leads.map(lead => (
              <tr key={lead.id} className="hover:bg-beige/30 transition-colors">
                <td className="p-4 font-medium text-charcoal">{lead.name}</td>
                <td className="p-4 text-mink">
                  <a href={`tel:${lead.phone}`} className="hover:text-gold transition-colors">{lead.phone}</a>
                </td>
                <td className="p-4 text-mink/60 hidden sm:table-cell">{lead.source || 'popup'}</td>
                <td className="p-4 text-mink/60 hidden md:table-cell">
                  {lead.createdAt?.toDate?.()?.toLocaleDateString?.('en-IN') || '—'}
                </td>
                <td className="p-4">
                  <a
                    href={`https://wa.me/${lead.phone?.replace(/[^0-9]/g, '')}?text=Hi ${lead.name}, thank you for your interest in Royale Sleepy!`}
                    target="_blank" rel="noopener noreferrer"
                    className="text-xs bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 px-3 py-1.5 rounded-full transition-colors"
                  >
                    💬 WhatsApp
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {leads.length === 0 && (
          <div className="text-center py-10 text-mink/50 font-body">No leads yet. They'll appear here after customers submit the lead form.</div>
        )}
      </div>
    </div>
  )
}

// ========================
// SECTION: Homepage Settings
// ========================
function HomepageSection() {
  const [config, setConfig] = useState({ hero: {}, bannerVideoUrl: '' })
  const [saved, setSaved] = useState(false)
  const [toast, setToast] = useState(null)
  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000) }

  useEffect(() => {
    getDoc(doc(db, 'homepage', 'config')).then(snap => {
      if (snap.exists()) setConfig(snap.data())
    }).catch(() => {})
  }, [])

  const saveConfig = async () => {
    try {
      await setDoc(doc(db, 'homepage', 'config'), config)
      showToast('Homepage settings saved!')
    } catch { showToast('Error saving') }
  }

  // ---- Offer management ----
  const [offer, setOffer] = useState({ enabled: false, title: '', description: '', code: '', emoji: '🎉', validUntil: '' })

  useEffect(() => {
    getDoc(doc(db, 'offers', 'current')).then(snap => {
      if (snap.exists()) setOffer(snap.data())
    }).catch(() => {})
  }, [])

  const saveOffer = async () => {
    try {
      await setDoc(doc(db, 'offers', 'current'), offer)
      showToast('Offer saved!')
    } catch { showToast('Error') }
  }

  return (
    <div className="space-y-8">
      <AnimatePresence>{toast && <Toast message={toast} />}</AnimatePresence>

      {/* Hero settings */}
      <div>
        <h2 className="font-display text-2xl font-bold text-charcoal mb-4">Hero Section</h2>
        <div className="bg-beige/50 border border-gold-light rounded-2xl p-6 space-y-4">
          <div>
            <label className="admin-label">Hero Heading</label>
            <input
              value={config.hero?.heading || ''}
              onChange={e => setConfig(p => ({ ...p, hero: { ...p.hero, heading: e.target.value } }))}
              placeholder="Sleep Better. Live Better."
              className="admin-input w-full"
            />
          </div>
          <div>
            <label className="admin-label">Hero Subheading</label>
            <textarea
              value={config.hero?.subheading || ''}
              onChange={e => setConfig(p => ({ ...p, hero: { ...p.hero, subheading: e.target.value } }))}
              placeholder="Premium mattresses designed for ultimate comfort."
              rows={2}
              className="admin-input w-full resize-none"
            />
          </div>
          <div>
            <label className="admin-label">Hero Background Image URL</label>
            <div className="flex gap-2">
              <input
                value={config.hero?.imageUrl || ''}
                onChange={e => setConfig(p => ({ ...p, hero: { ...p.hero, imageUrl: e.target.value } }))}
                placeholder="https://..."
                className="admin-input flex-1"
              />
              <UploadButton label="Upload" storageFolder="hero"
                onUploaded={url => setConfig(p => ({ ...p, hero: { ...p.hero, imageUrl: url } }))} />
            </div>
          </div>
          <div>
            <label className="admin-label">Hero Video URL (optional, overrides image)</label>
            <div className="flex gap-2">
              <input
                value={config.hero?.videoUrl || ''}
                onChange={e => setConfig(p => ({ ...p, hero: { ...p.hero, videoUrl: e.target.value } }))}
                placeholder="https://..."
                className="admin-input flex-1"
              />
              <UploadButton label="Upload Video" accept="video/*" storageFolder="hero"
                onUploaded={url => setConfig(p => ({ ...p, hero: { ...p.hero, videoUrl: url } }))} />
            </div>
          </div>
          <div>
            <label className="admin-label">Banner Video URL (mid-page section)</label>
            <div className="flex gap-2">
              <input
                value={config.bannerVideoUrl || ''}
                onChange={e => setConfig(p => ({ ...p, bannerVideoUrl: e.target.value }))}
                placeholder="https://..."
                className="admin-input flex-1"
              />
              <UploadButton label="Upload" accept="video/*" storageFolder="banner"
                onUploaded={url => setConfig(p => ({ ...p, bannerVideoUrl: url }))} />
            </div>
          </div>
          <button onClick={saveConfig} className="btn-gold py-2 px-6">Save Hero Settings</button>
        </div>
      </div>

      {/* Offer popup */}
      <div>
        <h2 className="font-display text-2xl font-bold text-charcoal mb-4">Offer Popup</h2>
        <div className="bg-beige/50 border border-gold-light rounded-2xl p-6 space-y-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={offer.enabled} onChange={e => setOffer(p => ({ ...p, enabled: e.target.checked }))} className="accent-gold w-4 h-4" />
            <span className="font-body font-medium text-charcoal">Enable Offer Popup</span>
          </label>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="admin-label">Title</label>
              <input value={offer.title} onChange={e => setOffer(p => ({ ...p, title: e.target.value }))} placeholder="Festival Special!" className="admin-input w-full" />
            </div>
            <div>
              <label className="admin-label">Coupon Code</label>
              <input value={offer.code} onChange={e => setOffer(p => ({ ...p, code: e.target.value }))} placeholder="SLEEP20" className="admin-input w-full" />
            </div>
            <div>
              <label className="admin-label">Emoji</label>
              <input value={offer.emoji} onChange={e => setOffer(p => ({ ...p, emoji: e.target.value }))} placeholder="🎉" className="admin-input w-full" />
            </div>
            <div>
              <label className="admin-label">Valid Until</label>
              <input type="date" value={offer.validUntil} onChange={e => setOffer(p => ({ ...p, validUntil: e.target.value }))} className="admin-input w-full" />
            </div>
          </div>
          <div>
            <label className="admin-label">Description</label>
            <textarea value={offer.description} onChange={e => setOffer(p => ({ ...p, description: e.target.value }))}
              placeholder="Get 20% off on all mattresses this weekend!" rows={2} className="admin-input w-full resize-none" />
          </div>
          <button onClick={saveOffer} className="btn-gold py-2 px-6">Save Offer</button>
        </div>
      </div>
    </div>
  )
}

// ========================
// MAIN DASHBOARD
// ========================
const TABS = [
  { id: 'products', label: '🛏️ Products' },
  { id: 'reviews', label: '⭐ Reviews' },
  { id: 'leads', label: '📞 Leads' },
  { id: 'homepage', label: '🏠 Homepage' },
]

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState('products')
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/admin')
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Sidebar for desktop */}
      <div className="flex">
        <aside className="hidden lg:flex flex-col w-60 bg-charcoal min-h-screen fixed left-0 top-0 bottom-0">
          <div className="p-6 border-b border-warm-white/10">
            <h1 className="font-display text-lg font-bold text-warm-white">Royale Sleepy</h1>
            <p className="text-gold text-xs tracking-widest uppercase font-body mt-0.5">Admin Panel</p>
          </div>
          <nav className="p-4 flex-1">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full text-left px-4 py-3 rounded-xl font-body text-sm mb-1 transition-colors ${
                  activeTab === tab.id
                    ? 'bg-gold text-white'
                    : 'text-warm-white/60 hover:text-warm-white hover:bg-warm-white/10'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
          <div className="p-4 border-t border-warm-white/10">
            <p className="text-warm-white/40 text-xs font-body mb-3 truncate">{currentUser?.email}</p>
            <button onClick={handleLogout} className="text-warm-white/60 hover:text-warm-white text-sm font-body transition-colors">
              Sign Out →
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 lg:ml-60">
          {/* Top bar */}
          <div className="bg-warm-white border-b border-gold-light/30 px-4 lg:px-8 py-4 flex items-center justify-between sticky top-0 z-20">
            <h2 className="font-display text-lg font-semibold text-charcoal capitalize">
              {TABS.find(t => t.id === activeTab)?.label.split(' ').slice(1).join(' ')}
            </h2>
            <button onClick={handleLogout} className="text-sm text-mink hover:text-charcoal font-body lg:hidden">Sign Out</button>
          </div>

          {/* Mobile tabs */}
          <div className="lg:hidden overflow-x-auto bg-warm-white border-b border-gold-light/30 px-4">
            <div className="flex gap-2 py-3">
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-shrink-0 text-xs px-4 py-2 rounded-full font-body transition-all ${
                    activeTab === tab.id ? 'bg-gold text-white' : 'border border-gold-light text-mink'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab content */}
          <div className="p-4 lg:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {activeTab === 'products' && <ProductsSection />}
                {activeTab === 'reviews' && <ReviewsSection />}
                {activeTab === 'leads' && <LeadsSection />}
                {activeTab === 'homepage' && <HomepageSection />}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* Global admin styles */}
      <style>{`
        .admin-input {
          border: 1px solid #E8D5B0;
          background: white;
          border-radius: 0.75rem;
          padding: 0.625rem 1rem;
          font-family: 'Poppins', sans-serif;
          font-size: 0.875rem;
          color: #2C2C2C;
          outline: none;
          transition: border-color 0.2s;
        }
        .admin-input:focus { border-color: #C9A96E; }
        .admin-label {
          display: block;
          font-size: 0.7rem;
          font-weight: 600;
          color: rgba(44,44,44,0.6);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 0.25rem;
        }
      `}</style>
    </div>
  )
}
