import { useNavigate } from 'react-router-dom'
import Icon from '../components/Icon'
import BottomNav from '../components/BottomNav'
import { useCart } from '../context/CartContext'

export default function CartPage() {
  const navigate = useNavigate()
  const { items, addItem, removeItem, cartTotal, cartCount } = useCart()

  const deliveryFee = cartCount > 0 ? 150 : 0
  const grandTotal = cartTotal + deliveryFee

  return (
    <div className="pb-28 min-h-screen bg-[#fff8f6]">
      {/* Top Header */}
      <header className="sticky top-0 z-50 bg-[#fff8f6]/80 backdrop-blur-md px-4 py-4 flex items-center justify-between border-b border-[#e1bfb5]/20">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => navigate(-1)} 
            className="p-1.5 hover:bg-[#fff1ed] rounded-full text-[#594139] active:scale-95 cursor-pointer"
          >
            <Icon name="arrow_back" size={20} />
          </button>
          <h1 className="text-lg font-bold text-[#261814]">Your Cart</h1>
        </div>
        <span className="text-xs text-[#8d7168] font-bold uppercase tracking-wider">{cartCount} Items</span>
      </header>

      {/* Cart Body */}
      <main className="px-4 mt-6">
        {items.length > 0 ? (
          <div className="space-y-6">
            {/* Items List */}
            <div className="bg-white rounded-2xl border border-[#e1bfb5]/30 shadow-sm overflow-hidden divide-y divide-[#e1bfb5]/20">
              {items.map(item => (
                <div key={item.id} className="p-4 flex gap-4 items-center">
                  <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-[#ffe9e3]">
                    <img 
                      src={item.img || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=100&q=80'} 
                      alt={item.name} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-[#261814] text-sm md:text-base truncate">{item.name}</h4>
                    <p className="text-[#ab3500] font-bold text-xs mt-1">Rs. {item.price}</p>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center bg-[#fff1ed] rounded-full p-1 border border-[#e1bfb5]/20">
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="w-8 h-8 flex items-center justify-center text-[#ab3500] hover:bg-[#ffe9e3] rounded-full transition-colors cursor-pointer"
                    >
                      <Icon name="remove" size={16} />
                    </button>
                    <span className="w-8 text-center text-sm font-semibold text-[#261814]">
                      {item.qty}
                    </span>
                    <button 
                      onClick={() => addItem(item)}
                      className="w-8 h-8 flex items-center justify-center text-[#ab3500] hover:bg-[#ffe9e3] rounded-full transition-colors cursor-pointer"
                    >
                      <Icon name="add" size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Bill Summary */}
            <div className="bg-white p-5 rounded-2xl border border-[#e1bfb5]/30 shadow-sm space-y-3">
              <h3 className="font-bold text-[#261814] text-sm uppercase tracking-wider mb-2">Bill Summary</h3>
              <div className="flex justify-between text-sm text-[#594139]">
                <span>Subtotal</span>
                <span>Rs. {cartTotal}</span>
              </div>
              <div className="flex justify-between text-sm text-[#594139]">
                <span>Delivery Fee</span>
                <span>Rs. {deliveryFee}</span>
              </div>
              <hr className="border-[#e1bfb5]/20 my-2" />
              <div className="flex justify-between text-base font-bold text-[#261814] pt-1">
                <span>To Pay</span>
                <span className="text-[#ab3500]">Rs. {grandTotal}</span>
              </div>
            </div>

            {/* Checkout CTA */}
            <button 
              onClick={() => navigate('/checkout')}
              className="w-full bg-[#ab3500] text-white py-4 rounded-full text-base font-bold shadow-lg hover:bg-[#ff6b35] transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
            >
              <Icon name="shopping_cart_checkout" size={20} />
              Proceed to Checkout
            </button>
          </div>
        ) : (
          /* Empty State */
          <div className="py-20 text-center space-y-6 max-w-[384px] mx-auto block">
            <div className="w-20 h-20 bg-[#ffe9e3] rounded-full flex items-center justify-center mx-auto text-[#ab3500] animate-pulse-soft">
              <Icon name="shopping_basket" size={40} />
            </div>
            <div className="w-full">
              <p className="font-bold text-[#261814] text-lg">Your cart is feeling light</p>
              <p className="text-[#594139] text-sm mt-1">Add items from your favorite restaurants and satisfy your hunger cravings!</p>
            </div>
            <button 
              onClick={() => navigate('/home')}
              className="w-full py-3.5 bg-[#ab3500] text-white rounded-full text-sm font-semibold shadow-md hover:bg-[#ff6b35] transition-colors cursor-pointer"
            >
              Browse Restaurants
            </button>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  )
}
