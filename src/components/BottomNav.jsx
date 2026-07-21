import { useNavigate, useLocation } from 'react-router-dom'
import Icon from './Icon'
import { useCart } from '../context/CartContext'

const NAV_ITEMS = [
  { label: 'Home',    icon: 'home',         route: '/home' },
  { label: 'Search',  icon: 'search',        route: '/search' },
  { label: 'Cart',    icon: 'shopping_bag',  route: '/cart' },
  { label: 'Orders',  icon: 'receipt_long',  route: '/orders' },
  { label: 'Profile', icon: 'person',        route: '/profile' },
]

export default function BottomNav() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const { cartCount } = useCart()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#fff8f6] border-t border-[#e1bfb5]/30 flex justify-around items-center py-2 px-2 z-50">
      {NAV_ITEMS.map(({ label, icon, route }) => {
        const active = location.pathname === route
        const isCart = label === 'Cart'
        return (
          <button
            key={label}
            onClick={() => navigate(route)}
            className={`flex flex-col items-center gap-1 p-2 relative ${active ? 'text-[#ab3500]' : 'text-[#594139]'}`}
          >
            <Icon name={icon} filled={active} size={22} />
            <span className="text-[10px] font-bold">{label}</span>
            {isCart && cartCount > 0 && (
              <span className="absolute top-1 right-2 w-4 h-4 bg-[#ab3500] text-white text-[8px] flex items-center justify-center rounded-full font-bold">
                {cartCount}
              </span>
            )}
          </button>
        )
      })}
    </nav>
  )
}
