import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from '../components/Icon'
import BottomNav from '../components/BottomNav'
import logo from '../assets/logo_transparent.png'
import API from '../api'

const CATEGORIES = [
  { emoji: '🍛', label: 'Biryani' },
  { emoji: '🍔', label: 'Fast Food' },
  { emoji: '🥘', label: 'Desi' },
  { emoji: '🥢', label: 'Chinese' },
  { emoji: '🥗', label: 'Healthy' },
  { emoji: '🍰', label: 'Desserts' },
  { emoji: '🍕', label: 'Pizza' },
  { emoji: '🌮', label: 'Wraps' },
]

/* ── Category Chip ───────────────────────────────────────────── */
function CategoryChip({ emoji, label }) {
  const navigate = useNavigate()
  return (
    <button 
      onClick={() => navigate(`/search?q=${encodeURIComponent(label)}`)}
      className="flex-shrink-0 flex flex-col items-center gap-2 group cursor-pointer"
    >
      <div className="w-16 h-16 rounded-2xl bg-[#f7ddd5] flex items-center justify-center group-hover:bg-[#ab3500]/10 transition-colors">
        <span className="text-2xl">{emoji}</span>
      </div>
      <span className="text-xs font-semibold text-[#261814]">{label}</span>
    </button>
  )
}

