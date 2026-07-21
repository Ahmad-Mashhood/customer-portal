import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Icon from '../components/Icon'
import { useCart } from '../context/CartContext'
import logo from '../assets/logo_transparent.png'

const PAYMENT_METHODS = [
  { id: 'cod',       icon: 'payments',     label: 'COD',       color: null },
  { id: 'card',      icon: 'credit_card',  label: 'Card',      color: null },
  { id: 'easypaisa', icon: null,           label: 'Easypaisa', badge: { bg: 'bg-emerald-600', text: 'EP' } },
  { id: 'jazzcash',  icon: null,           label: 'JazzCash',  badge: { bg: 'bg-red-600',     text: 'JC' } },
]

const ORDER_ITEMS = [
  { name: "Genie's Magic Burger", qty: 2, price: 1450, img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=100&q=80' },
  { name: 'Peri Fries (Large)',   qty: 1, price:  450, img: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=100&q=80' },
]
const SUBTOTAL  = ORDER_ITEMS.reduce((s, i) => s + i.price, 0)
const DELIVERY  = 150
const TOTAL     = SUBTOTAL + DELIVERY

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { clearCart, items, cartTotal } = useCart()
  const [payment, setPayment] = useState('cod')
  const [notes,   setNotes]   = useState('')

  const isCartNotEmpty = items && items.length > 0
  const activeItems = isCartNotEmpty ? items : ORDER_ITEMS
  const activeSubtotal = isCartNotEmpty ? cartTotal : SUBTOTAL
  const activeDelivery = 150
  const activeTotal = activeSubtotal + activeDelivery

  const handlePlaceOrder = () => {
    clearCart()
    navigate('/tracking/ord001')
  }

  return (
    <div className="min-h-screen bg-[#fff8f6]">
      {/* Top App Bar */}
      <header className="bg-[#fff8f6] sticky top-0 z-40">
        <div className="flex justify-between items-center px-4 md:px-16 w-full max-w-7xl mx-auto h-20">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-[#fff1ed] transition-colors rounded-full text-[#594139] cursor-pointer">
              <Icon name="arrow_back" />
            </button>
            <div className="w-8 h-8 bg-white rounded-lg p-1 shadow-sm flex items-center justify-center border border-[#e1bfb5]/20">
              <img src={logo} alt="Food Genie" className="w-full h-full object-contain" />
            </div>
            <h1 className="text-[24px] font-bold text-[#ab3500]">Food Genie</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-[14px] font-semibold text-[#594139]">Checkout</span>
              <span className="text-[12px] font-bold text-[#ab3500]">Secure Transaction</span>
            </div>
            <div 
              onClick={() => navigate('/profile')}
              className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#ffdbd0] bg-[#fde3db] flex items-center justify-center cursor-pointer active:scale-95 transition-transform"
            >
              <Icon name="person" filled className="text-[#ab3500]" />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-16 py-6 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-20 items-start">

          {/* Left Column */}
          <div className="lg:col-span-8 flex flex-col gap-6">

            {/* Delivery Address */}
            <section className="bg-white p-6 rounded-xl modern-tactile-card border border-[#f7ddd5]">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#ff6b35] rounded-full flex items-center justify-center text-[#5f1900]">
                    <Icon name="location_on" />
                  </div>
                  <h2 className="text-[20px] font-semibold">Delivery Address</h2>
                </div>
                <button className="text-[#ab3500] text-[14px] font-semibold hover:underline cursor-pointer">Change</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-6">
                <div className="md:col-span-1 rounded-xl overflow-hidden h-32 relative border border-[#f7ddd5] bg-[#fff1ed] flex items-center justify-center">
                  <Icon name="location_on" filled size={48} className="text-[#ab3500]" />
                </div>
                <div className="md:col-span-2 flex flex-col justify-center">
                  <p className="text-[18px] font-semibold">Home</p>
                  <p className="text-[16px] text-[#594139] mt-1">Plot 42, Sector F-7/2, Street 15</p>
                  <p className="text-[16px] text-[#594139]">Islamabad, 44000, Pakistan</p>
                  <p className="text-[14px] font-semibold text-[#7d5800] mt-2 flex items-center gap-1">
                    <Icon name="schedule" size={16} /> Est. Delivery: 25-35 mins
                  </p>
                </div>
              </div>
            </section>

            {/* Payment Method */}
            <section className="bg-white p-6 rounded-xl modern-tactile-card border border-[#f7ddd5]">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#c98f00] rounded-full flex items-center justify-center text-[#432e00]">
                  <Icon name="account_balance_wallet" />
                </div>
                <h2 className="text-[20px] font-semibold">Payment Method</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {PAYMENT_METHODS.map(({ id, icon, label, badge }) => (
                  <label key={id} className="cursor-pointer group relative">
                    <input
                      type="radio" name="payment" value={id}
                      checked={payment === id}
                      onChange={() => setPayment(id)}
                      className="sr-only peer"
                    />
                    <div className={`flex flex-col items-center p-3 border-2 rounded-xl transition-all ${
                      payment === id ? 'border-[#ab3500] bg-[#ffdbd0] shadow-inner' : 'border-[#f7ddd5] hover:bg-[#fff1ed]'
                    }`}>
                      {icon ? (
                        <Icon name={icon} size={28} className={`mb-2 ${payment === id ? 'text-[#ab3500]' : 'text-[#594139]'}`} />
                      ) : (
                        <div className={`w-8 h-8 rounded-full ${badge.bg} mb-2 flex items-center justify-center text-[10px] text-white font-bold`}>{badge.text}</div>
                      )}
                      <span className="text-[12px] font-bold text-[#594139]">{label}</span>
                    </div>
                  </label>
                ))}
              </div>
              <div className="mt-6">
                <label className="block text-[14px] font-semibold text-[#594139] mb-2">Delivery Notes</label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="w-full rounded-xl border-[#f7ddd5] bg-[#fff1ed] p-3 text-[16px] h-24 resize-none focus:ring-[#ab3500] focus:border-[#ab3500] outline-none"
                  placeholder="e.g. Please leave at the reception or gate."
                />
              </div>
            </section>

            {/* Mobile Order Summary */}
            <section className="lg:hidden bg-white p-6 rounded-xl modern-tactile-card border border-[#f7ddd5]">
              <h2 className="text-[20px] font-semibold mb-6">Order Summary</h2>
              <div className="space-y-3">
                {activeItems.map(item => (
                  <div key={item.name} className="flex justify-between items-center text-[16px]">
                    <span>{item.qty || item.quantity || 1}x {item.name}</span>
                    <span>Rs. {item.price.toLocaleString()}</span>
                  </div>
                ))}
                <hr className="border-[#f7ddd5] my-3" />
                <div className="flex justify-between text-[16px]"><span>Subtotal</span><span>Rs. {activeSubtotal.toLocaleString()}</span></div>
                <div className="flex justify-between text-[16px] text-[#7d5800]"><span>Delivery Fee</span><span>Rs. {activeDelivery}</span></div>
                <div className="flex justify-between text-[20px] font-semibold pt-3 text-[#ab3500]"><span>Total</span><span>Rs. {activeTotal.toLocaleString()}</span></div>
              </div>
            </section>
          </div>

          {/* Right — Desktop Summary */}
          <aside className="hidden lg:block lg:col-span-4 sticky top-28">
            <div className="bg-[#ffe9e3] p-6 rounded-2xl modern-tactile-card border border-[#fde3db] space-y-6">
              <h2 className="text-[20px] font-semibold">Order Summary</h2>
              <div className="space-y-6">
                {activeItems.map(item => (
                  <div key={item.name} className="flex gap-3">
                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <img src={item.img || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=100&q=80'} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow">
                      <p className="text-[14px] font-semibold">{item.name}</p>
                      <p className="text-[14px] text-[#594139]">Quantity: {item.qty || item.quantity || 1}</p>
                      <p className="text-[14px] font-semibold text-[#ab3500]">Rs. {item.price.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-3 pt-6 border-t border-[#f7ddd5]">
                <div className="flex justify-between text-[16px]"><span className="text-[#594139]">Subtotal</span><span>Rs. {activeSubtotal.toLocaleString()}</span></div>
                <div className="flex justify-between text-[16px]"><span className="text-[#594139]">Delivery Fee</span><span>Rs. {activeDelivery}</span></div>
                <div className="flex justify-between text-[20px] font-semibold pt-6 border-t border-[#f7ddd5]">
                  <span>Total Amount</span>
                  <span className="text-[#ab3500]">Rs. {activeTotal.toLocaleString()}</span>
                </div>
              </div>
              <button
                onClick={handlePlaceOrder}
                className="w-full bg-[#ab3500] text-white py-4 rounded-full text-[20px] font-semibold pill-button-glow transition-all hover:scale-[1.02] active:scale-95 inner-soft-glow cursor-pointer"
              >
                Place Order
              </button>
              <p className="text-center text-[12px] text-[#594139] px-6">
                By placing your order, you agree to Food Genie's{' '}
                <Link className="underline" to="/terms">Terms of Service</Link>.
              </p>
            </div>
          </aside>
        </div>
      </main>

      {/* Mobile Footer CTA */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-[#fff8f6] border-t border-[#f7ddd5] z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-[12px] text-[#594139]">Total</span>
            <span className="text-[20px] font-semibold text-[#ab3500]">Rs. {activeTotal.toLocaleString()}</span>
          </div>
          <button
            onClick={handlePlaceOrder}
            className="flex-grow max-w-[240px] bg-[#ab3500] text-white py-3 rounded-full text-[20px] font-semibold pill-button-glow transition-all active:scale-95 inner-soft-glow cursor-pointer"
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  )
}
