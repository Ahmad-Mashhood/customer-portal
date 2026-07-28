import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from '../components/Icon'
import BottomNav from '../components/BottomNav'
import API from '../api'

const CATEGORIES = [
  { label: 'Biryani', emoji: '🍱' },
  { label: 'Fast Food', emoji: '🍔' },
  { label: 'Pizza', emoji: '🍕' },
  { label: 'Karahi', emoji: '🍲' },
  { label: 'Desserts', emoji: '🍰' },
  { label: 'Drinks', emoji: '🥤' }
]

export default function HomePage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [restaurants, setRestaurants] = useState([])
  const [loading, setLoading] = useState(true)
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Welcome to Food Genie!', message: 'Explore top approved restaurants in Vehari.', time: 'Just now', icon: 'celebration', read: false }
  ])
  const [showNotifications, setShowNotifications] = useState(false)
  const [userData, setUserData] = useState({ name: 'Guest User', city: 'Vehari' })

  useEffect(() => {
    const fetchVendors = async () => {
      setLoading(true)
      try {
        const res = await API.get('/api/vendors')
        setRestaurants(res.data || [])
      } catch (err) {
        setRestaurants([])
      } finally {
        setLoading(false)
      }
    }
    fetchVendors()

    // Sync profile data
    const localUser = JSON.parse(localStorage.getItem('user') || '{}')
    if (localUser.name || localUser.email) {
      setUserData({
        name: localUser.name || localUser.email.split('@')[0],
        city: localUser.city || 'Vehari'
      })
    }

    API.get('/api/auth/me')
      .then(res => {
        if (res.data) {
          setUserData({
            name: res.data.name || res.data.email.split('@')[0],
            city: res.data.city || 'Vehari'
          })
          localStorage.setItem('user', JSON.stringify(res.data))
        }
      })
      .catch(() => {})
  }, [])

  const unreadCount = notifications.filter(n => !n.read).length

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const handleClearNotifications = () => {
    setNotifications([])
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <div className="pb-28 min-h-screen bg-[#fff8f6]">
      {/* Top Bar Header */}
      <header className="sticky top-0 z-40 bg-[#fff8f6]/90 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-[#e1bfb5]/20">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-[#fff1ed] text-[#ab3500] flex items-center justify-center font-bold shadow-sm">
            <Icon name="restaurant" size={22} />
          </div>
          <div>
            <h1 className="font-extrabold text-[#261814] text-lg leading-tight tracking-tight">Food Genie</h1>
            <p className="text-[11px] font-semibold text-[#8d7168] flex items-center gap-1">
              <Icon name="location_on" size={12} className="text-[#ab3500]" />
              {userData.city || 'Vehari'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 relative">
          <button 
            onClick={() => setShowNotifications(prev => !prev)}
            className="w-10 h-10 rounded-full bg-white border border-[#e1bfb5]/30 shadow-sm flex items-center justify-center text-[#594139] hover:bg-[#fff1ed] transition-colors relative cursor-pointer"
          >
            <Icon name="notifications" size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#b7102a] rounded-full border-2 border-white" />
            )}
          </button>

          {/* Notifications Dropdown */}
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
              <button
                key={i}
                onClick={() => navigate(`/search?q=${encodeURIComponent(cat.label)}`)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-[#e1bfb5]/30 rounded-2xl shadow-sm text-xs font-bold text-[#261814] hover:bg-[#fff1ed] hover:border-[#ab3500] transition-all shrink-0 cursor-pointer"
              >
                <span>{cat.emoji}</span>
                <span>{cat.label}</span>
              </button>
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
                <div
                  key={r.id}
                  onClick={() => navigate(`/restaurant/${r.id}`)}
                  className="bg-white p-4 rounded-2xl border border-[#e1bfb5]/30 shadow-sm flex items-center justify-between gap-4 cursor-pointer hover:shadow-md transition-shadow"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-[#261814] text-base truncate">{r.name}</h4>
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">Approved</span>
                    </div>
                    <p className="text-xs text-[#594139] mt-0.5">{r.category || 'Restaurant'} • {r.city || 'Vehari'}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs font-bold text-[#8d7168]">
                      <span className="text-[#ab3500] flex items-center gap-0.5">★ {r.rating || '5.0'}</span>
                      <span>20-30 min</span>
                      <span>Rs. 50 delivery</span>
                    </div>
                  </div>
                  <div className="w-16 h-16 rounded-2xl bg-[#fff1ed] text-[#ab3500] flex items-center justify-center font-bold text-2xl shrink-0">
                    🏪
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-8 rounded-3xl border border-[#e1bfb5]/30 text-center space-y-3 shadow-sm w-full flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-[#fff1ed] rounded-2xl flex items-center justify-center text-[#ab3500]">
                <Icon name="storefront" size={32} />
              </div>
              <h4 className="font-bold text-[#261814] text-base">No Approved Restaurants Yet</h4>
              <p className="text-xs text-[#594139] w-full max-w-md text-center leading-normal whitespace-normal break-words">
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