/* ── Restaurant Card ─────────────────────────────────────────── */
function RestaurantCard({ restaurant, onClick }) {
  const { name, tags, rating, time, delivery, badge, img } = restaurant
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#e1bfb5]/30 cursor-pointer hover:shadow-md transition-shadow"
    >
      <div className="relative h-48">
        <img src={img || 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&q=80'} alt={name} className="w-full h-full object-cover" />
        <button className="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center" onClick={e => e.stopPropagation()}>
          <Icon name="favorite" size={16} className="text-[#594139]" />
        </button>
        {badge && (
          <div className="absolute bottom-3 left-3 bg-[#b7102a] text-white text-[10px] font-bold px-2 py-1 rounded-md">{badge}</div>
        )}
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-bold text-[#261814] text-lg">{name}</h4>
            <p className="text-[#594139] text-xs mt-1">{tags || 'Pakistani • Fast Food'}</p>
          </div>
          <div className="bg-[#c98f00]/10 px-2 py-1 rounded-lg flex items-center gap-1">
            <Icon name="star" filled size={14} className="text-[#c98f00]" />
            <span className="text-xs font-bold text-[#c98f00]">{rating || 5.0}</span>
          </div>
        </div>
        <div className="flex items-center gap-4 mt-4 border-t border-[#e1bfb5]/20 pt-4">
          <div className="flex items-center gap-1 text-[#594139]">
            <Icon name="schedule" size={16} />
            <span className="text-[10px] font-semibold">{time || '20-30 min'}</span>
          </div>
          <div className="flex items-center gap-1 text-[#594139]">
            <Icon name="moped" size={16} />
            <span className="text-[10px] font-semibold">{delivery || 'Rs. 50'}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── HomePage ────────────────────────────────────────────────── */
export default function HomePage() {
  const navigate = useNavigate()
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [restaurants, setRestaurants] = useState([])
  const [foods, setFoods] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [vRes, fRes] = await Promise.all([
          API.get('/api/vendors').catch(() => ({ data: [] })),
          API.get('/api/foods').catch(() => ({ data: [] }))
        ])
        
        const mappedVendors = (vRes.data || []).map(v => ({
          id: v.id,
          name: v.name,
          tags: `${v.category || 'Restaurant'} • ${v.city || 'Vehari'}`,
          rating: v.rating || 5.0,
          time: '20-30 min',
          delivery: 'Rs. 50',
          badge: v.is_approved ? 'OPEN NOW' : 'PENDING APPROVAL',
          img: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&q=80'
        }))

        setRestaurants(mappedVendors)
        setFoods(fRes.data || [])
      } catch (err) {
        setError(err.message)
        setRestaurants([])
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const unreadCount = notifications.filter(n => !n.read).length

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const handleClearNotifications = () => {
    setNotifications([])
  }

  const [searchQuery, setSearchQuery] = useState('')

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <div className="pb-28 min-h-screen bg-[#fff8f6]">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#fff8f6]/80 backdrop-blur-md px-4 py-3 border-b border-[#e1bfb5]/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white rounded-xl p-1 shadow-sm flex items-center justify-center border border-[#e1bfb5]/20">
            <img src={logo} alt="Food Genie" className="w-full h-full object-contain" />
          </div>
          <span className="font-extrabold text-[#ab3500] text-lg tracking-tight">Food Genie</span>
        </div>
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(prev => !prev)}
            className="w-10 h-10 rounded-full bg-white border border-[#e1bfb5]/30 shadow-sm flex items-center justify-center text-[#594139] hover:bg-[#fff1ed] transition-colors relative cursor-pointer"
          >
            <Icon name="notifications" size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#b7102a] rounded-full border-2 border-white" />
            )}
          </button>

          {/* Notifications Modal Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-[#e1bfb5]/30 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="p-3 bg-[#fff1ed] border-b border-[#e1bfb5]/20 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Icon name="notifications" size={16} className="text-[#ab3500]" />
                  <span className="font-bold text-xs text-[#261814]">Notifications</span>
                </div>
                {notifications.length > 0 && (
                  <button onClick={handleMarkAllRead} className="text-[10px] font-bold text-[#ab3500] hover:underline cursor-pointer">
                    Mark all as read
                  </button>
                )}
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-[#e1bfb5]/10">
                {notifications.length > 0 ? (
                  notifications.map(n => (
                    <div key={n.id} className={`p-3 transition-colors ${n.read ? 'bg-white' : 'bg-[#fff8f6]'}`}>
                      <div className="flex items-start gap-2.5">
                        <div className="p-1.5 bg-[#fff1ed] rounded-lg text-[#ab3500] mt-0.5">
                          <Icon name={n.icon || 'info'} size={14} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-[#261814]">{n.title}</p>
                          <p className="text-[11px] text-[#594139] mt-0.5 leading-snug">{n.message}</p>
                          <span className="text-[9px] text-[#8d7168] mt-1 block">{n.time}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-[#8d7168]">
                    <Icon name="notifications_off" size={28} className="mx-auto mb-1 opacity-40" />
                    <p className="text-xs font-semibold">No notifications</p>
                  </div>
                )}
              </div>
              {notifications.length > 0 && (
                <div className="p-2 bg-gray-50 border-t border-gray-100 text-center">
                  <button onClick={handleClearNotifications} className="text-[10px] font-semibold text-gray-500 hover:text-red-600">
                    Clear all
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 mt-4 space-y-6">
        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search food, restaurants, or cuisines in Vehari..."
            className="w-full bg-white border border-[#e1bfb5]/40 rounded-2xl py-3.5 pl-11 pr-4 text-sm text-[#261814] placeholder-[#8d7168] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ab3500]/20 focus:border-[#ab3500] transition-all"
          />
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8d7168]">
            <Icon name="search" size={20} />
          </div>
        </form>

        {/* Categories */}
        <section className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-extrabold text-[#261814] text-base">Categories</h3>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map((cat, i) => (
              <CategoryChip key={i} emoji={cat.emoji} label={cat.label} />
            ))}
          </div>
        </section>

        {/* Restaurants */}
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-extrabold text-[#261814] text-base">Approved Restaurants</h3>
            <span className="text-xs text-[#8d7168] font-medium">{restaurants.length} available</span>
          </div>

          {loading ? (
            <div className="py-12 text-center text-[#8d7168]">
              <div className="w-8 h-8 border-2 border-[#ab3500] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-xs">Loading local vendors in Vehari...</p>
            </div>
          ) : restaurants.length > 0 ? (
            <div className="space-y-4">
              {restaurants.map(r => (
                <RestaurantCard
                  key={r.id}
                  restaurant={r}
                  onClick={() => navigate(`/restaurant/${r.id}`)}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white p-8 rounded-3xl border border-[#e1bfb5]/30 text-center space-y-3 shadow-sm">
              <div className="w-16 h-16 bg-[#fff1ed] rounded-2xl flex items-center justify-center mx-auto text-[#ab3500]">
                <Icon name="storefront" size={32} />
              </div>
              <h4 className="font-bold text-[#261814] text-base">No Approved Restaurants Yet</h4>
              <p className="text-xs text-[#594139] max-w-xs mx-auto leading-relaxed">
                When new restaurants in Vehari register and receive admin approval, they will appear right here!
              </p>
            </div>
          )}
        </section>
      </main>

      <BottomNav />
    </div>
  )
}
