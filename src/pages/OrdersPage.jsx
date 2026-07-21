import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from '../components/Icon'
import BottomNav from '../components/BottomNav'

const ACTIVE_ORDERS = [
  {
    id: 'ord001',
    restaurant: 'Student Biryani',
    items: "Genie's Special Biryani x2, Garlic Naan x1",
    status: 'On the way',
    total: 1099,
    time: 'Arriving in 12 mins',
    date: 'Today, 08:24 AM',
    icon: 'pedal_bike',
  }
]

const PAST_ORDERS = [
  {
    id: 'ord998',
    restaurant: 'Burger Lab',
    items: 'Double Truffle Burger x1, Magic Fries x1',
    status: 'Delivered',
    total: 1099,
    date: 'July 5, 2026',
    icon: 'check_circle',
  },
  {
    id: 'ord997',
    restaurant: 'Pizza Max',
    items: 'Margherita Pizza x1, Pepsi 1.5L x1',
    status: 'Delivered',
    total: 940,
    date: 'June 28, 2026',
    icon: 'check_circle',
  }
]

export default function OrdersPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('active') // 'active' | 'history'

  return (
    <div className="pb-28 min-h-screen bg-[#fff8f6]">
      {/* Top Header */}
      <header className="sticky top-0 z-50 bg-[#fff8f6]/80 backdrop-blur-md px-4 py-4 border-b border-[#e1bfb5]/20">
        <h1 className="text-lg font-bold text-[#261814]">My Orders</h1>
      </header>

      {/* Tabs */}
      <div className="px-4 mt-6">
        <div className="bg-[#fff1ed] p-1.5 rounded-full flex gap-1 relative border border-[#e1bfb5]/20">
          <button
            onClick={() => setActiveTab('active')}
            className={`flex-1 py-3 text-xs font-bold rounded-full transition-all cursor-pointer ${
              activeTab === 'active' 
                ? 'bg-white text-[#ab3500] shadow-sm' 
                : 'text-[#594139] hover:text-[#ab3500]'
            }`}
          >
            Active Orders ({ACTIVE_ORDERS.length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-3 text-xs font-bold rounded-full transition-all cursor-pointer ${
              activeTab === 'history' 
                ? 'bg-white text-[#ab3500] shadow-sm' 
                : 'text-[#594139] hover:text-[#ab3500]'
            }`}
          >
            Order History ({PAST_ORDERS.length})
          </button>
        </div>
      </div>

      {/* Orders List */}
      <main className="px-4 mt-6 space-y-4">
        {activeTab === 'active' ? (
          ACTIVE_ORDERS.length > 0 ? (
            ACTIVE_ORDERS.map(order => (
              <div 
                key={order.id}
                className="bg-white p-5 rounded-2xl border border-[#e1bfb5]/30 shadow-sm space-y-4"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-[#261814] text-base">{order.restaurant}</h3>
                    <p className="text-[12px] text-[#8d7168] mt-0.5">{order.date}</p>
                  </div>
                  <div className="bg-[#ff6b35]/20 border border-[#ff6b35]/30 px-3 py-1 rounded-full flex items-center gap-1">
                    <Icon name={order.icon} size={14} className="text-[#ab3500]" />
                    <span className="text-[11px] font-bold text-[#ab3500] uppercase tracking-wide">{order.status}</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <p className="text-sm text-[#594139] line-clamp-2">
                    <strong className="text-[#261814]">Items:</strong> {order.items}
                  </p>
                  <p className="text-sm font-bold text-[#261814]">
                    Total paid: <span className="text-[#ab3500]">Rs. {order.total}</span>
                  </p>
                </div>

                <div className="flex gap-3 pt-2 border-t border-[#e1bfb5]/20">
                  <button 
                    onClick={() => navigate(`/tracking/${order.id}`)}
                    className="flex-1 py-3 bg-[#ab3500] text-white rounded-full text-xs font-bold shadow-md hover:bg-[#ff6b35] transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Icon name="map" size={14} />
                    Track Order
                  </button>
                  <button 
                    className="flex-1 py-3 bg-[#fff1ed] text-[#594139] border border-[#e1bfb5]/30 rounded-full text-xs font-bold hover:bg-[#ffe9e3] cursor-pointer"
                  >
                    Help Support
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-16 text-center space-y-3">
              <Icon name="receipt_long" size={48} className="text-[#8d7168]/50 mx-auto" />
              <p className="font-bold text-[#261814]">No active orders</p>
              <p className="text-sm text-[#594139]">You don't have any orders processing right now.</p>
            </div>
          )
        ) : (
          PAST_ORDERS.length > 0 ? (
            PAST_ORDERS.map(order => (
              <div 
                key={order.id}
                className="bg-white p-5 rounded-2xl border border-[#e1bfb5]/20 shadow-sm space-y-4 opacity-90 hover:opacity-100 transition-opacity"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-[#261814] text-base">{order.restaurant}</h3>
                    <p className="text-[12px] text-[#8d7168] mt-0.5">{order.date}</p>
                  </div>
                  <div className="bg-[#2e7d32]/10 border border-[#2e7d32]/25 px-3 py-1 rounded-full flex items-center gap-1">
                    <Icon name="check_circle" size={14} className="text-[#2e7d32]" />
                    <span className="text-[11px] font-bold text-[#2e7d32] uppercase tracking-wide">{order.status}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-[#594139]">
                    <strong className="text-[#261814]">Items:</strong> {order.items}
                  </p>
                  <p className="text-xs font-bold text-[#261814]">
                    Total Amount: <span className="text-[#ab3500]">Rs. {order.total}</span>
                  </p>
                </div>

                <div className="flex gap-3 pt-2 border-t border-[#e1bfb5]/10">
                  <button 
                    className="flex-grow py-2.5 bg-[#fff1ed] hover:bg-[#ffe9e3] text-[#ab3500] border border-[#e1bfb5]/40 rounded-full text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Icon name="autorenew" size={14} />
                    Reorder Items
                  </button>
                  <button 
                    className="px-4 py-2.5 bg-white border border-[#e1bfb5]/30 text-[#594139] rounded-full text-xs font-bold hover:bg-[#fff1ed] cursor-pointer"
                  >
                    View Invoice
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-16 text-center space-y-3">
              <Icon name="receipt" size={48} className="text-[#8d7168]/50 mx-auto" />
              <p className="font-bold text-[#261814]">No order history</p>
              <p className="text-sm text-[#594139]">You haven't ordered anything from Food Genie yet.</p>
            </div>
          )
        )}
      </main>

      <BottomNav />
    </div>
  )
}
