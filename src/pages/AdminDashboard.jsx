import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { db, storage } from '../firebase/config'
import {
  collection, getDocs, addDoc, updateDoc, deleteDoc, doc,
  serverTimestamp, orderBy, query, setDoc
} from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import toast from 'react-hot-toast'
import { FiPlus, FiEdit2, FiTrash2, FiLogOut, FiPackage, FiStar, FiUsers, FiSettings, FiHome } from 'react-icons/fi'
import { CATEGORIES } from '../utils/constants'

const TABS = [
  { id: 'products', label: 'Products', icon: FiPackage },
  { id: 'reviews', label: 'Reviews', icon: FiStar },
  { id: 'leads', label: 'Leads', icon: FiUsers },
  { id: 'settings', label: 'Settings', icon: FiSettings },
]

const emptyProduct = {
  name: '', description: '', price: '', discount: 0, category: 'Memory Foam',
  sizes: [], variants: [], stock: true, featured: false, images: []
}

export default function AdminDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('products')
  const [products, setProducts] = useState([])
  const [reviews, setReviews] = useState([])
  const [leads, setLeads] = useState([])
  const [form, setForm] = useState(emptyProduct)
  const [editing, setEditing] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [reviewForm, setReviewForm] = useState({ name: '', city: '', rating: 5, text: '' })
  const [uploadLoading, setUploadLoading] = useState(false)
  const [offerSettings, setOfferSettings] = useState({ enabled: true, title: '', subtitle: '', description: '', cta: '' })

  useEffect(() => {
    if (!user) { navigate('/admin'); return }
    fetchAll()
  }, [user])

  const fetchAll = async () => {
    try {
      const [pSnap, rSnap, lSnap] = await Promise.all([
        getDocs(query(collection(db, 'products'), orderBy('createdAt', 'desc'))),
        getDocs(query(collection(db, 'reviews'), orderBy('createdAt', 'desc'))),
        getDocs(query(collection(db, 'leads'), orderBy('createdAt', 'desc'))),
      ])
      setProducts(pSnap.docs.map(d => ({ id: d.id, ...d.data() })))
      setReviews(rSnap.docs.map(d => ({ id: d.id, ...d.data() })))
      setLeads(lSnap.docs.map(d => ({ id: d.id, ...d.data() })))
    } catch (err) {
      toast.error('Error fetching data: ' + err.message)
    }
  }

  const handleLogout = async () => { await logout(); navigate('/admin') }

  // Product CRUD
  const saveProduct = async () => {
    if (!form.name || !form.price) return toast.error('Name and price are required')
    try {
      const data = {
        ...form,
        price: Number(form.price),
        discount: Number(form.discount),
        sizes: form.sizes.filter(Boolean),
        variants: form.variants.filter(Boolean),
        createdAt: serverTimestamp(),
      }
      if (editing) {
        await updateDoc(doc(db, 'products', editing), data)
        toast.success('Product updated!')
      } else {
        await addDoc(collection(db, 'products'), data)
        toast.success('Product added!')
      }
      setForm(emptyProduct); setEditing(null); setShowForm(false); fetchAll()
    } catch (err) {
      toast.error(err.message)
    }
  }

  const deleteProduct = async (id) => {
    if (!confirm('Delete this product?')) return
    await deleteDoc(doc(db, 'products', id))
    toast.success('Deleted'); fetchAll()
  }

  const startEdit = (product) => {
    setForm({ ...product, price: product.price?.toString(), discount: product.discount?.toString() || '0' })
    setEditing(product.id); setShowForm(true)
  }

  const uploadImage = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploadLoading(true)
    try {
      const storageRef = ref(storage, `products/${Date.now()}_${file.name}`)
      await uploadBytes(storageRef, file)
      const url = await getDownloadURL(storageRef)
      setForm(f => ({ ...f, images: [...(f.images || []), url] }))
      toast.success('Image uploaded!')
    } catch {
      toast.error('Upload failed')
    } finally {
      setUploadLoading(false)
    }
  }

  // Review CRUD
  const saveReview = async () => {
    if (!reviewForm.name || !reviewForm.text) return toast.error('Name and review text required')
    await addDoc(collection(db, 'reviews'), { ...reviewForm, avatar: reviewForm.name.slice(0, 2).toUpperCase(), createdAt: serverTimestamp() })
    toast.success('Review added!'); setReviewForm({ name: '', city: '', rating: 5, text: '' }); fetchAll()
  }

  const deleteReview = async (id) => {
    if (!confirm('Delete this review?')) return
    await deleteDoc(doc(db, 'reviews', id)); toast.success('Deleted'); fetchAll()
  }

  // Offer settings
  const saveOffer = async () => {
    await setDoc(doc(db, 'offers', 'current'), { ...offerSettings })
    toast.success('Offer settings saved!')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-charcoal text-white flex flex-col fixed h-full">
        <div className="p-6 border-b border-white/10">
          <h2 className="font-serif text-xl">Royale Sleepy</h2>
          <p className="text-white/50 text-xs mt-1">Admin Dashboard</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                tab === t.id ? 'bg-gold text-white' : 'text-white/60 hover:bg-white/10 hover:text-white'
              }`}
            >
              <t.icon size={16} />
              {t.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10 space-y-2">
          <a href="/" target="_blank" className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-white/60 hover:bg-white/10 hover:text-white transition-all">
            <FiHome size={16} /> View Website
          </a>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-all">
            <FiLogOut size={16} /> Logout
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="ml-64 flex-1 p-8">
        {/* Products Tab */}
        {tab === 'products' && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="font-serif text-3xl text-charcoal">Products</h1>
                <p className="text-warm-gray text-sm mt-1">{products.length} products in catalog</p>
              </div>
              <button
                onClick={() => { setForm(emptyProduct); setEditing(null); setShowForm(true) }}
                className="flex items-center gap-2 gold-gradient text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:opacity-90"
              >
                <FiPlus /> Add Product
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map(p => (
                <div key={p.id} className="bg-white rounded-2xl overflow-hidden card-shadow">
                  <div className="aspect-video bg-beige">
                    <img src={p.images?.[0] || ''} alt={p.name} className="w-full h-full object-cover" onError={e => { e.target.style.display = 'none' }} />
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs text-gold font-medium mb-1">{p.category}</p>
                        <h3 className="font-semibold text-charcoal text-sm">{p.name}</h3>
                        <p className="text-warm-gray text-xs mt-1">₹{Number(p.price).toLocaleString()} {p.discount > 0 && `(${p.discount}% off)`}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => startEdit(p)} className="p-2 hover:bg-beige rounded-lg transition-colors"><FiEdit2 size={14} className="text-warm-gray" /></button>
                        <button onClick={() => deleteProduct(p.id)} className="p-2 hover:bg-red-50 rounded-lg transition-colors"><FiTrash2 size={14} className="text-red-400" /></button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${p.stock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                        {p.stock ? 'In Stock' : 'Out of Stock'}
                      </span>
                      {p.featured && <span className="text-xs px-2 py-0.5 rounded-full bg-gold/20 text-gold-dark">Featured</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Product Form Modal */}
            <AnimatePresence>
              {showForm && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
                  onClick={() => setShowForm(false)}
                >
                  <motion.div
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.95 }}
                    className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                    onClick={e => e.stopPropagation()}
                  >
                    <h2 className="font-serif text-2xl text-charcoal mb-6">{editing ? 'Edit' : 'Add'} Product</h2>
                    <div className="space-y-4">
                      <input placeholder="Product Name *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                        className="w-full border border-beige rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold" />
                      <textarea placeholder="Description" rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                        className="w-full border border-beige rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold resize-none" />
                      <div className="grid grid-cols-2 gap-4">
                        <input type="number" placeholder="Price (₹) *" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })}
                          className="border border-beige rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold" />
                        <input type="number" placeholder="Discount (%)" value={form.discount} onChange={e => setForm({ ...form, discount: e.target.value })}
                          className="border border-beige rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold" />
                      </div>
                      <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                        className="w-full border border-beige rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold">
                        {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c}>{c}</option>)}
                      </select>
                      <div>
                        <label className="text-xs font-semibold text-charcoal tracking-wider uppercase mb-2 block">Sizes (comma-separated)</label>
                        <input placeholder="Single, Double, Queen, King"
                          value={form.sizes?.join(', ')}
                          onChange={e => setForm({ ...form, sizes: e.target.value.split(',').map(s => s.trim()) })}
                          className="w-full border border-beige rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold" />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-charcoal tracking-wider uppercase mb-2 block">Variants</label>
                        <input placeholder="Soft, Medium, Firm"
                          value={form.variants?.join(', ')}
                          onChange={e => setForm({ ...form, variants: e.target.value.split(',').map(s => s.trim()) })}
                          className="w-full border border-beige rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold" />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-charcoal tracking-wider uppercase mb-2 block">Upload Image</label>
                        <input type="file" accept="image/*" onChange={uploadImage}
                          className="w-full border border-beige rounded-xl px-4 py-3 text-sm" />
                        {uploadLoading && <p className="text-xs text-gold mt-1">Uploading...</p>}
                        {form.images?.length > 0 && (
                          <div className="flex gap-2 mt-2 flex-wrap">
                            {form.images.map((url, i) => <img key={i} src={url} className="w-16 h-16 rounded-lg object-cover" />)}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-6">
                        <label className="flex items-center gap-2 text-sm cursor-pointer">
                          <input type="checkbox" checked={form.stock} onChange={e => setForm({ ...form, stock: e.target.checked })} className="rounded" />
                          In Stock
                        </label>
                        <label className="flex items-center gap-2 text-sm cursor-pointer">
                          <input type="checkbox" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} className="rounded" />
                          Featured on Homepage
                        </label>
                      </div>
                      <div className="flex gap-3 pt-2">
                        <button onClick={saveProduct} className="flex-1 gold-gradient text-white py-3 rounded-xl font-semibold text-sm hover:opacity-90">
                          {editing ? 'Update Product' : 'Add Product'}
                        </button>
                        <button onClick={() => setShowForm(false)} className="px-6 border border-beige rounded-xl text-warm-gray text-sm hover:bg-beige transition-colors">
                          Cancel
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Reviews Tab */}
        {tab === 'reviews' && (
          <div>
            <h1 className="font-serif text-3xl text-charcoal mb-8">Reviews</h1>
            <div className="bg-white rounded-2xl p-6 mb-6 card-shadow">
              <h2 className="font-semibold text-charcoal mb-4">Add New Review</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <input placeholder="Customer Name" value={reviewForm.name} onChange={e => setReviewForm({ ...reviewForm, name: e.target.value })}
                  className="border border-beige rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold" />
                <input placeholder="City" value={reviewForm.city} onChange={e => setReviewForm({ ...reviewForm, city: e.target.value })}
                  className="border border-beige rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold" />
              </div>
              <select value={reviewForm.rating} onChange={e => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
                className="border border-beige rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold mb-4 w-full">
                {[5,4,3,2,1].map(r => <option key={r} value={r}>{r} Stars</option>)}
              </select>
              <textarea rows={3} placeholder="Customer review text..." value={reviewForm.text} onChange={e => setReviewForm({ ...reviewForm, text: e.target.value })}
                className="w-full border border-beige rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold resize-none mb-4" />
              <button onClick={saveReview} className="gold-gradient text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:opacity-90">
                Add Review
              </button>
            </div>
            <div className="space-y-3">
              {reviews.map(r => (
                <div key={r.id} className="bg-white rounded-xl p-4 card-shadow flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-charcoal text-sm">{r.name} — {r.city}</p>
                    <p className="text-warm-gray text-xs mt-1">{r.text}</p>
                    <p className="text-gold text-xs mt-1">{'★'.repeat(r.rating)}</p>
                  </div>
                  <button onClick={() => deleteReview(r.id)} className="p-2 hover:bg-red-50 rounded-lg"><FiTrash2 size={14} className="text-red-400" /></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Leads Tab */}
        {tab === 'leads' && (
          <div>
            <h1 className="font-serif text-3xl text-charcoal mb-8">Customer Leads</h1>
            <div className="bg-white rounded-2xl card-shadow overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-beige/50">
                  <tr>
                    {['Name', 'Phone', 'Message', 'Source', 'Date'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-charcoal tracking-wider uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-beige">
                  {leads.map(l => (
                    <tr key={l.id} className="hover:bg-beige/20 transition-colors">
                      <td className="px-4 py-3 font-medium text-charcoal">{l.name}</td>
                      <td className="px-4 py-3">
                        <a href={`tel:${l.phone}`} className="text-gold hover:underline">{l.phone}</a>
                      </td>
                      <td className="px-4 py-3 text-warm-gray max-w-xs truncate">{l.message || '—'}</td>
                      <td className="px-4 py-3">
                        <span className="bg-beige text-warm-gray text-xs px-2 py-1 rounded-full">{l.source}</span>
                      </td>
                      <td className="px-4 py-3 text-warm-gray text-xs">
                        {l.createdAt?.toDate ? l.createdAt.toDate().toLocaleDateString('en-IN') : '—'}
                      </td>
                    </tr>
                  ))}
                  {leads.length === 0 && (
                    <tr><td colSpan={5} className="text-center py-12 text-warm-gray">No leads yet</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {tab === 'settings' && (
          <div>
            <h1 className="font-serif text-3xl text-charcoal mb-8">Settings</h1>
            <div className="bg-white rounded-2xl p-6 card-shadow max-w-lg">
              <h2 className="font-semibold text-charcoal mb-4">Offer Popup Settings</h2>
              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={offerSettings.enabled} onChange={e => setOfferSettings({ ...offerSettings, enabled: e.target.checked })} />
                  <span className="text-sm text-charcoal">Enable Offer Popup</span>
                </label>
                <input placeholder="Offer Title" value={offerSettings.title} onChange={e => setOfferSettings({ ...offerSettings, title: e.target.value })}
                  className="w-full border border-beige rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold" />
                <input placeholder="Subtitle" value={offerSettings.subtitle} onChange={e => setOfferSettings({ ...offerSettings, subtitle: e.target.value })}
                  className="w-full border border-beige rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold" />
                <textarea rows={3} placeholder="Description" value={offerSettings.description} onChange={e => setOfferSettings({ ...offerSettings, description: e.target.value })}
                  className="w-full border border-beige rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold resize-none" />
                <input placeholder="CTA Button Text" value={offerSettings.cta} onChange={e => setOfferSettings({ ...offerSettings, cta: e.target.value })}
                  className="w-full border border-beige rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold" />
                <button onClick={saveOffer} className="gold-gradient text-white px-6 py-3 rounded-xl text-sm font-semibold hover:opacity-90">
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
