import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from '../components/Icon'
import BottomNav from '../components/BottomNav'
import { useCart } from '../context/CartContext'
import { auth } from '../firebase'
import { signOut } from 'firebase/auth'
import API from '../api'

export default function ProfilePage() {
  const navigate = useNavigate()
  const { clearCart } = useCart()

  const [user, setUser] = useState(() => {
    try {
      const u = localStorage.getItem('user')
      return u ? JSON.parse(u) : null
    } catch (e) {
      return null
    }
  })

  const [name, setName] = useState(() => user?.name || 'Food Genie Customer')
  const [email, setEmail] = useState(() => user?.email || 'customer@foodgenie.com')
  const [phone, setPhone] = useState(() => user?.phone || 'No phone added')

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await API.get('/api/auth/me')
        if (res.data) {
          const fresh = res.data
          setName(fresh.name || 'Food Genie Customer')
          setEmail(fresh.email || 'customer@foodgenie.com')
          setPhone(fresh.phone || 'No phone added')
          setUser(fresh)
          localStorage.setItem('user', JSON.stringify(fresh))
        }
      } catch (err) {
        // Fallback to localStorage user
      }
    }
    fetchMe()
  }, [])

  const [aiRecs, setAiRecs] = useState(() => {
    const saved = localStorage.getItem('ai_recommendations')
    return saved !== 'false'
  })
  const [pushNotif, setPushNotif] = useState(true)

  const handleToggleAiRecs = () => {
    setAiRecs(prev => {
      const val = !prev
      localStorage.setItem('ai_recommendations', String(val))
      return val
    })
  }

  const [addresses, setAddresses] = useState([
    { id: 'addr1', label: 'Home', text: 'Jinnah Shaheed Road, Vehari, Punjab', icon: 'home' },
    { id: 'addr2', label: 'Work', text: 'Club Road, Vehari, Punjab', icon: 'business' },
  ])

  const [editingId, setEditingId] = useState(null)
  const [editText, setEditText] = useState('')

  const handleStartEdit = (addr) => {
    setEditingId(addr.id)
    setEditText(addr.text)
  }

  const handleSaveAddress = (id) => {
    setAddresses(prev => prev.map(a => a.id === id ? { ...a, text: editText } : a))
    setEditingId(null)
    setEditText('')
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditText('')
  }

  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [editName, setEditName] = useState('')
  const [editPhone, setEditPhone] = useState('')

  const handleStartEditProfile = () => {
    setIsEditingProfile(true)
    setEditName(name)
    setEditPhone(phone)
  }

  const handleSaveProfile = () => {
    setName(editName)
    setPhone(editPhone)
    const updatedUser = { ...(user || {}), name: editName, phone: editPhone, email }
    setUser(updatedUser)
    localStorage.setItem('user', JSON.stringify(updatedUser))
    setIsEditingProfile(false)
  }

  const handleLogout = async () => {
    try {
      await signOut(auth)
    } catch (e) {
      // ignore
    }
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    clearCart()
    window.location.href = '/login'
  }

  return (
    <div className="pb-28 min-h-screen bg-[#fff8f6]">
      {/* Top Header */}
      <header className="sticky top-0 z-50 bg-[#fff8f6]/80 backdrop-blur-md px-4 py-4 border-b border-[#e1bfb5]/20">
        <h1 className="text-lg font-bold text-[#261814]">My Profile</h1>
      </header>

      {/* Main Profile Info */}
      <main className="px-4 mt-6 space-y-6">
        {/* User Card */}
        <div className="bg-white p-6 rounded-3xl border border-[#e1bfb5]/30 shadow-sm flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-[#ab3500] bg-[#ffdbd0] flex items-center justify-center text-3xl shadow-inner flex-shrink-0">
              🧑‍💻
            </div>
            <div className="flex-1 min-w-0">
              {isEditingProfile ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full bg-[#fff1ed] border border-[#e1bfb5]/60 rounded-lg px-2.5 py-1 text-sm font-bold text-[#261814] focus:ring-1 focus:ring-[#ab3500] outline-none"
                    placeholder="Name"
                    autoFocus
                  />
                  <p className="text-[13px] text-[#594139] px-2.5 py-1 select-none opacity-60 truncate">
                    {email}
                  </p>
                  <input
                    type="text"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full bg-[#fff1ed] border border-[#e1bfb5]/60 rounded-lg px-2.5 py-1 text-xs text-[#8d7168] font-semibold focus:ring-1 focus:ring-[#ab3500] outline-none"
                    placeholder="Phone Number"
                  />
                </div>
              ) : (
                <>
                  <h2 className="font-extrabold text-[#261814] text-lg truncate">{name}</h2>
                  <p className="text-[13px] text-[#594139] mt-0.5 truncate">{email}</p>
                  <p className="text-[12px] text-[#8d7168] font-semibold mt-1">{phone}</p>
                </>
              )}
            </div>
          </div>
          <div className="flex-shrink-0">
            {isEditingProfile ? (
              <div className="flex flex-col gap-2">
                <button 
                  onClick={handleSaveProfile}
                  className="text-[#2e7d32] hover:bg-green-50 p-2 rounded-full cursor-pointer transition-colors"
                  title="Save Details"
                >
                  <Icon name="check" size={18} />
                </button>
                <button 
                  onClick={() => setIsEditingProfile(false)}
                  className="text-[#b7102a] hover:bg-red-50 p-2 rounded-full cursor-pointer transition-colors"
                  title="Cancel"
                >
                  <Icon name="close" size={18} />
                </button>
              </div>
            ) : (
              <button 
                onClick={handleStartEditProfile}
                className="text-[#8d7168] hover:text-[#ab3500] hover:bg-[#fff1ed] p-2 rounded-full cursor-pointer transition-colors"
                title="Edit Profile"
              >
                <Icon name="edit" size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Saved Addresses */}
        <section className="space-y-3">
          <h3 className="text-sm font-bold text-[#594139] uppercase tracking-wider pl-1">Saved Addresses</h3>
          <div className="space-y-2.5">
            {addresses.map(addr => (
              <div key={addr.id} className="bg-white p-4 rounded-2xl border border-[#e1bfb5]/30 shadow-sm flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="p-2 bg-[#fff1ed] rounded-xl text-[#ab3500] mt-0.5 flex-shrink-0">
                    <Icon name={addr.icon} size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-extrabold text-[#ab3500] uppercase tracking-wider">{addr.label}</span>
                    {editingId === addr.id ? (
                      <div className="mt-1 flex gap-2 items-center">
                        <input
                          type="text"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="flex-1 bg-[#fff1ed] border border-[#e1bfb5]/60 rounded-lg px-2.5 py-1 text-xs text-[#261814] focus:ring-1 focus:ring-[#ab3500] outline-none"
                          autoFocus
                        />
                        <button 
                          onClick={() => handleSaveAddress(addr.id)}
                          className="text-[#2e7d32] hover:bg-green-50 p-1 rounded-md transition-colors"
                        >
                          <Icon name="check" size={16} />
                        </button>
                        <button 
                          onClick={handleCancelEdit}
                          className="text-[#b7102a] hover:bg-red-50 p-1 rounded-md transition-colors"
                        >
                          <Icon name="close" size={16} />
                        </button>
                      </div>
                    ) : (
                      <p className="text-xs text-[#261814] font-medium mt-0.5 leading-relaxed">{addr.text}</p>
                    )}
                  </div>
                </div>
                {editingId !== addr.id && (
                  <button 
                    onClick={() => handleStartEdit(addr)}
                    className="text-[#8d7168] hover:text-[#ab3500] p-1 rounded-lg transition-colors flex-shrink-0"
                    title="Edit Address"
                  >
                    <Icon name="edit" size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Preferences & Settings */}
        <section className="space-y-3">
          <h3 className="text-sm font-bold text-[#594139] uppercase tracking-wider pl-1">Preferences</h3>
          <div className="bg-white rounded-2xl border border-[#e1bfb5]/30 shadow-sm divide-y divide-[#e1bfb5]/20 overflow-hidden">
            {/* AI Recommendation Toggle */}
            <div className="p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#fff1ed] rounded-xl text-[#ab3500]">
                  <Icon name="auto_awesome" size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#261814]">AI Health Recommendations</h4>
                  <p className="text-xs text-[#594139]">Personalized food suggestions based on your diet</p>
                </div>
              </div>
              <button 
                onClick={handleToggleAiRecs}
                className={`w-12 h-6 rounded-full transition-colors relative flex items-center px-0.5 cursor-pointer ${aiRecs ? 'bg-[#ab3500]' : 'bg-[#e1bfb5]/50'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${aiRecs ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>

            {/* Push Notifications Toggle */}
            <div className="p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#fff1ed] rounded-xl text-[#ab3500]">
                  <Icon name="notifications" size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#261814]">Push Notifications</h4>
                  <p className="text-xs text-[#594139]">Order status updates and exclusive genie deals</p>
                </div>
              </div>
              <button 
                onClick={() => setPushNotif(prev => !prev)}
                className={`w-12 h-6 rounded-full transition-colors relative flex items-center px-0.5 cursor-pointer ${pushNotif ? 'bg-[#ab3500]' : 'bg-[#e1bfb5]/50'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${pushNotif ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>
        </section>

        {/* Account Actions */}
        <section className="pt-2">
          <button 
            onClick={handleLogout}
            className="w-full py-4 bg-white border border-[#b7102a]/30 text-[#b7102a] rounded-2xl font-bold text-sm shadow-sm hover:bg-red-50 transition-colors flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <Icon name="logout" size={18} />
            Log Out
          </button>
        </section>
      </main>

      <BottomNav />
    </div>
  )
}
