import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Logo, C } from '../components/ui'
import { useAuth } from '../context/AuthContext'
import { useLang } from '../context/LangContext'

const ROLES = [
  { id:'student',    icon:'🎓', bn:'ছাত্র/ছাত্রী',       en:'Student',          email:'student@bhobishyot.edu.bd'  },
  { id:'parent',     icon:'👨‍👩‍👧', bn:'অভিভাবক',          en:'Parent',           email:'parent@bhobishyot.edu.bd'   },
  { id:'teacher',    icon:'👩‍🏫', bn:'শিক্ষক',             en:'Teacher',          email:'teacher@bhobishyot.edu.bd'  },
  { id:'admin',      icon:'🏫', bn:'বিদ্যালয় প্রশাসক',  en:'School Admin',     email:'admin@bhobishyot.edu.bd'    },
  { id:'government', icon:'🏛️', bn:'সরকারি কর্মকর্তা', en:'Government Officer',email:'gov@bhobishyot.edu.bd'      },
]

export default function LoginPage() {
  const { login } = useAuth()
  const { lang, setLang } = useLang()
  const navigate = useNavigate()
  const [selectedRole, setSelectedRole] = useState('student')
  const [email, setEmail] = useState(ROLES[0].email)
  const [password, setPassword] = useState('demo123')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId)
    const role = ROLES.find(r => r.id === roleId)
    if (role) setEmail(role.email)
    setError('')
  }

  const handleLogin = async () => {
    setLoading(true)
    setError('')
    try {
      const user = await login(email, password)
      const defaultTab: Record<string, string> = {
        student:'overview', parent:'overview', teacher:'overview',
        admin:'overview', government:'national',
      }
      navigate(`/dashboard/${user.role}?tab=${defaultTab[user.role]}`)
    } catch {
      setError(lang==='bn'?'ইমেইল বা পাসওয়ার্ড ভুল।':'Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight:'100vh', display:'flex', fontFamily:"'Hind Siliguri',sans-serif" }}>
      {/* Left panel */}
      <div style={{ flex:'0 0 42%', background:`linear-gradient(160deg, #003d32 0%, #005C4B 45%, #003d32 100%)`, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:48, position:'relative', overflow:'hidden' }}>
        {[200,300,400].map(s => (
          <div key={s} style={{ position:'absolute', width:s, height:s, border:'1px solid rgba(255,255,255,0.06)', borderRadius:'50%', top:'50%', left:'50%', transform:'translate(-50%,-50%)' }} />
        ))}
        <style>{`@keyframes float{from{transform:translateY(0)}to{transform:translateY(-12px)}}`}</style>
        {Array.from({length:12}).map((_,i) => (
          <div key={i} style={{ position:'absolute', width:3, height:3, borderRadius:'50%', background:i%3===0?'#E8A020':'rgba(255,255,255,0.3)', top:`${10+Math.random()*80}%`, left:`${5+Math.random()*90}%`, animation:`float ${3+Math.random()*4}s ease-in-out ${Math.random()*3}s infinite alternate` }} />
        ))}
        <div style={{ textAlign:'center', position:'relative', zIndex:1 }}>
          <Logo size={72} variant="full" theme="dark" showTagline={true} />
          <div style={{ marginTop:32, padding:'16px 24px', background:'rgba(255,255,255,0.06)', borderRadius:12, backdropFilter:'blur(10px)', border:'1px solid rgba(255,255,255,0.1)' }}>
            <p style={{ color:'rgba(255,255,255,0.7)', fontSize:14, margin:0, fontStyle:'italic' }}>
              {lang==='bn'?'"শিক্ষার আলো, সবার জন্য"':'"Education for All"'}
            </p>
          </div>
          <div style={{ marginTop:24, display:'flex', flexDirection:'column', gap:8 }}>
            {['৪ কোটি ২০ লক্ষ শিক্ষার্থী','১,৫২,০০০ বিদ্যালয়','৮টি বিভাগ · ৬৪টি জেলা'].map((s,i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:8, color:'rgba(255,255,255,0.55)', fontSize:12 }}>
                <div style={{ width:4, height:4, borderRadius:'50%', background:'#E8A020' }} />{s}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div style={{ flex:1, background:C.warm, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:48, position:'relative' }}>
        <div style={{ position:'absolute', top:24, right:24, display:'flex', background:C.muted, borderRadius:9999, padding:3 }}>
          {(['en','bn'] as const).map(l => (
            <button key={l} onClick={() => setLang(l)}
              style={{ padding:'4px 12px', borderRadius:9999, border:'none', background:lang===l?C.forest:'transparent', color:lang===l?'#fff':'#666', fontSize:12, fontWeight:600, cursor:'pointer', fontFamily:"'Hind Siliguri',sans-serif" }}>
              {l==='en'?'EN':'বাং'}
            </button>
          ))}
        </div>

        <div style={{ width:'100%', maxWidth:480 }}>
          <h1 style={{ fontFamily:"'Sora',sans-serif", fontSize:26, fontWeight:700, color:C.dark, marginBottom:6 }}>
            {lang==='bn'?'আপনার অ্যাকাউন্টে প্রবেশ করুন':'Sign In to Your Account'}
          </h1>
          <p style={{ color:'#888', fontSize:13, marginBottom:28 }}>
            {lang==='bn'?'আপনার ভূমিকা নির্বাচন করুন':'Select your role to continue'}
          </p>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:24 }}>
            {ROLES.map(r => (
              <button key={r.id} onClick={() => handleRoleSelect(r.id)}
                style={{ padding:'12px 14px', borderRadius:10, border:`2px solid ${selectedRole===r.id?C.forest:C.muted}`, background:selectedRole===r.id?C.successBg:C.paper, cursor:'pointer', display:'flex', gap:10, alignItems:'center', transition:'all 0.15s' }}>
                <span style={{ fontSize:20 }}>{r.icon}</span>
                <div style={{ textAlign:'left' }}>
                  <div style={{ fontFamily:"'Hind Siliguri',sans-serif", fontSize:13, fontWeight:700, color:selectedRole===r.id?C.forest:C.dark }}>{lang==='bn'?r.bn:r.en}</div>
                </div>
                {selectedRole===r.id && <span style={{ marginLeft:'auto', color:C.forest }}>✓</span>}
              </button>
            ))}
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:12, marginBottom:20 }}>
            <div>
              <label style={{ fontSize:13, fontWeight:600, color:C.dark, display:'block', marginBottom:6 }}>{lang==='bn'?'ইমেইল':'Email'}</label>
              <input value={email} onChange={e => setEmail(e.target.value)}
                style={{ width:'100%', padding:'11px 14px', borderRadius:8, border:`1.5px solid ${C.muted}`, fontSize:14, background:C.paper, color:C.dark, boxSizing:'border-box', fontFamily:"'Plus Jakarta Sans',sans-serif" }} />
            </div>
            <div>
              <label style={{ fontSize:13, fontWeight:600, color:C.dark, display:'block', marginBottom:6 }}>{lang==='bn'?'পাসওয়ার্ড':'Password'}</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key==='Enter' && handleLogin()}
                style={{ width:'100%', padding:'11px 14px', borderRadius:8, border:`1.5px solid ${C.muted}`, fontSize:14, background:C.paper, color:C.dark, boxSizing:'border-box', fontFamily:"'Plus Jakarta Sans',sans-serif" }} />
            </div>
          </div>

          {error && (
            <div style={{ padding:'10px 14px', background:C.dangerBg, borderRadius:8, color:C.danger, fontSize:13, fontFamily:"'Hind Siliguri',sans-serif", marginBottom:12 }}>
              {error}
            </div>
          )}

          <button onClick={handleLogin} disabled={loading}
            style={{ width:'100%', padding:13, background:`linear-gradient(135deg, ${C.forest}, ${C.emerald})`, color:'#fff', border:'none', borderRadius:10, fontSize:15, fontWeight:700, cursor:loading?'not-allowed':'pointer', opacity:loading?0.7:1, fontFamily:"'Hind Siliguri',sans-serif", boxShadow:'0 4px 20px rgba(0,92,75,0.3)', marginBottom:12 }}>
            {loading?(lang==='bn'?'প্রবেশ করছে...':'Signing in...'):(lang==='bn'?'প্রবেশ করুন →':'Sign In →')}
          </button>
          <p style={{ textAlign:'center', fontSize:11, color:'#aaa' }}>
            {lang==='bn'?'ডেমো পাসওয়ার্ড: demo123':'Demo password: demo123'}
          </p>
        </div>
      </div>
    </div>
  )
}
