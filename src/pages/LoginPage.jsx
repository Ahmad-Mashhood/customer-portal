import { useState, useRef, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Icon from '../components/Icon'
import logo from '../assets/logo_transparent.png'
import API from '../api'
import { loginWithGoogle } from '../api/googleAuth'

/* ── Google SVG ──────────────────────────────────────────────── */
const GoogleSVG = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
)

/* ── OTP View ────────────────────────────────────────────────── */
function OTPView({ onBack }) {
  const inputs = useRef([])
  const navigate = useNavigate()

  const handleInput = (e, idx) => {
    if (e.target.value && idx < 3) inputs.current[idx + 1]?.focus()
  }
  const handleKeyDown = (e, idx) => {
    if (e.key === 'Backspace' && !e.target.value && idx > 0) inputs.current[idx - 1]?.focus()
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h4 className="text-[20px] leading-[28px] font-semibold text-[#261814]">Verify Identity</h4>
        <p className="text-[14px] text-[#594139] mt-2">We sent a magic code to your inbox</p>
      </div>
      <div className="flex justify-between gap-3 px-4">
        {[0,1,2,3].map(i => (
          <input
            key={i}
            ref={el => inputs.current[i] = el}
            className="otp-input w-14 h-16 bg-[#fff1ed] border-none rounded-2xl text-center text-[24px] font-bold text-[#261814] focus:ring-2 focus:ring-[#ab3500]/20 transition-all"
            maxLength={1}
            type="text"
            onInput={e => handleInput(e, i)}
            onKeyDown={e => handleKeyDown(e, i)}
          />
        ))}
      </div>
      <div className="text-center space-y-4">
        <button
          onClick={() => navigate('/home')}
          className="w-full py-4 bg-[#ab3500] text-white rounded-full text-[20px] font-semibold shadow-lg active:scale-95 transition-transform"
        >
          Verify &amp; Continue
        </button>
        <p className="text-[14px] text-[#594139]">
          Didn't get it?{' '}
          <button className="text-[#ab3500] font-bold hover:underline">Resend Magic Code</button>
        </p>
        <button onClick={onBack} className="text-[14px] text-[#594139] hover:text-[#ab3500] transition-colors">
          ← Go back
        </button>
      </div>
    </div>
  )
}

/* ── Login Form ──────────────────────────────────────────────── */
function LoginForm({ onSuccess }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await API.post('/api/auth/login', { email, password })
      const { token, user } = res.data
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user || { email, role: 'customer' }))
      if (onSuccess) onSuccess()
      else navigate('/home')
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleLogin} className="space-y-5">
      {error && (
        <div className="p-3 bg-red-50 text-red-600 text-[14px] rounded-xl text-center font-medium">
          {error}
        </div>
      )}
      <div className="space-y-4">
        {/* Email */}
        <div className="space-y-1.5">
          <label className="text-[14px] font-semibold text-[#261814] ml-1">Email or Phone</label>
          <div className="relative group">
            <Icon name="alternate_email" className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8d7168] group-focus-within:text-[#ab3500] transition-colors" />
            <input
              className="w-full pl-12 pr-4 py-4 bg-[#fff1ed] border-none rounded-xl text-[16px] focus:ring-2 focus:ring-[#ab3500]/20 transition-all placeholder:text-[#8d7168]/50"
              placeholder="genie@magic.com"
              type="text"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
        </div>
        {/* Password */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center px-1">
            <label className="text-[14px] font-semibold text-[#261814]">Password</label>
            <a className="text-[12px] font-bold text-[#ab3500] hover:underline" href="#">Forgot?</a>
          </div>
          <div className="relative group">
            <Icon name="lock" className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8d7168] group-focus-within:text-[#ab3500] transition-colors" />
            <input
              className="w-full pl-12 pr-12 py-4 bg-[#fff1ed] border-none rounded-xl text-[16px] focus:ring-2 focus:ring-[#ab3500]/20 transition-all placeholder:text-[#8d7168]/50"
              placeholder="••••••••"
              type={showPw ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8d7168] hover:text-[#261814]">
              <Icon name={showPw ? 'visibility_off' : 'visibility'} />
            </button>
          </div>
        </div>
      </div>
      <button type="submit" disabled={loading} className="w-full py-4 bg-[#ab3500] text-white rounded-full text-[20px] font-semibold shadow-lg hover:bg-[#ff6b35] transition-all active:scale-95 disabled:opacity-50">
        {loading ? 'Logging In...' : 'Log In'}
      </button>
    </form>
  )
}

/* ── Sign Up Form ────────────────────────────────────────────── */
function SignUpForm({ onSuccess }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSignUp = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await API.post('/api/auth/register', {
        name,
        email,
        password,
        role: 'customer',
        phone
      })
      const { token, user } = res.data
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user || { name, email, role: 'customer' }))
      if (onSuccess) onSuccess()
      else navigate('/home')
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSignUp} className="space-y-5">
      {error && (
        <div className="p-3 bg-red-50 text-red-600 text-[14px] rounded-xl text-center font-medium">
          {error}
        </div>
      )}
      <div className="space-y-4">
        {/* Full Name */}
        <div className="space-y-1.5">
          <label className="text-[14px] font-semibold text-[#261814] ml-1">Full Name</label>
          <div className="relative group">
            <Icon name="person" className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8d7168] group-focus-within:text-[#ab3500] transition-colors" />
            <input
              className="w-full pl-12 pr-4 py-4 bg-[#fff1ed] border-none rounded-xl text-[16px] focus:ring-2 focus:ring-[#ab3500]/20 transition-all placeholder:text-[#8d7168]/50"
              placeholder="Hungry Genie"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label className="text-[14px] font-semibold text-[#261814] ml-1">Email</label>
          <div className="relative group">
            <Icon name="mail" className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8d7168] group-focus-within:text-[#ab3500] transition-colors" />
            <input
              className="w-full pl-12 pr-4 py-4 bg-[#fff1ed] border-none rounded-xl text-[16px] focus:ring-2 focus:ring-[#ab3500]/20 transition-all placeholder:text-[#8d7168]/50"
              placeholder="genie@magic.com"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Phone */}
        <div className="space-y-1.5">
          <label className="text-[14px] font-semibold text-[#261814] ml-1">Phone</label>
          <div className="relative group">
            <Icon name="phone" className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8d7168] group-focus-within:text-[#ab3500] transition-colors" />
            <input
              className="w-full pl-12 pr-4 py-4 bg-[#fff1ed] border-none rounded-xl text-[16px] focus:ring-2 focus:ring-[#ab3500]/20 transition-all placeholder:text-[#8d7168]/50"
              placeholder="+923001234567"
              type="text"
              value={phone}
              onChange={e => setPhone(e.target.value)}
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <label className="text-[14px] font-semibold text-[#261814] ml-1">Password</label>
          <div className="relative group">
            <Icon name="lock" className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8d7168] group-focus-within:text-[#ab3500] transition-colors" />
            <input
              className="w-full pl-12 pr-4 py-4 bg-[#fff1ed] border-none rounded-xl text-[16px] focus:ring-2 focus:ring-[#ab3500]/20 transition-all placeholder:text-[#8d7168]/50"
              placeholder="Min. 8 characters"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
        </div>
      </div>
      <button type="submit" disabled={loading} className="w-full py-4 bg-[#ab3500] text-white rounded-full text-[20px] font-semibold shadow-lg hover:bg-[#ff6b35] transition-all active:scale-95 disabled:opacity-50">
        {loading ? 'Creating Account...' : 'Create Account'}
      </button>
    </form>
  )
}

