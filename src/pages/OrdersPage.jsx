import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from '../components/Icon'
import BottomNav from '../components/BottomNav'
import API from '../api'

export default function OrdersPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('active')
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true)
      try {
        const res = await API.get('/api/orders')
        setOrders(res.data || [])
      } catch (err) {
        setOrders([])
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  const activeOrders = orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled')
  const pastOrders = orders.filter(o => o.status === 'delivered' || o.status === 'cancelled')

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
            Active Orders ({activeOrders.length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-3 text-xs font-bold rounded-full transition-all cursor-pointer ${
              activeTab === 'history' 
                ? 'bg-white text-[#ab3500] shadow-sm' 
                : 'text-[#594139] hover:text-[#ab3500]'
            }`}
          >
            Order History ({pastOrders.length})
          </button>
        </div>
      </div>

      {/* Orders List */}
      <main className="px-4 mt-6 space-y-4">
        {loading ? (
          <div className="py-12 text-center text-[#8d7168]">
            <div className="w-6 h-6 border-2 border-[#ab3500] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs">Loading orders...</p>
          </div>
        ) : activeTab === 'active' ? (
          activeOrders.length > 0 ? (
            activeOrders.map(order => (
              <div 
                key={order.id}
                className="bg-white p-5 rounded-2xl border border-[#e1bfb5]/30 shadow-sm space-y-4"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-[#261814] text-base">Order #{order.id}</h3>
                    <p className="text-[12px] text-[#8d7168] mt-0.5">{new Date(order.created_at || Date.now()).toLocaleString()}</p>
                  </div>
                  <div className="bg-[#ff6b35]/20 border border-[#ff6b35]/30 px-3 py-1 rounded-full flex items-center gap-1">
                    <Icon name="moped" size={14} className="text-[#ab3500]" />
                    <span className="text-[11px] font-bold text-[#ab3500] uppercase tracking-wide">{order.status}</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <p className="text-sm font-bold text-[#261814]">
                    Total paid: <span className="text-[#ab3500]">Rs. {order.total_amount || order.total}</span>
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
                </div>
              </div>
            ))
          ) : (
            <div className="py-16 text-center space-y-3 bg-white rounded-3xl border border-[#e1bfb5]/30 p-8 shadow-sm">
              <Icon name="receipt_long" size={48} className="text-[#8d7168]/50 mx-auto" />
              <p className="font-bold text-[#261814]">No active orders</p>
              <p className="text-sm text-[#594139]">You don't have any orders processing right now.</p>
            </div>
          )
        ) : (
          pastOrders.length > 0 ? (
            pastOrders.map(order => (
              <div 
                key={order.id}
                className="bg-white p-5 rounded-2xl border border-[#e1bfb5]/20 shadow-sm space-y-4 opacity-90 hover:opacity-100 transition-opacity"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-[#261814] text-base">Order #{order.id}</h3>
                    <p className="text-[12px] text-[#8d7168] mt-0.5">{new Date(order.created_at || Date.now()).toLocaleDateString()}</p>
                  </div>
                  <div className="bg-[#2e7d32]/10 border border-[#2e7d32]/25 px-3 py-1 rounded-full flex items-center gap-1">
                    <Icon name="check_circle" size={14} className="text-[#2e7d32]" />
                    <span className="text-[11px] font-bold text-[#2e7d32] uppercase tracking-wide">{order.status}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-bold text-[#261814]">
                    Total Amount: <span className="text-[#ab3500]">Rs. {order.total_amount || order.total}</span>
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="py-16 text-center space-y-3 bg-white rounded-3xl border border-[#e1bfb5]/30 p-8 shadow-sm">
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
