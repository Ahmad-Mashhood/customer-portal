import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Icon from '../components/Icon'
import BottomNav from '../components/BottomNav'

const POPULAR_SEARCHES = ['Biryani', 'Burger', 'Pizza', 'Karahi', 'Dessert', 'Healthy']

const SEARCHABLE_ITEMS = [
  { id: 'mi1', name: "Genie's Special Biryani", price: 450, category: 'Biryani', desc: 'Our signature spiced basmati rice with tender chicken.', img: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200&q=80' },
  { id: 'mi2', name: 'Chicken Karahi', price: 850, category: 'Desi', desc: 'Traditional spicy chicken curry with ginger and green chilies.', img: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=200&q=80' },
  { id: 'mi3', name: 'Double Truffle Burger', price: 849, category: 'Fast Food', desc: 'Juicy double patty with melted cheddar and truffle aioli.', img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&q=80' },
  { id: 'mi4', name: 'Margherita Pizza', price: 790, category: 'Pizza', desc: 'Fresh basil, rich tomato sauce, and double mozzarella cheese.', img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&q=80' },
  { id: 'mi5', name: 'Hot Tomato Soup', price: 320, category: 'Healthy', desc: 'Warm cream of garden-fresh tomatoes and garlic croutons.', img: 'https://images.unsplash.com/photo-1547592165-e1d17fed6005?w=200&q=80' },
  { id: 'mi6', name: 'Chocolate Fudge Cake', price: 290, category: 'Desserts', desc: 'Rich and moist multi-layered chocolate cake slice.', img: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200&q=80' },
  { id: 'mi7', name: 'Crispy Chicken Wrap', price: 390, category: 'Wraps', desc: 'Crispy chicken tenders with lettuce and dynamic mayo.', img: 'https://images.unsplash.com/photo-1626700051175-6518c4793f06?w=200&q=80' },
]

/* ── Levenshtein Distance & Fuzzy Match Helpers ────────────────── */
function getLevenshteinDistance(a, b) {
  if (a.length === 0) return b.length
  if (b.length === 0) return a.length

  const matrix = []

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i]
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          Math.min(
            matrix[i][j - 1] + 1, // insertion
            matrix[i - 1][j] + 1  // deletion
          )
        )
      }
    }
  }

  return matrix[b.length][a.length]
}

function isFuzzyWordMatch(queryWord, textWord) {
  const qLen = queryWord.length
  const tLen = textWord.length
  if (Math.abs(qLen - tLen) > 2) return false

  const dist = getLevenshteinDistance(queryWord, textWord)
  if (qLen <= 4) {
    return dist <= 1
  }
  return dist <= 2
}

function isFuzzyMatch(query, item) {
  const cleanQuery = query.toLowerCase().replace(/[^\w\s]/g, '').trim()
  if (!cleanQuery) return true

  const textToSearch = `${item.name} ${item.desc} ${item.category}`.toLowerCase().replace(/[^\w\s]/g, '')

  // Direct substring match
  if (textToSearch.includes(cleanQuery)) return true

  const queryWords = cleanQuery.split(/\s+/).filter(w => w.length >= 2)
  const textWords = textToSearch.split(/\s+/).filter(w => w.length >= 2)

  return queryWords.every(qWord => {
    if (textToSearch.includes(qWord)) return true
    return textWords.some(tWord => isFuzzyWordMatch(qWord, tWord))
  })
}

