import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from '../components/Icon'
import { useCart } from '../context/CartContext'

const ADDONS = [
  { id: 'a1', name: 'Smoked Bacon',   price: 89,  img: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=100&q=80' },
  { id: 'a2', name: 'Creamy Avocado', price: 65,  img: 'https://images.unsplash.com/photo-1502741224143-90386d7f8c82?w=100&q=80' },
  { id: 'a3', name: 'Extra Cheese',   price: 49,  img: 'https://images.unsplash.com/photo-1618164436241-4473940d1f5c?w=100&q=80' },
]

const ITEM = {
  id: 'item-burger',
  name: 'Magic Genie Burger',
  price: 549,
  rating: '4.8 (1.2k+ Reviews)',
  time: '20-25 mins',
  desc: 'Our signature masterpiece. A juicy, hand-pressed wagyu blend patty topped with genie-secret spiced cheddar, caramelized onions, and truffle-infused aioli. Served on a pillowy, toasted brioche bun that melts in your mouth.',
  img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80',
  nutrition: [
    { icon: 'bolt',          label: '640 kcal'              },
    { icon: 'fitness_center',label: '32g Protein'           },
    { icon: 'psychology',    label: 'AI Nutrition Verified' },
  ],
}

export default function MenuItemPage() {
  const navigate = useNavigate()
  const { addItem } = useCart()

  const [size,     setSize]     = useState('Standard')
  const [spice,    setSpice]    = useState('Medium')
  const [addons,   setAddons]   = useState([])
  const [quantity, setQuantity] = useState(1)

  const addonTotal  = addons.reduce((s, id) => s + (ADDONS.find(a => a.id === id)?.price ?? 0), 0)
  const sizeExtra   = size === 'Monster' ? 149 : 0
  const total       = (ITEM.price + addonTotal + sizeExtra) * quantity

  const toggleAddon = (id) =>
    setAddons(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])

  const handleAddToCart = () => {
    addItem({ id: ITEM.id, name: ITEM.name, price: ITEM.price + addonTotal + sizeExtra })
    navigate(-1)
  }

  return (
    <div className="min-h-screen bg-[#fff8f6]">
      {/* Floating Back + Fav Header */}
      <header className="fixed top-0 left-0 w-full z-30 px-4 py-4 flex justify-between items-center md:hidden">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-[#ab3500] shadow-md active:scale-95 transition-transform"
        >
          <Icon name="arrow_back" />
        </button>
        <button className="w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-[#ab3500] shadow-md active:scale-95 transition-transform">
          <Icon name="favorite" />
        </button>
      </header>

      <main className="max-w-7xl mx-auto md:pt-12 md:pb-24">
        <div className="flex flex-col md:flex-row md:gap-12 md:px-16 md:items-start">

          {/* Hero Image */}
          <div className="relative w-full md:w-1/2 md:rounded-3xl overflow-hidden md:shadow-xl aspect-square bg-[#ffe9e3]">
            <img src={ITEM.img} alt={ITEM.name} className="w-full h-full object-cover" />
          </div>

          {/* Content */}
          <div className="relative -mt-8 md:mt-0 px-4 md:px-0 py-8 bg-[#fff8f6] rounded-t-[32px] md:rounded-none md:w-1/2 flex flex-col gap-6">

            {/* Title & Price */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-start">
                <h1 className="text-[32px] font-bold text-[#261814]">{ITEM.name}</h1>
                <span className="text-[24px] font-bold text-[#ab3500]">Rs. {ITEM.price}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex items-center text-[#7d5800] text-[14px] font-semibold">
                  <Icon name="star" filled size={18} className="mr-1 text-[#c98f00]" />
                  {ITEM.rating}
                </span>
                <span className="text-[#e1bfb5]">•</span>
                <span className="text-[14px] text-[#594139]">{ITEM.time}</span>
              </div>
            </div>

            {/* Nutrition Tags */}
            <div className="flex flex-wrap gap-2">
              {ITEM.nutrition.map(n => (
                <div key={n.label} className="px-3 py-1.5 bg-[#fde3db] rounded-full flex items-center gap-1.5 border border-[#ffdbd0]">
                  <Icon name={n.icon} size={16} className="text-[#ab3500]" />
                  <span className="text-[12px] font-bold text-[#5f1900]">{n.label}</span>
                </div>
              ))}
            </div>

            {/* Description */}
            <p className="text-[16px] text-[#594139] leading-relaxed">{ITEM.desc}</p>
            <hr className="border-[#e1bfb5]/30" />

            {/* Size */}
            <div>
              <h3 className="text-[14px] font-bold text-[#261814] mb-3">Choose Size</h3>
              <div className="flex gap-3">
                {['Standard', 'Monster (+Rs.149)'].map(s => (
                  <button
                    key={s}
                    onClick={() => setSize(s.includes('Monster') ? 'Monster' : 'Standard')}
                    className={`flex-1 py-3 px-4 rounded-xl border-2 text-[14px] font-semibold transition-all ${
                      (s.includes('Monster') ? size === 'Monster' : size === 'Standard')
                        ? 'border-[#ab3500] bg-[#ab3500]/10 text-[#ab3500]'
                        : 'border-[#e1bfb5] text-[#594139] hover:bg-[#ffe9e3]'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Spice Level */}
            <div>
              <h3 className="text-[14px] font-bold text-[#261814] mb-3">Spice Level</h3>
              <div className="flex gap-3">
                {[
                  { label: 'Mild',    icon: 'eco',      color: 'text-green-600' },
                  { label: 'Medium',  icon: 'local_fire_department', color: 'text-orange-500' },
                  { label: 'Inferno', icon: 'flash_on', color: 'text-[#b7102a]' },
                ].map(({ label, icon, color }) => (
                  <button
                    key={label}
                    onClick={() => setSpice(label)}
                    className={`flex-1 py-3 px-4 rounded-xl border-2 flex flex-col items-center gap-1 transition-all ${
                      spice === label
                        ? 'border-[#ab3500] bg-[#ab3500]/10'
                        : 'border-[#e1bfb5] hover:border-[#ab3500]'
                    }`}
                  >
                    <Icon name={icon} size={20} className={color} />
                    <span className="text-[12px] font-bold text-[#261814]">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Add-ons */}
            <div>
              <h3 className="text-[14px] font-bold text-[#261814] mb-3">Extra Magic (Add-ons)</h3>
              <div className="space-y-3">
                {ADDONS.map(a => (
                  <label
                    key={a.id}
                    className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-colors ${
                      addons.includes(a.id) ? 'border-[#ab3500] bg-[#ab3500]/5' : 'border-[#e1bfb5]/20 bg-[#fff1ed] hover:bg-[#ffe9e3]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                        <img src={a.img} alt={a.name} className="w-full h-full object-cover" />
                      </div>
                      <span className="text-[16px] font-semibold text-[#261814]">{a.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-[14px] font-semibold text-[#ab3500]">+Rs. {a.price}</span>
                      <input
                        type="checkbox"
                        checked={addons.includes(a.id)}
                        onChange={() => toggleAddon(a.id)}
                        className="w-6 h-6 rounded-md border-[#8d7168] text-[#ab3500] focus:ring-[#ab3500] cursor-pointer"
                      />
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="h-24 md:h-0" />
          </div>
        </div>
      </main>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 w-full z-40 bg-white/90 backdrop-blur-xl border-t border-[#e1bfb5]/20 md:static md:bg-transparent md:border-none md:mt-8">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          {/* Quantity Stepper */}
          <div className="flex items-center bg-[#f7ddd5] rounded-full p-1.5 shadow-inner">
            <button
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
              className="w-10 h-10 flex items-center justify-center text-[#ab3500] hover:bg-[#eed5cd] rounded-full transition-colors"
            >
              <Icon name="remove" />
            </button>
            <span className="w-10 text-center text-[20px] font-semibold text-[#261814] transition-transform">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(q => q + 1)}
              className="w-10 h-10 flex items-center justify-center text-[#ab3500] hover:bg-[#eed5cd] rounded-full transition-colors"
            >
              <Icon name="add" />
            </button>
          </div>
          {/* CTA */}
          <button
            onClick={handleAddToCart}
            className="flex-1 bg-[#ff6b35] text-[#5f1900] font-semibold py-4 rounded-full shadow-lg active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            <span>Add to Cart</span>
            <span className="w-1 h-1 bg-[#5f1900]/40 rounded-full" />
            <span>Rs. {total}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
