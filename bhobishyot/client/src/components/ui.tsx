import { ReactNode, CSSProperties } from 'react'

export const C = {
  forest: '#005C4B', gold: '#E8A020', emerald: '#00876A',
  dark: '#0A1628', navy: '#112240', warm: '#F8F4EE',
  paper: '#FFFFFF', muted: '#EDE8DF',
  success: '#1A7A4A', successBg: '#E8F5EE',
  warning: '#C47D0E', warningBg: '#FEF3DC',
  danger: '#C0392B', dangerBg: '#FDECEA',
  info: '#1A5276', infoBg: '#EAF2FB',
}

export const CHART_COLORS = ['#005C4B','#E8A020','#2E86AB','#A23B72','#F18F01','#C73E1D']

export const SUBJECT_COLORS: Record<string, string> = {
  'গণিত': '#005C4B', 'বাংলা': '#E8A020', 'ইংরেজি': '#2E86AB',
  'বিজ্ঞান': '#A23B72', 'সমাজ বিজ্ঞান': '#F18F01',
  'আইসিটি': '#1A5276', 'ধর্ম': '#8B5E04', 'কৃষি': '#3D7A1A',
}

// ─── Logo ─────────────────────────────────────────────────────────────────────
export const Logo = ({ size = 36, variant = 'compact', theme = 'dark', showTagline = false }: {
  size?: number; variant?: 'mark' | 'compact' | 'full'; theme?: 'dark' | 'light'; showTagline?: boolean
}) => {
  const textColor = theme === 'dark' ? '#FFFFFF' : '#005C4B'
  const taglineColor = theme === 'dark' ? 'rgba(255,255,255,0.5)' : 'rgba(0,92,75,0.55)'
  const Mark = () => (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <defs>
        <linearGradient id="rg1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#004D3A"/><stop offset="100%" stopColor="#3DBE7A"/>
        </linearGradient>
        <linearGradient id="ag1" x1="0.5" y1="1" x2="0.5" y2="0">
          <stop offset="0%" stopColor="#1A7A4A"/><stop offset="100%" stopColor="#4CAF7D"/>
        </linearGradient>
        <linearGradient id="sg1" x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#F5C518"/><stop offset="100%" stopColor="#E8870A"/>
        </linearGradient>
      </defs>
      <path d="M50 14 A36 36 0 1 1 20 66 Q18 78 28 80 Q38 82 50 76" stroke="url(#rg1)" strokeWidth="7" strokeLinecap="round" fill="none"/>
      <path d="M50 14 A36 36 0 0 1 80 66 Q82 78 72 80 Q62 82 50 76" stroke="url(#rg1)" strokeWidth="7" strokeLinecap="round" fill="none"/>
      <path d="M50 24 A26 26 0 1 1 28 63 Q26 72 34 73 Q42 74 50 70" stroke="url(#rg1)" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.65"/>
      <path d="M50 24 A26 26 0 0 1 72 63 Q74 72 66 73 Q58 74 50 70" stroke="url(#rg1)" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.65"/>
      <path d="M50 30 L39 54 L45 54 L45 72 L55 72 L55 54 L61 54 Z" fill="url(#ag1)"/>
      <path d="M50 4 L53.5 10 L60 12 L53.5 14 L50 20 L46.5 14 L40 12 L46.5 10 Z" fill="url(#sg1)"/>
    </svg>
  )
  if (variant === 'mark') return <Mark />
  return (
    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
      <Mark />
      <div style={{ display:'flex', flexDirection:'column', gap:1 }}>
        <span style={{ fontFamily:"'Hind Siliguri',sans-serif", fontSize:size*0.7, fontWeight:700, color:textColor, lineHeight:1 }}>ভবিষ্যৎ</span>
        {variant === 'full' && <span style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:size*0.22, fontWeight:600, letterSpacing:'0.14em', textTransform:'uppercase', color:'#E8A020' }}>BHOBISHYOT</span>}
        {showTagline && <span style={{ fontFamily:"'Hind Siliguri',sans-serif", fontSize:size*0.18, color:taglineColor, marginTop:2 }}>আজকের মূল্যায়ন আগামীর সফলতা</span>}
      </div>
    </div>
  )
}

// ─── Badge ────────────────────────────────────────────────────────────────────
type BadgeColor = 'green'|'amber'|'red'|'blue'|'gold'|'grey'|'navy'
export const Badge = ({ children, color = 'green', size = 'sm' }: { children: ReactNode; color?: BadgeColor; size?: 'sm'|'md' }) => {
  const colors: Record<BadgeColor, { bg: string; text: string }> = {
    green: { bg: C.successBg, text: C.success },
    amber: { bg: C.warningBg, text: C.warning },
    red:   { bg: C.dangerBg,  text: C.danger  },
    blue:  { bg: C.infoBg,    text: C.info    },
    gold:  { bg: '#FEF3DC',   text: '#8B5E04' },
    grey:  { bg: '#F0F0F0',   text: '#555'    },
    navy:  { bg: C.navy,      text: '#fff'    },
  }
  const c = colors[color]
  return (
    <span style={{ background:c.bg, color:c.text, padding:size==='sm'?'2px 8px':'3px 10px', borderRadius:9999, fontSize:size==='sm'?11:12, fontWeight:600, fontFamily:"'Plus Jakarta Sans',sans-serif", whiteSpace:'nowrap' }}>
      {children}
    </span>
  )
}

export const AIBadge = () => (
  <span style={{ background:'#FEF3DC', color:'#8B5E04', padding:'1px 6px', borderRadius:9999, fontSize:10, fontWeight:700, letterSpacing:'0.05em' }}>✦ AI</span>
)

