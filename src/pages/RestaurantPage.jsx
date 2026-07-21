import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from '../components/Icon'
import { useCart } from '../context/CartContext'
import logo from '../assets/logo_transparent.png'

const CATEGORIES = ['All', 'Biryani', 'Sides', 'Beverages', 'Desserts']

const MENU_ITEMS = [
  {
    id: 'mi1', name: "Genie's Special Biryani", price: 450,
    desc: 'Our signature spiced basmati rice with tender chicken.',
    img: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200&q=80',
  },
  {
    id: 'mi2', name: 'Chicken Karahi', price: 850,
    desc: 'Traditional spicy chicken curry with ginger and green chilies.',
    img: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=200&q=80',
  },
  {
    id: 'mi3', name: 'Garlic Naan', price: 60,
    desc: 'Freshly baked clay oven bread topped with garlic and butter.',
    img: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=200&q=80',
  },
  {
    id: 'mi4', name: 'Raita & Salad', price: 80,
    desc: 'Cool yogurt dip with herbs and a fresh seasonal salad mix.',
    img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&q=80',
  },
]

/* ── Menu Item Row ───────────────────────────────────────────── */
function MenuItemRow({ item, onAdd }) {
  return (
    <div className="flex gap-6 py-3 border-b border-[#e1bfb5]/20 last:border-0">
      <div className="flex-1">
        <h3 className="text-[20px] font-semibold text-[#261814]">{item.name}</h3>
        <p className="text-[#ab3500] font-bold mt-1">Rs. {item.price}</p>
        <p className="text-[#594139] text-[14px] mt-1 line-clamp-2">{item.desc}</p>
      </div>
      <div className="relative w-24 h-24 flex-shrink-0">
        <img src={item.img} alt={item.name} className="w-full h-full object-cover rounded-xl" />
        <button
          onClick={() => onAdd(item)}
          className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#ab3500] text-white rounded-xl shadow-lg flex items-center justify-center active:scale-95 transition-transform"
        >
          <Icon name="add" />
        </button>
      </div>
    </div>
  )
}

/* ── RestaurantPage ──────────────────────────────────────────── */
export default function RestaurantPage() {
  const navigate       = useNavigate()
  const { addItem, cartCount, cartTotal } = useCart()
  const [activeTab, setActiveTab] = useState('All')

  return (
    <div className="pb-32 min-h-screen bg-[#fff8f6]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-2 bg-[#fff8f6]/80 backdrop-blur-md border-b border-[#e1bfb5]">
        <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#fde3db] transition-colors">
          <Icon name="arrow_back" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-white rounded-lg p-0.5 shadow-sm flex items-center justify-center border border-[#e1bfb5]/20">
            <img src={logo} alt="Food Genie" className="w-full h-full object-contain" />
          </div>
          <span className="font-semibold text-[#ab3500]">Food Genie</span>
        </div>
        <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#fde3db] transition-colors">
          <Icon name="share" />
        </button>
      </header>

      <main className="pt-14">
        {/* Hero Image */}
        <div className="relative w-full h-64 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&q=80"
            alt="Student Biryani"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>

        {/* Info Card */}
        <div className="px-4 -mt-8 relative z-10">
          <div className="bg-[#fff8f6] p-6 rounded-xl shadow-lg border border-[#e1bfb5]">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h1 className="text-[32px] font-bold text-[#261814]">Student Biryani</h1>
                <p className="text-[#594139] text-[14px]">Biryani • Desi • Pakistani</p>
              </div>
              <div className="bg-[#ff6b35] text-[#5f1900] px-2 py-1 rounded flex items-center gap-1">
                <Icon name="star" filled size={14} />
                <span className="text-[14px] font-semibold">4.5</span>
              </div>
            </div>
            <div className="flex items-center gap-12 border-t border-[#e1bfb5] pt-3">
              <div className="flex items-center gap-1 text-[#594139]">
                <Icon name="schedule" className="text-[#ab3500]" size={20} />
                <span className="text-[14px]">25-30 min</span>
              </div>
              <div className="flex items-center gap-1 text-[#594139]">
                <Icon name="delivery_dining" className="text-[#ab3500]" size={20} />
                <span className="text-[14px]">Rs. 50 Delivery</span>
              </div>
            </div>
          </div>
        </div>

        {/* Category Chips */}
        <div className="mt-6 px-4">
          <div className="flex overflow-x-auto gap-3 hide-scrollbar pb-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`whitespace-nowrap px-6 py-2 rounded-full text-[14px] font-semibold transition-colors ${
                  activeTab === cat
                    ? 'bg-[#ab3500] text-white'
                    : 'bg-[#fde3db] text-[#594139] hover:bg-[#f7ddd5]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Items */}
        <div className="mt-6 px-4 space-y-6">
          <h2 className="text-[20px] font-semibold text-[#261814] border-b border-[#e1bfb5] pb-2">Popular Items</h2>
          {MENU_ITEMS.map(item => (
            <MenuItemRow key={item.id} item={item} onAdd={addItem} />
          ))}
        </div>
      </main>

      {/* Sticky Cart Bar */}
      {cartCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#fff8f6]/90 backdrop-blur-md border-t border-[#e1bfb5]">
          <button
            onClick={() => navigate('/checkout')}
            className="w-full bg-[#ab3500] hover:bg-[#ab3500]/90 text-white py-6 px-6 rounded-xl shadow-lg flex items-center justify-between transition-colors active:scale-[0.98]"
          >
            <div className="flex items-center gap-3">
              <div className="bg-white/20 w-8 h-8 rounded-lg flex items-center justify-center">
                <span className="text-[14px] font-semibold">{cartCount}</span>
              </div>
              <span className="text-lg font-semibold">View Cart</span>
            </div>
            <span className="text-lg font-semibold">Rs. {cartTotal}</span>
          </button>
        </div>
      )}
    </div>
  )
}
