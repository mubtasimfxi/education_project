import { useState, useEffect } from 'react'
import { Card, SectionTitle, Badge, Btn, AIBadge, C, SUBJECT_COLORS, CustomTooltip } from '../components/ui'
import { useLang } from '../context/LangContext'
import { getNotices, createNotice, sendMessage, getAssessments } from '../api/client'
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COGNITIVE_DATA = [
  { skill:'বিশ্লেষণ', current:78, previous:72 },
  { skill:'সমস্যা সমাধান', current:82, previous:75 },
  { skill:'স্মৃতিশক্তি', current:71, previous:68 },
  { skill:'সৃজনশীলতা', current:65, previous:60 },
  { skill:'যোগাযোগ', current:74, previous:71 },
  { skill:'সমালোচনা', current:69, previous:65 },
]

export const NoticesTab = () => {
  const { lang } = useLang()
  const [notices, setNotices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getNotices().then(d => { setNotices(d.notices || []); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  if (loading) return <div style={{ padding:40, textAlign:'center', color:'#999', fontFamily:"'Hind Siliguri',sans-serif" }}>{lang==='bn'?'লোড হচ্ছে...':'Loading...'}</div>

  return (
    <div>
      <SectionTitle>{lang==='bn'?'নোটিশ বোর্ড':'Notice Board'}</SectionTitle>
      <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
        {notices.map((n: any) => (
          <Card key={n.id} style={{ borderLeft:`4px solid ${n.priority==='high'?C.danger:n.priority==='important'?C.gold:C.forest}`, padding:'16px 20px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:12, marginBottom:6 }}>
              <h4 style={{ fontFamily:"'Hind Siliguri',sans-serif", fontSize:15, fontWeight:700, color:C.dark, margin:0 }}>{n.title}</h4>
              <div style={{ display:'flex', gap:6, flexShrink:0 }}>
                <Badge color={n.priority==='high'?'red':n.priority==='important'?'gold':'green'}>{n.priority==='high'?'জরুরি':n.priority==='important'?'গুরুত্বপূর্ণ':'সাধারণ'}</Badge>
                <Badge color="grey">{n.scope}</Badge>
              </div>
            </div>
            <p style={{ fontFamily:"'Hind Siliguri',sans-serif", fontSize:13, color:'#555', margin:'0 0 8px' }}>{n.body}</p>
            <div style={{ fontSize:11, color:'#999', display:'flex', gap:12 }}>
              <span>👤 {n.author}</span><span>📅 {n.date}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export const CreateNoticeTab = () => {
  const { lang } = useLang()
  const [form, setForm] = useState({ title:'', body:'', priority:'normal', scope:'বিদ্যালয়' })
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!form.title || !form.body) return
    setLoading(true)
    await createNotice({ ...form, author: lang==='bn'?'সরকারি কর্মকর্তা':'Government Officer' })
    setSent(true)
    setLoading(false)
  }

  return (
    <div>
      <SectionTitle>{lang==='bn'?'নতুন নোটিশ তৈরি করুন':'Create New Notice'}</SectionTitle>
      {sent ? (
        <Card style={{ textAlign:'center', padding:40 }}>
          <div style={{ fontSize:40, marginBottom:12 }}>✅</div>
          <div style={{ fontFamily:"'Hind Siliguri',sans-serif", fontSize:16, fontWeight:600, color:C.success }}>নোটিশ প্রকাশিত হয়েছে!</div>
          <Btn onClick={() => { setSent(false); setForm({ title:'', body:'', priority:'normal', scope:'বিদ্যালয়' }) }} style={{ marginTop:16 }}>
            {lang==='bn'?'নতুন নোটিশ':'New Notice'}
          </Btn>
        </Card>
      ) : (
        <Card>
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            <div>
              <label style={{ fontFamily:"'Hind Siliguri',sans-serif", fontSize:13, fontWeight:600, display:'block', marginBottom:6 }}>{lang==='bn'?'শিরোনাম':'Title'}</label>
              <input value={form.title} onChange={e => setForm({...form, title:e.target.value})} placeholder={lang==='bn'?'নোটিশের শিরোনাম...':'Notice title...'} style={{ width:'100%', padding:'10px 12px', borderRadius:6, border:`1px solid ${C.muted}`, fontSize:14, fontFamily:"'Hind Siliguri',sans-serif", boxSizing:'border-box' as const }} />
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              <div>
                <label style={{ fontFamily:"'Hind Siliguri',sans-serif", fontSize:13, fontWeight:600, display:'block', marginBottom:6 }}>{lang==='bn'?'অগ্রাধিকার':'Priority'}</label>
                <select value={form.priority} onChange={e => setForm({...form, priority:e.target.value})} style={{ width:'100%', padding:'10px 12px', borderRadius:6, border:`1px solid ${C.muted}`, fontSize:13 }}>
                  <option value="normal">সাধারণ</option><option value="important">গুরুত্বপূর্ণ</option><option value="high">জরুরি</option>
                </select>
              </div>
              <div>
                <label style={{ fontFamily:"'Hind Siliguri',sans-serif", fontSize:13, fontWeight:600, display:'block', marginBottom:6 }}>{lang==='bn'?'পরিধি':'Scope'}</label>
                <select value={form.scope} onChange={e => setForm({...form, scope:e.target.value})} style={{ width:'100%', padding:'10px 12px', borderRadius:6, border:`1px solid ${C.muted}`, fontSize:13 }}>
                  <option>বিদ্যালয়</option><option>জেলা</option><option>জাতীয়</option>
                </select>
              </div>
            </div>
            <div>
              <label style={{ fontFamily:"'Hind Siliguri',sans-serif", fontSize:13, fontWeight:600, display:'block', marginBottom:6 }}>{lang==='bn'?'বিবরণ':'Body'}</label>
              <textarea value={form.body} onChange={e => setForm({...form, body:e.target.value})} rows={5} placeholder={lang==='bn'?'নোটিশের বিস্তারিত বিবরণ...':'Notice body...'} style={{ width:'100%', padding:'10px 12px', borderRadius:6, border:`1px solid ${C.muted}`, fontSize:13, fontFamily:"'Hind Siliguri',sans-serif", resize:'vertical' as const, boxSizing:'border-box' as const }} />
            </div>
            <Btn onClick={handleSubmit} disabled={loading} variant="gold">
              {loading?'প্রকাশ হচ্ছে...':(lang==='bn'?'নোটিশ প্রকাশ করুন':'Publish Notice')}
            </Btn>
          </div>
        </Card>
      )}
    </div>
  )
}

export const MessagesTab = ({ inboxMode = false }: { inboxMode?: boolean }) => {
  const { lang } = useLang()
  const [msg, setMsg] = useState({ category:'সমস্যা', subject:'', body:'' })
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const INBOX = [
    { from:'আরিফ হোসেন', role:'ছাত্র', cat:'প্রশ্ন', subject:'পরীক্ষার সময়সূচি', preview:'আগামী পরীক্ষার সময়সূচি কবে প্রকাশ পাবে?', time:'২ ঘণ্টা আগে', unread:true },
    { from:'রোকেয়া বেগম', role:'অভিভাবক', cat:'সমস্যা', subject:'যাতায়াতের সমস্যা', preview:'আমাদের এলাকায় কোনো স্কুল বাস নেই।', time:'৫ ঘণ্টা আগে', unread:true },
    { from:'ফাতেমা বেগম', role:'শিক্ষক', cat:'মতামত', subject:'ডিজিটাল লাইব্রেরির উন্নতি', preview:'নতুন বিজ্ঞান বই যোগ করলে ভালো হবে।', time:'১ দিন আগে', unread:false },
  ]

  if (inboxMode) return (
    <div>
      <SectionTitle>{lang==='bn'?'বার্তার ইনবক্স':'Messages Inbox'}</SectionTitle>
      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        {INBOX.map((m,i) => (
          <Card key={i} style={{ background:m.unread?C.infoBg:C.paper }}>
            <div style={{ display:'flex', gap:12, alignItems:'flex-start' }}>
              <div style={{ width:40, height:40, borderRadius:'50%', background:C.forest, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:16, fontWeight:700, flexShrink:0 }}>{m.from[0]}</div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:'flex', gap:6, alignItems:'center', marginBottom:4, flexWrap:'wrap' as const }}>
                  <span style={{ fontFamily:"'Hind Siliguri',sans-serif", fontSize:14, fontWeight:700 }}>{m.from}</span>
                  <Badge color={m.role==='ছাত্র'?'blue':m.role==='অভিভাবক'?'green':'gold'}>{m.role}</Badge>
                  <Badge color={m.cat==='সমস্যা'?'red':m.cat==='প্রশ্ন'?'blue':'grey'}>{m.cat}</Badge>
                  <span style={{ fontSize:11, color:'#999', marginLeft:'auto' }}>{m.time}</span>
                  {m.unread && <div style={{ width:8, height:8, borderRadius:'50%', background:C.forest, flexShrink:0 }} />}
                </div>
                <div style={{ fontFamily:"'Hind Siliguri',sans-serif", fontSize:13, fontWeight:600, color:C.dark, marginBottom:2 }}>{m.subject}</div>
                <div style={{ fontFamily:"'Hind Siliguri',sans-serif", fontSize:12, color:'#666', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' as const }}>{m.preview}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )

  const handleSend = async () => {
    if (!msg.subject || !msg.body) return
    setLoading(true)
    await sendMessage({ from:'Demo User', senderRole:'student', ...msg })
    setSent(true)
    setLoading(false)
  }

  return (
    <div>
      <SectionTitle>{lang==='bn'?'জেলা প্রশাসনকে বার্তা':'Message to District'}</SectionTitle>
      {sent ? (
        <Card style={{ textAlign:'center', padding:40 }}>
          <div style={{ fontSize:40, marginBottom:12 }}>✅</div>
          <div style={{ fontFamily:"'Hind Siliguri',sans-serif", fontSize:16, fontWeight:600, color:C.success }}>বার্তা সফলভাবে পাঠানো হয়েছে!</div>
          <Btn onClick={() => { setSent(false); setMsg({ category:'সমস্যা', subject:'', body:'' }) }} style={{ marginTop:16 }}>
            {lang==='bn'?'নতুন বার্তা':'New Message'}
          </Btn>
        </Card>
      ) : (
        <Card>
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            <div>
              <label style={{ fontFamily:"'Hind Siliguri',sans-serif", fontSize:13, fontWeight:600, display:'block', marginBottom:6 }}>{lang==='bn'?'বিভাগ':'Category'}</label>
              <select value={msg.category} onChange={e => setMsg({...msg, category:e.target.value})} style={{ width:'100%', padding:'10px 12px', borderRadius:6, border:`1px solid ${C.muted}`, fontSize:13 }}>
                <option>সমস্যা</option><option>প্রশ্ন</option><option>মতামত</option><option>জরুরি</option>
              </select>
            </div>
            <div>
              <label style={{ fontFamily:"'Hind Siliguri',sans-serif", fontSize:13, fontWeight:600, display:'block', marginBottom:6 }}>{lang==='bn'?'বিষয়':'Subject'}</label>
              <input value={msg.subject} onChange={e => setMsg({...msg, subject:e.target.value})} placeholder={lang==='bn'?'বার্তার বিষয়...':'Message subject...'} style={{ width:'100%', padding:'10px 12px', borderRadius:6, border:`1px solid ${C.muted}`, fontSize:13, fontFamily:"'Hind Siliguri',sans-serif", boxSizing:'border-box' as const }} />
            </div>
            <div>
              <label style={{ fontFamily:"'Hind Siliguri',sans-serif", fontSize:13, fontWeight:600, display:'block', marginBottom:6 }}>{lang==='bn'?'বার্তা':'Message'}</label>
              <textarea value={msg.body} onChange={e => setMsg({...msg, body:e.target.value})} rows={5} style={{ width:'100%', padding:'10px 12px', borderRadius:6, border:`1px solid ${C.muted}`, fontSize:13, fontFamily:"'Hind Siliguri',sans-serif", resize:'vertical' as const, boxSizing:'border-box' as const }} />
            </div>
            <Btn onClick={handleSend} disabled={loading}>{loading?'পাঠাচ্ছে...':(lang==='bn'?'পাঠান':'Send')}</Btn>
          </div>
        </Card>
      )}
    </div>
  )
}

export const CognitiveTab = () => {
  const { lang } = useLang()
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
      <Card>
        <SectionTitle>{lang==='bn'?'জ্ঞান দক্ষতার মানচিত্র':'Cognitive Skill Map'}</SectionTitle>
        <ResponsiveContainer width="100%" height={280}>
          <RadarChart data={COGNITIVE_DATA}>
            <PolarGrid stroke={C.muted} />
            <PolarAngleAxis dataKey="skill" tick={{ fontSize:11, fontFamily:"'Hind Siliguri',sans-serif" }} />
            <Radar name={lang==='bn'?'বর্তমান':'Current'} dataKey="current" stroke={C.forest} fill={C.forest} fillOpacity={0.25} />
            <Radar name={lang==='bn'?'পূর্ববর্তী':'Previous'} dataKey="previous" stroke={C.gold} fill={C.gold} fillOpacity={0.1} strokeDasharray="4 2" />
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      </Card>
      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        {COGNITIVE_DATA.map(d => (
          <Card key={d.skill} style={{ padding:'12px 16px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
              <span style={{ fontFamily:"'Hind Siliguri',sans-serif", fontSize:13, fontWeight:600 }}>{d.skill}</span>
              <div style={{ display:'flex', gap:8 }}>
                <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:13, color:C.forest, fontWeight:700 }}>{d.current}</span>
                <span style={{ fontSize:11, color:d.current>d.previous?C.success:C.danger }}>{d.current>d.previous?'↑':'↓'}{Math.abs(d.current-d.previous)}</span>
              </div>
            </div>
            <div style={{ height:6, background:C.muted, borderRadius:3 }}>
              <div style={{ height:'100%', width:`${d.current}%`, background:C.forest, borderRadius:3, transition:'width 0.8s ease' }} />
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export const PerformanceChart = () => {
  const { lang } = useLang()
  const data = [
    { month:'জানু', math:72, bangla:68, english:65, science:70 },
    { month:'ফেব্রু', math:74, bangla:71, english:67, science:72 },
    { month:'মার্চ', math:76, bangla:73, english:69, science:68 },
    { month:'এপ্রিল', math:79, bangla:75, english:70, science:74 },
    { month:'মে', math:81, bangla:76, english:72, science:71 },
    { month:'জুন', math:82, bangla:76, english:71, science:69 },
  ]
  return (
    <Card>
      <SectionTitle>{lang==='bn'?'বিষয়ভিত্তিক পারফরম্যান্স (৬ মাস)':'Subject Performance (6 Months)'}</SectionTitle>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={C.muted} />
          <XAxis dataKey="month" tick={{ fontSize:11, fontFamily:"'Hind Siliguri',sans-serif" }} />
          <YAxis domain={[50,100]} tick={{ fontSize:11 }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize:11 }} />
          <Line type="monotone" dataKey="math" name={lang==='bn'?'গণিত':'Math'} stroke={C.forest} strokeWidth={2.5} dot={{ r:3 }} />
          <Line type="monotone" dataKey="bangla" name={lang==='bn'?'বাংলা':'Bangla'} stroke={C.gold} strokeWidth={2.5} dot={{ r:3 }} />
          <Line type="monotone" dataKey="english" name={lang==='bn'?'ইংরেজি':'English'} stroke="#2E86AB" strokeWidth={2.5} dot={{ r:3 }} />
          <Line type="monotone" dataKey="science" name={lang==='bn'?'বিজ্ঞান':'Science'} stroke="#A23B72" strokeWidth={2.5} dot={{ r:3 }} />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  )
}
