import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from '../components/Icon'
import BottomNav from '../components/BottomNav'
import logo from '../assets/logo_transparent.png'

const MOCK_NOTIFICATIONS = [
  { id: 'n1', title: 'Order Dispatched 🏍️', message: 'Rider Alex is on his way with your Biryani!', time: '5 mins ago', read: false, icon: 'moped' },
  { id: 'n2', title: 'Rainy Day Special 🌧️', message: "It's raining! Enjoy a hot chicken soup with free delivery.", time: '2 hrs ago', read: false, icon: 'auto_awesome' },
  { id: 'n3', title: 'Mega Deal 🎁', message: 'Get 50% off on your next pizza order from Pizza Max.', time: '1 day ago', read: true, icon: 'local_offer' }
]

/* ── Data ────────────────────────────────────────────────────── */
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

const DEALS = [
  {
    id: 'd1', label: "50% OFF", name: "Domino's Pizza", sub: "Select items only",
    img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80',
  },
  {
    id: 'd2', label: "Buy 1 Get 1", name: "Burger Lab", sub: "On all deals",
    img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80',
  },
  {
    id: 'd3', label: "FREE DELIVERY", name: "Student Biryani", sub: "Today only",
    img: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&q=80',
  },
]

const RESTAURANTS = [
  {
    id: 'r1',
    name: 'Student Biryani',
    tags: 'Biryani • Desi • Pakistani',
    rating: 4.5,
    time: '25-30 min',
    delivery: 'Rs. 50',
    badge: 'FREE DELIVERY',
    img: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&q=80',
  },
  {
    id: 'r2',
    name: 'Pizza Max',
    tags: 'Italian • Fast Food • Pizza',
    rating: 4.2,
    time: '40-45 min',
    delivery: 'Free Delivery',
    badge: null,
    img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80',
  },
  {
    id: 'r3',
    name: 'Burger Lab',
    tags: 'American • Burgers • Fast Food',
    rating: 4.7,
    time: '20-25 min',
    delivery: 'Rs. 30',
    badge: '20% OFF',
    img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80',
  },
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

/* ── Deal Card ───────────────────────────────────────────────── */
function DealCard({ label, name, sub, img }) {
  return (
    <div className="flex-shrink-0 w-72 h-40 rounded-2xl relative overflow-hidden shadow-md">
      <img src={img} alt={name} className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      <div className="absolute top-3 left-3 bg-[#b7102a] text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase">{label}</div>
      <div className="absolute bottom-3 left-3">
        <p className="text-white font-bold text-sm">{name}</p>
        <p className="text-white/80 text-[10px]">{sub}</p>
      </div>
    </div>
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
        <img src={img} alt={name} className="w-full h-full object-cover" />
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
            <p className="text-[#594139] text-xs mt-1">{tags}</p>
          </div>
          <div className="bg-[#c98f00]/10 px-2 py-1 rounded-lg flex items-center gap-1">
            <Icon name="star" filled size={14} className="text-[#c98f00]" />
            <span className="text-xs font-bold text-[#c98f00]">{rating}</span>
          </div>
        </div>
        <div className="flex items-center gap-4 mt-4 border-t border-[#e1bfb5]/20 pt-4">
          <div className="flex items-center gap-1 text-[#594139]">
            <Icon name="schedule" size={16} />
            <span className="text-[10px] font-semibold">{time}</span>
          </div>
          <div className="flex items-center gap-1 text-[#594139]">
            <Icon name="moped" size={16} />
            <span className="text-[10px] font-semibold">{delivery}</span>
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
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS)

  const unreadCount = notifications.filter(n => !n.read).length

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const handleClearNotifications = () => {
    setNotifications([])
  }

  const [searchQuery, setSearchQuery] = useState('')

  const showAiBanner = localStorage.getItem('ai_recommendations') !== 'false'

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    } else {
      navigate('/search')
    }
  }

  return (
    <div className="pb-24 min-h-screen bg-[#fff8f6]">
      {/* Top Bar */}
      <header className="sticky top-0 z-50 bg-[#fff8f6]/80 backdrop-blur-md px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon name="location_on" className="text-[#ab3500]" />
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-[#594139] uppercase tracking-wider">Deliver to</span>
            <div className="flex items-center gap-1">
              <span className="text-sm font-bold text-[#261814]">Home, Karachi</span>
              <Icon name="expand_more" size={16} />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowNotifications(true)}
            className="relative p-2 rounded-full hover:bg-[#ffe9e3] cursor-pointer active:scale-95 transition-transform"
          >
            <Icon name="notifications" className="text-[#261814]" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-[#b7102a] rounded-full border-2 border-[#fff8f6]" />
            )}
          </button>
          <div 
            onClick={() => navigate('/profile')}
            className="w-10 h-10 rounded-full border-2 border-[#ab3500] overflow-hidden bg-[#ffdbd0] flex items-center justify-center cursor-pointer active:scale-95 transition-transform"
          >
            <Icon name="person" filled className="text-[#ab3500]" />
          </div>
        </div>
      </header>

      {/* Logo + Search */}
      <div className="px-4 mt-2">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-white rounded-xl p-1.5 shadow-sm flex items-center justify-center border border-[#e1bfb5]/20">
            <img src={logo} alt="Food Genie" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-xl font-extrabold text-[#ab3500] tracking-tight">Food Genie</h1>
        </div>
        <form onSubmit={handleSearchSubmit} className="relative">
          <Icon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-[#594139]" />
          <input
            className="w-full h-14 pl-12 pr-4 bg-[#fff1ed] border-none rounded-xl text-sm focus:ring-2 focus:ring-[#ab3500] placeholder:text-[#594139]/60 outline-none"
            placeholder="Search 'healthy dinner under Rs. 1000'"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => { if (!searchQuery) navigate('/search') }}
          />
        </form>
      </div>

      {/* AI Banner */}
      {showAiBanner && (
        <div className="px-4 mt-6">
          <div className="bg-[#ff6b35] rounded-2xl p-5 relative overflow-hidden shadow-lg">
            <div className="relative z-10">
              <div className="inline-flex items-center gap-1 bg-[#ffdea9] text-[#271900] px-2 py-1 rounded-md text-[10px] font-bold uppercase mb-2">
                <Icon name="auto_awesome" size={14} />
                Recommended for you
              </div>
              <h2 className="text-white text-lg font-bold leading-tight">
                It's raining — try a hot soup 🍲 or some crispy Pakoras!
              </h2>
              <button className="mt-4 bg-white text-[#ab3500] px-4 py-2 rounded-lg text-sm font-bold shadow-sm">
                Show Me
              </button>
            </div>
            <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-white/10 text-8xl rotate-12">temp_preserve</span>
          </div>
        </div>
      )}

      {/* Category Chips */}
      <div className="mt-8">
        <div className="flex overflow-x-auto hide-scrollbar gap-3 px-4">
          {CATEGORIES.map(c => <CategoryChip key={c.label} {...c} />)}
        </div>
      </div>

      {/* Hot Deals */}
      <div className="mt-8 px-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-[#261814]">Today's Hot Deals</h3>
          <button className="text-[#ab3500] text-sm font-bold">See all</button>
        </div>
        <div className="flex overflow-x-auto gap-4 hide-scrollbar pb-2">
          {DEALS.map(d => <DealCard key={d.id} {...d} />)}
        </div>
      </div>

      {/* Restaurants */}
      <div className="mt-8 px-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-[#261814]">Popular Restaurants</h3>
          <button className="flex items-center gap-1 bg-[#fff1ed] px-3 py-1.5 rounded-full text-xs font-bold border border-[#e1bfb5]">
            <Icon name="tune" size={16} /> Filter
          </button>
        </div>
        <div className="flex flex-col gap-6">
          {RESTAURANTS.map(r => (
            <RestaurantCard
              key={r.id}
              restaurant={r}
              onClick={() => navigate(`/restaurant/${r.id}`)}
            />
          ))}
        </div>
      </div>

      <BottomNav />

      {/* Notifications Drawer */}
      {showNotifications && (
        <div className="fixed inset-0 z-[1000] flex justify-end">
          {/* Backdrop */}
          <div 
            onClick={() => setShowNotifications(false)}
            className="absolute inset-0 bg-black/45 backdrop-blur-xs transition-opacity duration-300"
          />

          {/* Drawer Panel */}
          <div className="relative w-full max-w-[384px] h-full bg-[#fff8f6] shadow-2xl flex flex-col z-10 animate-slide-in">
            {/* Drawer Header */}
            <div className="p-4 border-b border-[#e1bfb5]/30 flex justify-between items-center bg-white">
              <div className="flex items-center gap-2">
                <Icon name="notifications" className="text-[#ab3500]" />
                <h3 className="font-bold text-[#261814] text-lg">Notifications</h3>
              </div>
              <button 
                onClick={() => setShowNotifications(false)}
                className="p-1 hover:bg-[#fff1ed] rounded-full text-[#594139] cursor-pointer"
              >
                <Icon name="close" />
              </button>
            </div>

            {/* Actions Bar */}
            {notifications.length > 0 && (
              <div className="px-4 py-2 bg-[#fff1ed]/50 flex justify-between items-center text-xs font-semibold text-[#ab3500] border-b border-[#e1bfb5]/10">
                <button onClick={handleMarkAllRead} className="hover:underline cursor-pointer">Mark all as read</button>
                <button onClick={handleClearNotifications} className="text-[#8d7168] hover:text-[#b7102a] hover:underline cursor-pointer">Clear all</button>
              </div>
            )}

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {notifications.length > 0 ? (
                notifications.map(n => (
                  <div 
                    key={n.id}
                    className={`p-4 rounded-2xl border transition-all flex gap-3 shadow-sm ${
                      n.read ? 'bg-white border-[#e1bfb5]/20 opacity-80' : 'bg-[#fff1ed] border-[#ffdbd0] border-l-4 border-l-[#ab3500]'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#ab3500] border border-[#ffdbd0] flex-shrink-0">
                      <Icon name={n.icon} size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-1">
                        <h4 className="font-bold text-sm text-[#261814] leading-tight truncate">{n.title}</h4>
                        <span className="text-[10px] text-[#8d7168] font-semibold flex-shrink-0 whitespace-nowrap">{n.time}</span>
                      </div>
                      <p className="text-xs text-[#594139] mt-1 leading-relaxed">{n.message}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-20 text-center space-y-3">
                  <div className="w-16 h-16 bg-[#fff1ed] rounded-full flex items-center justify-center mx-auto text-[#8d7168]/40">
                    <Icon name="notifications_off" size={32} />
                  </div>
                  <p className="font-bold text-[#261814]">All caught up!</p>
                  <p className="text-xs text-[#594139]">No notifications found at the moment.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
