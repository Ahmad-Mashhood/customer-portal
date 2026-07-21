import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from '../components/Icon'
import logo from '../assets/logo_transparent.png'

const STEPS = [
  { label: 'Order Placed',    icon: 'check',      desc: "We've received your magic request",       done: true },
  { label: 'Preparing',       icon: 'check',      desc: 'Chef is weaving their culinary spells',   done: true },
  { label: 'Out for delivery', icon: 'pedal_bike', desc: 'Your genie is hovering to your door',    done: true,  active: true },
  { label: 'Delivered',       icon: 'home',       desc: 'Enjoy your enchanted feast!',             done: false },
]

export default function TrackingPage() {
  const navigate   = useNavigate()
  const sheetRef   = useRef(null)
  const [minutes, setMinutes] = useState(12)
  const [seconds, setSeconds] = useState(45)
  const [riderPos, setRiderPos] = useState({ x: 35, y: 40 })

  /* Countdown timer */
  useEffect(() => {
    const id = setInterval(() => {
      setSeconds(s => {
        if (s === 0) {
          setMinutes(m => (m === 0 ? (clearInterval(id), 0) : m - 1))
          return 59
        }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [])

  /* Rider movement simulation */
  useEffect(() => {
    const id = setInterval(() => {
      setRiderPos(p => ({
        x: Math.min(90, Math.max(5, p.x + (Math.random() - 0.2) * 1.5)),
        y: Math.min(80, Math.max(5, p.y - (Math.random() - 0.2) * 1.5)),
      }))
    }, 3000)
    return () => clearInterval(id)
  }, [])

  const pad = n => String(n).padStart(2, '0')

  return (
    <div className="bg-[#fff8f6] h-screen flex flex-col overflow-hidden">
      {/* Top AppBar */}
      <header className="bg-[#fff8f6] w-full z-30">
        <div className="flex justify-between items-center px-4 md:px-16 w-full max-w-7xl mx-auto py-4">
          <div className="flex items-center gap-2">
            <button onClick={() => navigate('/home')} className="p-2 hover:bg-[#fff1ed] transition-colors rounded-full active:scale-95">
              <Icon name="arrow_back" className="text-[#ab3500]" />
            </button>
            <div className="w-8 h-8 bg-white rounded-lg p-1 shadow-sm flex items-center justify-center border border-[#e1bfb5]/20">
              <img src={logo} alt="Food Genie" className="w-full h-full object-contain" />
            </div>
            <h1 className="text-[24px] font-bold text-[#ab3500]">Food Genie</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[14px] font-semibold text-[#594139] hidden md:block">Order #44921</span>
            <div 
              onClick={() => navigate('/profile')}
              className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#ff6b35] bg-[#fde3db] flex items-center justify-center cursor-pointer active:scale-95 transition-transform"
            >
              <Icon name="person" filled className="text-[#ab3500]" />
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex flex-col md:flex-row relative overflow-hidden">

        {/* Map */}
        <div className="w-full h-full md:w-[60%] lg:w-[65%] relative bg-[#fff1ed] overflow-hidden">
          {/* Fake map bg */}
          <div className="w-full h-full bg-gradient-to-br from-[#fff1ed] to-[#ffe9e3] relative">
            {/* Grid lines (fake map) */}
            {[...Array(10)].map((_, i) => (
              <div key={`h${i}`} className="absolute left-0 right-0 border-t border-[#e1bfb5]/30" style={{ top: `${i * 10}%` }} />
            ))}
            {[...Array(10)].map((_, i) => (
              <div key={`v${i}`} className="absolute top-0 bottom-0 border-l border-[#e1bfb5]/30" style={{ left: `${i * 10}%` }} />
            ))}
            {/* Route line */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <polyline
                points={`${riderPos.x}%,${riderPos.y}% 70%,20%`}
                stroke="#ab3500" strokeWidth="2" strokeDasharray="6,4" fill="none" opacity="0.5"
              />
            </svg>

            {/* Rider Marker */}
            <div
              className="absolute z-20 transition-all duration-1000 ease-in-out"
              style={{ left: `${riderPos.x}%`, top: `${riderPos.y}%`, transform: 'translate(-50%, -50%)' }}
            >
              <div className="relative flex flex-col items-center">
                <div className="bg-[#ab3500] p-2 rounded-full shadow-lg border-2 border-white animate-pulse-soft">
                  <Icon name="pedal_bike" filled size={22} className="text-white" />
                </div>
                <div className="absolute -bottom-1 w-2 h-2 bg-[#ab3500] rotate-45 border-r border-b border-white" />
              </div>
            </div>

            {/* Destination Marker */}
            <div className="absolute z-10" style={{ left: '70%', top: '20%', transform: 'translate(-50%, -50%)' }}>
              <div className="bg-[#b7102a] p-2 rounded-full shadow-lg border-2 border-white">
                <Icon name="location_on" filled size={22} className="text-white" />
              </div>
            </div>

            {/* Map label */}
            <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full text-[12px] font-semibold text-[#261814] shadow-sm">
              📍 Live Map View
            </div>
          </div>

          {/* Floating Controls (mobile) */}
          <div className="absolute top-4 right-4 flex flex-col gap-2 md:hidden">
            <button className="p-3 bg-white/90 backdrop-blur-md rounded-full shadow-md text-[#261814]">
              <Icon name="my_location" />
            </button>
          </div>
        </div>

        {/* Status Panel */}
        <aside
          ref={sheetRef}
          className="fixed inset-x-0 bottom-0 z-40 bg-white md:relative md:inset-auto md:w-[40%] lg:w-[35%] md:h-full shadow-[0_-8px_30px_rgba(0,0,0,0.08)] md:shadow-none rounded-t-[32px] md:rounded-none overflow-hidden flex flex-col"
        >
          {/* Mobile Drag Handle */}
          <div className="w-full flex justify-center py-4 md:hidden">
            <div className="w-12 h-1.5 bg-[#e1bfb5] rounded-full cursor-grab" />
          </div>

          <div className="px-4 md:px-8 py-4 md:py-10 flex-1 overflow-y-auto hide-scrollbar">
            {/* Countdown */}
            <div className="flex justify-between items-start mb-8">
              <div>
                <p className="text-[14px] font-semibold text-[#594139] mb-1">Arriving in</p>
                <h2 className="text-[40px] font-extrabold text-[#ab3500]">{pad(minutes)}:{pad(seconds)}</h2>
              </div>
              <div className="bg-[#ff6b35]/20 px-4 py-2 rounded-xl text-center border border-[#ff6b35]/30">
                <p className="text-[12px] font-bold text-[#ab3500] uppercase tracking-wider">Status</p>
                <p className="text-[20px] font-semibold text-[#ab3500]">On the way</p>
              </div>
            </div>

            {/* Vertical Stepper */}
            <div className="space-y-0 mb-10 relative">
              <div className="absolute left-[15px] top-4 bottom-4 w-1 bg-[#fde3db] rounded-full">
                <div className="absolute top-0 left-0 w-full h-[66%] bg-[#2e7d32] rounded-full transition-all duration-1000" />
              </div>
              {STEPS.map((step, i) => (
                <div key={step.label} className={`flex gap-6 items-start pb-8 relative ${!step.done && !step.active ? 'opacity-50' : ''}`}>
                  <div className={`z-10 w-8 h-8 rounded-full flex items-center justify-center text-white ${
                    step.done || step.active ? 'bg-[#2e7d32] ring-4 ring-[#2e7d32]/20' : 'bg-[#fde3db] text-[#594139]'
                  } ${step.active ? 'animate-pulse' : ''}`}>
                    <Icon name={step.icon} filled={step.done} size={16} className={step.done || step.active ? 'text-white' : 'text-[#594139]'} />
                  </div>
                  <div>
                    <p className={`text-[20px] font-semibold ${step.done || step.active ? 'text-[#2e7d32]' : 'text-[#261814]'}`}>{step.label}</p>
                    <p className="text-[14px] text-[#594139]">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Rider Card */}
            <div className="bg-[#fff1ed] rounded-2xl p-4 flex items-center gap-4 mb-6 border border-[#fde3db] shadow-sm hover:shadow-md transition-shadow">
              <div className="relative">
                <div className="w-16 h-16 rounded-xl bg-[#fde3db] flex items-center justify-center text-3xl">🏍️</div>
                <div className="absolute -bottom-2 -right-2 bg-[#c98f00] text-[#432e00] px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-sm">
                  4.9 <Icon name="star" filled size={10} />
                </div>
              </div>
              <div className="flex-1">
                <h4 className="text-[20px] font-semibold text-[#261814]">Alex "The Flash"</h4>
                <p className="text-[14px] text-[#594139]">On an e-bike • 2.4k deliveries</p>
              </div>
              <div className="flex gap-2">
                <button className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#ab3500] border border-[#fde3db] hover:bg-[#ff6b35]/10 transition-colors active:scale-90">
                  <Icon name="call" />
                </button>
                <button className="w-12 h-12 rounded-full bg-[#ab3500] flex items-center justify-center text-white shadow-md hover:bg-[#ff6b35] transition-colors active:scale-90">
                  <Icon name="chat" />
                </button>
              </div>
            </div>

            {/* Order Summary Accordion */}
            <details className="group border-t border-[#f7ddd5] py-4 cursor-pointer">
              <summary className="flex justify-between items-center list-none text-[14px] font-semibold text-[#594139]">
                <span>ORDER SUMMARY</span>
                <Icon name="expand_more" className="group-open:rotate-180 transition-transform" />
              </summary>
              <div className="mt-4 space-y-3">
                <div className="flex justify-between text-[14px]"><span>Double Truffle Burger x1</span><span>Rs. 849</span></div>
                <div className="flex justify-between text-[14px]"><span>Magic Fries x1</span><span>Rs. 250</span></div>
                <div className="flex justify-between text-[20px] font-semibold pt-2 border-t border-dashed border-[#e1bfb5]">
                  <span>Total</span><span className="text-[#ab3500]">Rs. 1,099</span>
                </div>
              </div>
            </details>
          </div>

          {/* Support Button */}
          <div className="px-4 md:px-8 py-6 bg-white border-t border-[#f7ddd5]">
            <button className="w-full py-4 bg-[#ffe9e3] text-[#594139] font-semibold rounded-full flex items-center justify-center gap-3 hover:bg-[#fde3db] transition-all">
              <Icon name="help_outline" />
              Contact Support
            </button>
          </div>
        </aside>
      </main>
    </div>
  )
}