/* ── LoginPage ───────────────────────────────────────────────── */
export default function LoginPage() {
  const [tab, setTab] = useState('login') // 'login' | 'signup'
  const [showOtp, setShowOtp] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [googleError, setGoogleError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const handleAuthMessage = (event) => {
      if (event.origin !== window.location.origin) return
      if (event.data?.type === 'SOCIAL_AUTH_SUCCESS') {
        const { token, user } = event.data
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))
        navigate('/home')
      }
    }
    window.addEventListener('message', handleAuthMessage)
    return () => window.removeEventListener('message', handleAuthMessage)
  }, [navigate])

  const handleGoogleLogin = async () => {
    setGoogleLoading(true)
    setGoogleError(null)
    try {
      await loginWithGoogle('customer')
      navigate('/home')
    } catch (err) {
      setGoogleError(err.message || 'Google login failed')
    } finally {
      setGoogleLoading(false)
    }
  }

  const handleSocialLogin = (provider) => {
    if (provider === 'google') {
      handleGoogleLogin()
      return
    }
    const width = 500
    const height = 600
    const left = window.screenX + (window.outerWidth - width) / 2
    const top = window.screenY + (window.outerHeight - height) / 2
    
    window.open(
      `/mock-auth/${provider}`,
      `Sign in with ${provider}`,
      `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,scrollbars=yes`
    )
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4 md:p-12 lg:p-0 bg-[#fff8f6]">
      <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row bg-[#fff8f6] rounded-[32px] overflow-hidden shadow-2xl lg:h-[800px]">

        {/* ── Branding Panel (desktop only) ──────────────────── */}
        <div className="hidden lg:flex lg:w-1/2 relative bg-[#ff6b35] p-20 flex-col justify-between overflow-hidden">
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#ab3500] rounded-full blur-[100px]" />
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#b7102a] rounded-full blur-[100px]" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-12">
              <div className="w-14 h-14 bg-white rounded-2xl p-2 shadow-sm flex items-center justify-center border border-white/20">
                <img src={logo} alt="Food Genie" className="w-full h-full object-contain" />
              </div>
              <h1 className="text-[40px] font-extrabold text-white tracking-tight">Food Genie</h1>
            </div>
            <h2 className="text-[32px] font-bold text-white max-w-md leading-tight">
              Magical flavors, delivered to your doorstep in a blink.
            </h2>
          </div>
          <div className="relative z-10 my-4">
            <div className="w-72 h-72 mx-auto rounded-3xl overflow-hidden shadow-2xl transform -rotate-2 hover:rotate-0 transition-transform duration-500 bg-white flex items-center justify-center p-6 border border-[#e1bfb5]/10">
              <img src={logo} alt="Food Genie Logo" className="w-full h-full object-contain" />
            </div>
          </div>
          <div className="relative z-10 mt-6">
            <p className="text-[18px] text-white/80">Join 1M+ food lovers enjoying the genie experience.</p>
          </div>
        </div>

        {/* ── Auth Panel ─────────────────────────────────────── */}
        <div className="w-full lg:w-1/2 flex items-center justify-center bg-[#fff8f6] p-6 md:p-12 overflow-y-auto">
          <div className="w-full max-w-[420px] space-y-8">

            {/* Header */}
            <div className="text-left">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-white rounded-2xl p-2 shadow-sm flex items-center justify-center border border-[#e1bfb5]/20 flex-shrink-0">
                  <img src={logo} alt="Food Genie" className="w-full h-full object-contain" />
                </div>
                <div>
                  <h3 className="text-[22px] font-bold text-[#261814] leading-tight">
                    {showOtp ? 'Verify Identity' : tab === 'login' ? 'Welcome Back!' : 'Create Account'}
                  </h3>
                  <p className="text-[14px] text-[#594139] mt-0.5">
                    {showOtp ? '' : tab === 'login' ? 'Enter your details to satisfy your cravings.' : 'Start your magical culinary journey today.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Tab toggle */}
            {!showOtp && (
              <div className="bg-[#fff1ed] p-1.5 rounded-full flex gap-1 relative">
                <div
                  className="absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-white shadow-sm rounded-full transition-all duration-300 ease-out"
                  style={{ left: tab === 'login' ? '6px' : 'calc(50%)' }}
                />
                <button onClick={() => setTab('login')} className={`relative z-10 flex-1 py-3 text-[14px] font-semibold transition-colors ${tab === 'login' ? 'text-[#ab3500]' : 'text-[#594139]'}`}>Login</button>
                <button onClick={() => setTab('signup')} className={`relative z-10 flex-1 py-3 text-[14px] font-semibold transition-colors ${tab === 'signup' ? 'text-[#ab3500]' : 'text-[#594139]'}`}>Sign Up</button>
              </div>
            )}

            {/* Forms */}
            <div className="space-y-6">
              {showOtp ? (
                <OTPView onBack={() => setShowOtp(false)} />
              ) : tab === 'login' ? (
                <LoginForm onSuccess={() => navigate('/home')} />
              ) : (
                <SignUpForm onSuccess={() => navigate('/home')} />
              )}

              {!showOtp && (
                <>
                  {/* Divider */}
                  <div className="flex items-center gap-4 py-2">
                    <div className="h-px flex-1 bg-[#e1bfb5]/30" />
                    <span className="text-[12px] font-bold text-[#8d7168] uppercase tracking-widest">or</span>
                    <div className="h-px flex-1 bg-[#e1bfb5]/30" />
                  </div>
                  {googleError && (
                    <div className="p-3 bg-red-50 text-red-600 text-[13px] rounded-xl text-center font-medium">
                      {googleError}
                    </div>
                  )}
                  {/* Social */}
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={handleGoogleLogin}
                      disabled={googleLoading}
                      className="flex items-center justify-center gap-2 py-3.5 bg-white border border-[#e1bfb5]/50 rounded-full hover:bg-[#fff1ed] transition-colors active:scale-95 cursor-pointer disabled:opacity-50"
                    >
                      <img
                        src="https://developers.google.com/identity/images/g-logo.png"
                        width="20"
                        height="20"
                        alt="Google"
                      />
                      <span className="text-[14px] font-semibold text-slate-800">
                        {googleLoading ? 'Signing in...' : 'Google'}
                      </span>
                    </button>
                    <button
                      onClick={() => handleSocialLogin('facebook')}
                      className="flex items-center justify-center gap-2 py-3.5 bg-white border border-[#e1bfb5]/50 rounded-full hover:bg-[#fff1ed] transition-colors active:scale-95 cursor-pointer"
                    >
                      <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                      <span className="text-[14px] font-semibold text-slate-800">Facebook</span>
                    </button>
                  </div>
                  {/* Guest */}
                  <div className="text-center pt-2">
                    <button onClick={() => navigate('/home')} className="text-[14px] font-semibold text-[#594139] hover:text-[#ab3500] transition-colors flex items-center justify-center gap-1 mx-auto">
                      Continue as Guest
                      <Icon name="arrow_forward" size={16} />
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="pt-4 text-center">
              <p className="text-[14px] text-[#8d7168]">
                By continuing, you agree to our{' '}
                <Link className="text-[#261814] underline" to="/terms">Terms of Service</Link> &amp;{' '}
                <Link className="text-[#261814] underline" to="/privacy">Privacy Policy</Link>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
