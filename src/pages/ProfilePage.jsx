import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from '../components/Icon'
import BottomNav from '../components/BottomNav'
import { useCart } from '../context/CartContext'

export default function ProfilePage() {
  const navigate = useNavigate()
  const { clearCart } = useCart()

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
    { id: 'addr1', label: 'Home', text: 'Plot 42, Sector F-7/2, Street 15, Islamabad', icon: 'home' },
    { id: 'addr2', label: 'Work', text: 'Arfa Software Technology Park, Ferozepur Rd, Lahore', icon: 'business' },
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

  const [name, setName] = useState('Ahmad Mshhood')
  const [phone, setPhone] = useState('+92 300 1234567')

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
    setIsEditingProfile(false)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    clearCart()
    navigate('/login')
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
                  <p className="text-[13px] text-[#594139] px-2.5 py-1 select-none opacity-60">
                    ahmadmashhood.bcs018@gmail.com
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
                  <p className="text-[13px] text-[#594139] mt-0.5 truncate">ahmadmashhood.bcs018@gmail.com</p>
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
          <div className="bg-white rounded-2xl border border-[#e1bfb5]/30 shadow-sm overflow-hidden divide-y divide-[#e1bfb5]/20">
            {addresses.map(addr => {
              const isEditing = editingId === addr.id
              return (
                <div key={addr.id} className="p-4 flex justify-between items-center gap-4">
                  <div className="flex gap-3 items-center min-w-0 flex-1">
                    <div className="w-10 h-10 rounded-full bg-[#fff1ed] flex items-center justify-center text-[#ab3500] flex-shrink-0">
                      <Icon name={addr.icon} size={20} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-sm text-[#261814]">{addr.label}</p>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="w-full mt-1 bg-[#fff1ed] border border-[#e1bfb5]/60 rounded-lg px-2.5 py-1 text-xs text-[#261814] focus:ring-1 focus:ring-[#ab3500] outline-none"
                          autoFocus
                        />
                      ) : (
                        <p className="text-xs text-[#594139] mt-0.5 truncate" title={addr.text}>{addr.text}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {isEditing ? (
                      <>
                        <button 
                          onClick={() => handleSaveAddress(addr.id)} 
                          className="text-[#2e7d32] hover:bg-green-50 p-1.5 rounded-full cursor-pointer transition-colors"
                          title="Save"
                        >
                          <Icon name="check" size={16} />
                        </button>
                        <button 
                          onClick={handleCancelEdit} 
                          className="text-[#b7102a] hover:bg-red-50 p-1.5 rounded-full cursor-pointer transition-colors"
                          title="Cancel"
                        >
                          <Icon name="close" size={16} />
                        </button>
                      </>
                    ) : (
                      <button 
                        onClick={() => handleStartEdit(addr)}
                        className="text-[#8d7168] hover:text-[#ab3500] hover:bg-[#fff1ed] p-1.5 rounded-full cursor-pointer transition-colors"
                        title="Edit Address"
                      >
                        <Icon name="edit" size={16} />
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Preferences / Settings */}
        <section className="space-y-3">
          <h3 className="text-sm font-bold text-[#594139] uppercase tracking-wider pl-1">App Settings</h3>
          <div className="bg-white rounded-2xl border border-[#e1bfb5]/30 shadow-sm overflow-hidden divide-y divide-[#e1bfb5]/20">
            {/* AI Recs Switch */}
            <div className="p-4 flex justify-between items-center">
              <div className="flex gap-3 items-center">
                <div className="w-10 h-10 rounded-full bg-[#ffdea9] flex items-center justify-center text-[#7d5800]">
                  <Icon name="auto_awesome" filled size={20} />
                </div>
                <div>
                  <p className="font-bold text-sm text-[#261814]">AI Recommendations</p>
                  <p className="text-[11px] text-[#594139] mt-0.5">Use order history to customize foods</p>
                </div>
              </div>
              <button 
                onClick={handleToggleAiRecs}
                className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 cursor-pointer ${
                  aiRecs ? 'bg-[#ab3500]' : 'bg-[#eed5cd]'
                }`}
              >
                <div 
                  className={`bg-white w-4 h-4 rounded-full transition-transform duration-300 ${
                    aiRecs ? 'translate-x-6' : 'translate-x-0'
                  }`} 
                />
              </button>
            </div>

            {/* Notification Switch */}
            <div className="p-4 flex justify-between items-center">
              <div className="flex gap-3 items-center">
                <div className="w-10 h-10 rounded-full bg-[#fde3db] flex items-center justify-center text-[#ab3500]">
                  <Icon name="notifications" size={20} />
                </div>
                <div>
                  <p className="font-bold text-sm text-[#261814]">Push Notifications</p>
                  <p className="text-[11px] text-[#594139] mt-0.5">Order updates & hot deals alerts</p>
                </div>
              </div>
              <button 
                onClick={() => setPushNotif(!pushNotif)}
                className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 cursor-pointer ${
                  pushNotif ? 'bg-[#ab3500]' : 'bg-[#eed5cd]'
                }`}
              >
                <div 
                  className={`bg-white w-4 h-4 rounded-full transition-transform duration-300 ${
                    pushNotif ? 'translate-x-6' : 'translate-x-0'
                  }`} 
                />
              </button>
            </div>
          </div>
        </section>

        {/* Legal & Help */}
        <section className="space-y-3">
          <h3 className="text-sm font-bold text-[#594139] uppercase tracking-wider pl-1">Information</h3>
          <div className="bg-white rounded-2xl border border-[#e1bfb5]/30 shadow-sm overflow-hidden divide-y divide-[#e1bfb5]/20">
            {[
              { label: 'Privacy Policy', route: '/privacy', icon: 'security' },
              { label: 'Terms of Service', route: '/terms', icon: 'gavel' },
            ].map(item => (
              <div 
                key={item.label} 
                onClick={() => navigate(item.route)}
                className="p-4 flex justify-between items-center hover:bg-[#fff1ed]/40 cursor-pointer transition-colors"
              >
                <div className="flex gap-3 items-center">
                  <div className="w-10 h-10 rounded-full bg-[#fff1ed] flex items-center justify-center text-[#594139]">
                    <Icon name={item.icon} size={20} />
                  </div>
                  <span className="font-semibold text-sm text-[#261814]">{item.label}</span>
                </div>
                <Icon name="chevron_right" size={20} className="text-[#8d7168]" />
              </div>
            ))}
          </div>
        </section>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full bg-[#b7102a] text-white py-4 rounded-full text-base font-bold shadow-md hover:bg-[#db313f] transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
        >
          <Icon name="logout" size={20} />
          Log Out
        </button>
      </main>

      <BottomNav />
    </div>
  )
}