export default function SearchPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const queryParam = searchParams.get('q') || ''

  const [query, setQuery] = useState(queryParam)
  const [activeCategory, setActiveCategory] = useState(null)

  // Sync state if URL query param changes (e.g. going back/forward)
  useEffect(() => {
    setQuery(queryParam)
  }, [queryParam])

  const handleQueryChange = (val) => {
    setQuery(val)
    setSearchParams(val ? { q: val } : {})
  }

  const filteredItems = SEARCHABLE_ITEMS.filter(item => {
    const matchesQuery = isFuzzyMatch(query, item)
    const matchesCategory = activeCategory ? item.category === activeCategory : true
    return matchesQuery && matchesCategory
  })

  return (
    <div className="pb-28 min-h-screen bg-[#fff8f6]">
      {/* Top Header */}
      <header className="sticky top-0 z-50 bg-[#fff8f6]/80 backdrop-blur-md px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon name="location_on" className="text-[#ab3500]" />
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-[#594139] uppercase tracking-wider">Deliver to</span>
            <span className="text-sm font-bold text-[#261814]">Home, Karachi</span>
          </div>
        </div>
        <h1 className="text-lg font-extrabold text-[#ab3500] tracking-tight">Food Genie</h1>
      </header>

      {/* Search Input */}
      <div className="px-4 mt-2">
        <div className="relative">
          <Icon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-[#594139]" />
          {query && (
            <button 
              onClick={() => handleQueryChange('')} 
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8d7168] hover:text-[#261814] p-1 cursor-pointer"
            >
              <Icon name="close" size={18} />
            </button>
          )}
          <input
            className="w-full h-14 pl-12 pr-12 bg-[#fff1ed] border-none rounded-xl text-sm focus:ring-2 focus:ring-[#ab3500] placeholder:text-[#594139]/60 outline-none"
            placeholder="Search food items, categories, or cravings..."
            type="text"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
          />
        </div>
      </div>

      {/* Popular Chips */}
      <div className="px-4 mt-6">
        <h3 className="text-sm font-bold text-[#594139] uppercase tracking-wider mb-3">Popular Searches</h3>
        <div className="flex flex-wrap gap-2">
          {POPULAR_SEARCHES.map(term => (
            <button
              key={term}
              onClick={() => {
                handleQueryChange(term)
                setActiveCategory(null)
              }}
              className="px-4 py-2 bg-white rounded-full text-xs font-semibold border border-[#e1bfb5]/40 hover:bg-[#ffe9e3] hover:border-[#ab3500] transition-colors cursor-pointer text-[#261814]"
            >
              {term}
            </button>
          ))}
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="px-4 mt-6">
        <div className="flex overflow-x-auto gap-2 hide-scrollbar pb-2">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-5 py-2 rounded-full text-xs font-semibold border transition-all cursor-pointer whitespace-nowrap ${
              !activeCategory 
                ? 'bg-[#ab3500] text-white border-[#ab3500]' 
                : 'bg-white text-[#594139] border-[#e1bfb5]/40 hover:bg-[#fff1ed]'
            }`}
          >
            All Categories
          </button>
          {Array.from(new Set(SEARCHABLE_ITEMS.map(i => i.category))).map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-xs font-semibold border transition-all cursor-pointer whitespace-nowrap ${
                activeCategory === cat 
                  ? 'bg-[#ab3500] text-white border-[#ab3500]' 
                  : 'bg-white text-[#594139] border-[#e1bfb5]/40 hover:bg-[#fff1ed]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Search Results */}
      <div className="px-4 mt-6 space-y-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-[18px] font-bold text-[#261814]">
            {query || activeCategory ? 'Search Results' : 'Explore Cravings'}
          </h2>
          <span className="text-xs text-[#8d7168] font-semibold">{filteredItems.length} items found</span>
        </div>

        {filteredItems.length > 0 ? (
          <div className="space-y-4">
            {filteredItems.map(item => (
              <div 
                key={item.id} 
                onClick={() => navigate(`/item/${item.id}`)}
                className="bg-white p-4 rounded-2xl flex gap-4 border border-[#e1bfb5]/30 shadow-sm cursor-pointer hover:shadow-md transition-shadow duration-200"
              >
                <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-[#ffe9e3]">
                  <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-[#261814] text-base">{item.name}</h4>
                      <span className="text-[#ab3500] font-bold text-sm">Rs. {item.price}</span>
                    </div>
                    <p className="text-[#594139] text-xs mt-1 line-clamp-2">{item.desc}</p>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-[10px] bg-[#fff1ed] text-[#ab3500] font-bold px-2 py-0.5 rounded uppercase">
                      {item.category}
                    </span>
                    <span className="text-[10px] text-[#8d7168] flex items-center gap-1 font-semibold">
                      <Icon name="auto_awesome" size={12} className="text-[#c98f00]" />
                      Genie Choice
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center space-y-4">
            <div className="w-16 h-16 bg-[#fff1ed] rounded-full flex items-center justify-center mx-auto text-[#ab3500]">
              <Icon name="search_off" size={32} />
            </div>
            <div>
              <p className="font-bold text-[#261814] text-lg">No cravings found</p>
              <p className="text-[#594139] text-sm mt-1">Try refining your search keyword or selecting a different category.</p>
            </div>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
