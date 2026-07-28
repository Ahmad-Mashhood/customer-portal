import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Icon from '../components/Icon'
import BottomNav from '../components/BottomNav'
import API from '../api'

const POPULAR_SEARCHES = ['Biryani', 'Burger', 'Pizza', 'Karahi', 'Dessert', 'Healthy']

function getLevenshteinDistance(a, b) {
  if (a.length === 0) return b.length
  if (b.length === 0) return a.length

  const matrix = []
  for (let i = 0; i <= b.length; i++) matrix[i] = [i]
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
        )
      }
    }
  }
  return matrix[b.length][a.length]
}

function isFuzzyMatch(query, item) {
  const cleanQuery = query.toLowerCase().replace(/[^\w\s]/g, '').trim()
  if (!cleanQuery) return true
  const textToSearch = `${item.name} ${item.description || ''} ${item.category || ''}`.toLowerCase().replace(/[^\w\s]/g, '')
  return textToSearch.includes(cleanQuery)
}

export default function SearchPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const queryParam = searchParams.get('q') || ''

  const [query, setQuery] = useState(queryParam)
  const [activeCategory, setActiveCategory] = useState(null)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setQuery(queryParam)
  }, [queryParam])

  useEffect(() => {
    const fetchFoods = async () => {
      setLoading(true)
      try {
        const res = await API.get('/api/foods')
        setItems(res.data || [])
      } catch (err) {
        setItems([])
      } finally {
        setLoading(false)
      }
    }
    fetchFoods()
  }, [])

  const handleQueryChange = (val) => {
    setQuery(val)
    setSearchParams(val ? { q: val } : {})
  }

  const filteredItems = items.filter(item => {
    const matchesQuery = isFuzzyMatch(query, item)
    const matchesCategory = activeCategory ? item.category === activeCategory : true
    return matchesQuery && matchesCategory
  })

  return (
    <div className="pb-28 min-h-screen bg-[#fff8f6]">
      {/* Top Header */}
      <header className="sticky top-0 z-50 bg-[#fff8f6]/80 backdrop-blur-md px-4 py-4 flex items-center justify-between border-b border-[#e1bfb5]/20">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate(-1)} className="p-1 rounded-full text-[#594139] hover:bg-[#fff1ed]">
            <Icon name="arrow_back" size={20} />
          </button>
          <h1 className="text-lg font-bold text-[#261814]">Search Menu</h1>
        </div>
      </header>

      {/* Search Input & Controls */}
      <div className="px-4 mt-4 space-y-4">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            placeholder="Search for biryani, burgers, pizza..."
            className="w-full bg-white border border-[#e1bfb5]/40 rounded-2xl py-3.5 pl-11 pr-10 text-sm text-[#261814] placeholder-[#8d7168] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ab3500]/20 focus:border-[#ab3500]"
          />
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8d7168]">
            <Icon name="search" size={20} />
          </div>
          {query && (
            <button
              onClick={() => handleQueryChange('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8d7168] hover:text-[#261814]"
            >
              <Icon name="close" size={18} />
            </button>
          )}
        </div>

        {/* Popular Tags */}
        {!query && (
          <div className="space-y-2">
            <p className="text-xs font-bold text-[#8d7168] uppercase tracking-wider">Popular Searches</p>
            <div className="flex flex-wrap gap-2">
              {POPULAR_SEARCHES.map(tag => (
                <button
                  key={tag}
                  onClick={() => handleQueryChange(tag)}
                  className="px-3 py-1.5 bg-white border border-[#e1bfb5]/30 rounded-full text-xs font-semibold text-[#594139] hover:bg-[#fff1ed] hover:border-[#ab3500] transition-all cursor-pointer"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Search Results */}
      <main className="px-4 mt-6">
        {loading ? (
          <div className="py-12 text-center text-[#8d7168]">
            <div className="w-6 h-6 border-2 border-[#ab3500] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs">Searching menu items...</p>
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="space-y-3">
            {filteredItems.map(item => (
              <div
                key={item.id}
                onClick={() => navigate(`/item/${item.id}`)}
                className="bg-white p-4 rounded-2xl border border-[#e1bfb5]/30 shadow-sm flex items-center justify-between gap-4 cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-extrabold text-[#ab3500] uppercase tracking-wider">{item.category || 'General'}</span>
                  <h3 className="font-bold text-[#261814] text-base truncate mt-0.5">{item.name}</h3>
                  <p className="text-xs text-[#594139] mt-1 line-clamp-1">{item.description}</p>
                  <p className="text-sm font-extrabold text-[#ab3500] mt-2">Rs. {item.price}</p>
                </div>
                {item.image_url && (
                  <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border border-[#e1bfb5]/20">
                    <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-8 rounded-3xl border border-[#e1bfb5]/30 text-center space-y-3 shadow-sm">
            <div className="w-16 h-16 bg-[#fff1ed] rounded-2xl flex items-center justify-center mx-auto text-[#ab3500]">
              <Icon name="search_off" size={32} />
            </div>
            <h4 className="font-bold text-[#261814] text-base">No Items Found</h4>
            <p className="text-xs text-[#594139] max-w-xs mx-auto">
              {query ? `No menu items matching "${query}".` : 'No food items available in the system yet. Registered restaurants will list their dishes here!'}
            </p>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  )
}