// ─── Card ─────────────────────────────────────────────────────────────────────
export const Card = ({ children, style = {} }: { children: ReactNode; style?: CSSProperties }) => (
  <div style={{ background:C.paper, border:`1px solid ${C.muted}`, borderRadius:12, padding:20, boxShadow:'0 2px 8px rgba(0,0,0,0.07)', ...style }}>
    {children}
  </div>
)

// ─── KPI Card ─────────────────────────────────────────────────────────────────
export const KPICard = ({ label, value, sub, color = C.forest, icon = '📊', trend }: {
  label: string; value: string | number; sub?: string; color?: string; icon?: string; trend?: number
}) => (
  <div style={{ background:C.paper, border:`1px solid ${C.muted}`, borderRadius:12, padding:'18px 20px', boxShadow:'0 2px 8px rgba(0,0,0,0.07)', display:'flex', flexDirection:'column', gap:6, minWidth:0 }}>
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
      <span style={{ fontSize:22 }}>{icon}</span>
      {trend !== undefined && <span style={{ fontSize:11, color:trend>0?C.success:C.danger, fontWeight:600 }}>{trend>0?'↑':'↓'}{Math.abs(trend)}%</span>}
    </div>
    <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:26, fontWeight:700, color }}>{value}</div>
    <div style={{ fontFamily:"'Hind Siliguri',sans-serif", fontSize:13, color:'#666', fontWeight:500 }}>{label}</div>
    {sub && <div style={{ fontSize:11, color:'#999' }}>{sub}</div>}
  </div>
)

// ─── Section Title ─────────────────────────────────────────────────────────────
export const SectionTitle = ({ children, badge }: { children: ReactNode; badge?: ReactNode }) => (
  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:16 }}>
    <h3 style={{ fontFamily:"'Sora',sans-serif", fontSize:15, fontWeight:700, color:C.dark, margin:0 }}>{children}</h3>
    {badge}
  </div>
)

// ─── Button ───────────────────────────────────────────────────────────────────
type BtnVariant = 'primary'|'gold'|'ghost'|'danger'|'muted'
export const Btn = ({ children, onClick, variant = 'primary', size = 'md', style = {}, disabled = false }: {
  children: ReactNode; onClick?: () => void; variant?: BtnVariant; size?: 'sm'|'md'|'lg'; style?: CSSProperties; disabled?: boolean
}) => {
  const variants: Record<BtnVariant, CSSProperties> = {
    primary: { background:C.forest, color:'#fff', border:'none' },
    gold:    { background:C.gold,   color:C.dark, border:'none' },
    ghost:   { background:'transparent', color:C.forest, border:`1.5px solid ${C.forest}` },
    danger:  { background:C.danger, color:'#fff', border:'none' },
    muted:   { background:C.muted,  color:'#555', border:'none' },
  }
  const sizes = { sm:{ padding:'6px 14px', fontSize:12 }, md:{ padding:'9px 20px', fontSize:13 }, lg:{ padding:'12px 28px', fontSize:14 } }
  return (
    <button onClick={onClick} disabled={disabled}
      style={{ ...variants[variant], ...sizes[size], borderRadius:8, fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:600, cursor:disabled?'not-allowed':'pointer', opacity:disabled?0.6:1, transition:'all 0.15s', ...style }}>
      {children}
    </button>
  )
}

// ─── Tab Bar ─────────────────────────────────────────────────────────────────
export const TabBar = ({ tabs, active, onSelect, small = false }: {
  tabs: { id: string; label: string }[]; active: string; onSelect: (id: string) => void; small?: boolean
}) => (
  <div style={{ display:'flex', gap:4, borderBottom:`2px solid ${C.muted}`, marginBottom:20, overflowX:'auto', flexShrink:0 }}>
    {tabs.map(t => (
      <button key={t.id} onClick={() => onSelect(t.id)}
        style={{ padding:small?'6px 14px':'8px 18px', fontSize:small?12:13, fontFamily:"'Hind Siliguri',sans-serif", fontWeight:600, color:active===t.id?C.forest:'#777', background:'none', border:'none', borderBottom:active===t.id?`3px solid ${C.gold}`:'3px solid transparent', cursor:'pointer', whiteSpace:'nowrap', transition:'all 0.15s', marginBottom:-2 }}>
        {t.label}
      </button>
    ))}
  </div>
)

// ─── Custom Tooltip ───────────────────────────────────────────────────────────
export const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: {color: string; name: string; value: number}[]; label?: string }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background:'#fff', border:`1px solid ${C.muted}`, borderRadius:8, padding:'10px 14px', boxShadow:'0 4px 16px rgba(0,0,0,0.1)', fontSize:12, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
      <p style={{ fontWeight:700, marginBottom:4, color:C.dark }}>{label}</p>
      {payload.map((p, i) => <p key={i} style={{ color:p.color, margin:'2px 0' }}>{p.name}: <strong>{p.value}</strong></p>)}
    </div>
  )
}

// ─── Risk Badge ───────────────────────────────────────────────────────────────
export const RiskBadge = ({ level, lang }: { level: string; lang: string }) => {
  const map: Record<string, { color: BadgeColor; bn: string; en: string }> = {
    high:   { color:'red',   bn:'উচ্চ ঝুঁকি',  en:'High Risk'  },
    medium: { color:'amber', bn:'মধ্যম ঝুঁকি', en:'Med Risk'   },
    low:    { color:'green', bn:'কম ঝুঁকি',    en:'Low Risk'   },
  }
  const r = map[level] || map.low
  return <Badge color={r.color}>{lang==='bn'?r.bn:r.en}</Badge>
}
