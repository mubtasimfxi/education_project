import { useState, useEffect } from 'react'
import { Card, SectionTitle, Badge, Btn, AIBadge, KPICard, C, TabBar, RiskBadge, CustomTooltip, SUBJECT_COLORS } from '../../components/ui'
import { NoticesTab, MessagesTab, CognitiveTab, PerformanceChart } from '../../components/SharedTabs'
import { useLang } from '../../context/LangContext'
import { getStudentAnalytics, downloadLibraryItem } from '../../api/client'
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar } from 'recharts'

const LIBRARY_ITEMS = [
  { id:1, title:'ত্রিভুজের ক্ষেত্রফল ও পরিধি', subject:'গণিত', type:'ভিডিও', duration:'18 মিনিট', downloads:1420 },
  { id:2, title:'বাংলা ব্যাকরণ: সন্ধি বিচ্ছেদ', subject:'বাংলা', type:'পাঠ্যবই', duration:'42 পৃষ্ঠা', downloads:2103 },
  { id:3, title:"Newton's Laws of Motion", subject:'বিজ্ঞান', type:'অ্যানিমেশন', duration:'22 মিনিট', downloads:987 },
  { id:4, title:'English Grammar: Tenses', subject:'ইংরেজি', type:'কুইজ', duration:'30 প্রশ্ন', downloads:1876 },
  { id:5, title:'বাংলাদেশের ইতিহাস ও ভূগোল', subject:'সমাজ বিজ্ঞান', type:'পাঠ্যবই', duration:'68 পৃষ্ঠা', downloads:3241 },
  { id:6, title:'ICT: Internet and Web Basics', subject:'আইসিটি', type:'ভিডিও', duration:'25 মিনিট', downloads:1654 },
]

const QA_FEED = [
  { id:1, student:'আরিফ হোসেন', subject:'গণিত', question:'পিথাগোরাসের উপপাদ্য কীভাবে প্রমাণ করতে হয়?', time:'২ ঘণ্টা আগে', answers:[{ teacher:'ফাতেমা বেগম', text:'পিথাগোরাসের উপপাদ্য প্রমাণের সহজ উপায় হলো সমকোণী ত্রিভুজ আঁকা এবং বর্গক্ষেত্রের সাহায্যে দেখানো যে a²+b²=c²।', votes:12 }] },
  { id:2, student:'নুসরাত জাহান', subject:'ইংরেজি', question:'Present Perfect Tense এবং Simple Past Tense-এর পার্থক্য কী?', time:'৫ ঘণ্টা আগে', answers:[{ teacher:'করিম শেখ', text:"Present Perfect ব্যবহার হয় যখন কাজটি অতীতে শুরু হয়ে এখনও প্রাসঙ্গিক। যেমন: 'I have eaten' মানে এখনও পেট ভরা।", votes:8 }] },
]

function OverviewTab() {
  const { lang } = useLang()
  const [analytics, setAnalytics] = useState<any>(null)
  useEffect(() => { getStudentAnalytics('S001').then(d => setAnalytics(d)) }, [])
  const cognitive = analytics?.cognitive || []
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(160px, 1fr))', gap:16 }}>
        <KPICard label={lang==='bn'?'সামগ্রিক স্কোর':'Overall Score'} value="78.5" sub="/100" icon="🎯" color={C.forest} trend={4.2} />
        <KPICard label={lang==='bn'?'AI ঝুঁকি স্তর':'Risk Level'} value={lang==='bn'?'কম':'Low'} icon="🛡️" color={C.success} />
        <KPICard label={lang==='bn'?'শ্রেণী র‍্যাংক':'Class Rank'} value="#8" sub={lang==='bn'?'৪২ জনের মধ্যে':'of 42'} icon="🏆" color={C.gold} />
        <KPICard label={lang==='bn'?'উপস্থিতি':'Attendance'} value="92%" icon="📅" color={C.emerald} trend={2.1} />
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'3fr 2fr', gap:20 }}>
        <Card>
          <SectionTitle>{lang==='bn'?'জ্ঞান দক্ষতার মানচিত্র':'Cognitive Skill Map'}</SectionTitle>
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={cognitive.length ? cognitive : [{ skill:'লোড হচ্ছে', current:0, previous:0 }]}>
              <PolarGrid stroke={C.muted} />
              <PolarAngleAxis dataKey="skill" tick={{ fontSize:11, fontFamily:"'Hind Siliguri',sans-serif" }} />
              <Radar name={lang==='bn'?'এই মেয়াদ':'This Term'} dataKey="current" stroke={C.forest} fill={C.forest} fillOpacity={0.25} />
              <Radar name={lang==='bn'?'গত মেয়াদ':'Last Term'} dataKey="previous" stroke={C.gold} fill={C.gold} fillOpacity={0.1} strokeDasharray="4 2" />
              <Legend wrapperStyle={{ fontSize:11 }} />
            </RadarChart>
          </ResponsiveContainer>
        </Card>
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {[
            { icon:'💡', title:lang==='bn'?'শক্তি':'Strength', body:lang==='bn'?'সমস্যা সমাধানে তুমি এগিয়ে আছ। গণিতে ধারাবাহিক উন্নতি লক্ষ্যণীয়।':'Strong in problem solving. Consistent improvement in Math.' },
            { icon:'📌', title:lang==='bn'?'উন্নতির ক্ষেত্র':'Improve', body:lang==='bn'?'সৃজনশীলতা বাড়ানোর জন্য বেশি বেশি রচনা লেখার অভ্যাস করো।':'Practice more creative writing to boost creativity.' },
            { icon:'🌟', title:lang==='bn'?'অনুপ্রেরণা':'Motivation', body:lang==='bn'?'তুমি শীর্ষ ২০%-এ আছ! আরও একটু চেষ্টা করলে শীর্ষ ১০%-এ যাবে।':'You are in top 20%! A little more effort to reach top 10%.' },
          ].map((a,i) => (
            <Card key={i} style={{ padding:'14px 16px' }}>
              <div style={{ display:'flex', gap:8, alignItems:'flex-start' }}>
                <span style={{ fontSize:18 }}>{a.icon}</span>
                <div>
                  <div style={{ display:'flex', gap:6, alignItems:'center', marginBottom:4 }}>
                    <span style={{ fontFamily:"'Sora',sans-serif", fontSize:12, fontWeight:700, color:C.dark }}>{a.title}</span>
                    <AIBadge />
                  </div>
                  <p style={{ fontFamily:"'Hind Siliguri',sans-serif", fontSize:12, color:'#555', margin:0, lineHeight:1.6 }}>{a.body}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
      <PerformanceChart />
    </div>
  )
}

function LibraryTab() {
  const { lang } = useLang()
  const [downloaded, setDownloaded] = useState<number[]>([])
  const handleDownload = async (id: number) => {
    await downloadLibraryItem('U001', id)
    setDownloaded(d => d.includes(id) ? d.filter(x=>x!==id) : [...d, id])
  }
  return (
    <div>
      <SectionTitle>{lang==='bn'?'ডিজিটাল লাইব্রেরি':'Digital Library'}</SectionTitle>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:16 }}>
        {LIBRARY_ITEMS.map(item => {
          const color = SUBJECT_COLORS[item.subject] || C.forest
          const isDL = downloaded.includes(item.id)
          return (
            <Card key={item.id} style={{ padding:0, overflow:'hidden' }}>
              <div style={{ height:90, background:`linear-gradient(135deg, ${color}dd, ${color}66)`, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 16px', position:'relative' }}>
                <span style={{ fontSize:32 }}>{item.subject==='গণিত'?'🔢':item.subject==='বাংলা'?'📖':item.subject==='বিজ্ঞান'?'🔬':item.subject==='ইংরেজি'?'📝':'📚'}</span>
                <div style={{ position:'absolute', top:8, left:8 }}><Badge color="gold">{item.type}</Badge></div>
                {isDL && <div style={{ position:'absolute', top:8, right:8 }}><Badge color="green">✓ অফলাইন</Badge></div>}
              </div>
              <div style={{ padding:'14px 16px' }}>
                <div style={{ fontFamily:"'Hind Siliguri',sans-serif", fontSize:14, fontWeight:700, color:C.dark, marginBottom:8 }}>{item.title}</div>
                <div style={{ display:'flex', gap:8, marginBottom:12, flexWrap:'wrap' as const }}>
                  <span style={{ fontSize:11, color:'#999' }}>⏱ {item.duration}</span>
                  <span style={{ fontSize:11, color:'#999' }}>⬇️ {item.downloads.toLocaleString()}</span>
                </div>
                <div style={{ display:'flex', gap:8 }}>
                  <Btn size="sm">খুলুন</Btn>
                  <Btn size="sm" variant="ghost" onClick={() => handleDownload(item.id)}>
                    {isDL ? '✓ সংরক্ষিত' : '📥 ডাউনলোড'}
                  </Btn>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

function AssessmentsTab() {
  const { lang } = useLang()
  const ASSESSMENTS = [
    { title:'গণিত মাসিক পরীক্ষা - এপ্রিল', subject:'গণিত', date:'১৫ এপ্রিল ২০২৪', score:36, total:50, status:'graded' },
    { title:'বিজ্ঞান কুইজ - চ্যাপ্টার ৪', subject:'বিজ্ঞান', date:'২২ এপ্রিল ২০২৪', score:null, total:20, status:'submitted' },
    { title:'গণিত শ্রেণী পরীক্ষা', subject:'গণিত', date:'৫ মে ২০২৪', score:null, total:30, status:'pending' },
  ]
  return (
    <div>
      <SectionTitle>{lang==='bn'?'আমার মূল্যায়ন':'My Assessments'}</SectionTitle>
      <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
        {ASSESSMENTS.map((a,i) => (
          <Card key={i}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap' as const, gap:12 }}>
              <div>
                <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:6 }}>
                  <div style={{ width:10, height:10, borderRadius:'50%', background:SUBJECT_COLORS[a.subject]||C.forest }} />
                  <h4 style={{ fontFamily:"'Hind Siliguri',sans-serif", fontSize:15, fontWeight:700, color:C.dark, margin:0 }}>{a.title}</h4>
                </div>
                <div style={{ display:'flex', gap:8, flexWrap:'wrap' as const }}>
                  <Badge color="gold">{a.subject}</Badge>
                  <span style={{ fontSize:12, color:'#999' }}>📅 {a.date}</span>
                </div>
              </div>
              <div style={{ textAlign:'right' as const }}>
                {a.status==='graded' && a.score !== null && (
                  <div>
                    <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:22, fontWeight:700, color:C.forest }}>{a.score}/{a.total}</div>
                    <Badge color={a.score/a.total>=0.5?'green':'red'}>{a.score/a.total>=0.5?'পাস':'ফেল'}</Badge>
                  </div>
                )}
                {a.status==='submitted' && <Badge color="blue">জমা দেওয়া হয়েছে</Badge>}
                {a.status==='pending' && <Badge color="amber">মুলতুবি</Badge>}
              </div>
            </div>
            {a.status==='graded' && a.score !== null && (
              <div style={{ marginTop:12, padding:'12px 14px', background:C.warningBg, borderRadius:8 }}>
                <div style={{ display:'flex', gap:6, alignItems:'center', marginBottom:6 }}>
                  <AIBadge />
                  <span style={{ fontFamily:"'Sora',sans-serif", fontSize:12, fontWeight:700, color:C.warning }}>উন্নতির পরামর্শ</span>
                </div>
                <p style={{ fontFamily:"'Hind Siliguri',sans-serif", fontSize:12, color:C.warning, margin:0 }}>
                  {lang==='bn'?'ত্রিভুজ ও বৃত্তের ক্ষেত্রফল সংক্রান্ত প্রশ্নে আরও মনোযোগ দাও। অধ্যায় ৬ পুনরায় পড়ার পরামর্শ।':'Focus more on area calculation problems. Recommend reviewing Chapter 6.'}
                </p>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}

function GPATab() {
  const { lang } = useLang()
  const [grades, setGrades] = useState<Record<string,string>>({ গণিত:'A+', বাংলা:'A', ইংরেজি:'A-', বিজ্ঞান:'A', 'সমাজ বিজ্ঞান':'B' })
  const gradePoints: Record<string,number> = { 'A+':5.0, 'A':4.0, 'A-':3.5, 'B':3.0, 'C':2.0, 'D':1.0, 'F':0 }
  const gpa = (Object.values(grades).reduce((s,g) => s+(gradePoints[g]||0),0)/Object.keys(grades).length).toFixed(2)
  return (
    <div>
      <SectionTitle>{lang==='bn'?'GPA পূর্বাভাস':'GPA Predictor'}</SectionTitle>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
        <Card>
          {Object.entries(grades).map(([sub, grade]) => (
            <div key={sub} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
              <span style={{ fontFamily:"'Hind Siliguri',sans-serif", fontSize:14, fontWeight:600 }}>{sub}</span>
              <select value={grade} onChange={e => setGrades({...grades,[sub]:e.target.value})} style={{ padding:'6px 10px', borderRadius:6, border:`1px solid ${C.muted}`, fontSize:13 }}>
                {['A+','A','A-','B','C','D','F'].map(g => <option key={g}>{g}</option>)}
              </select>
            </div>
          ))}
        </Card>
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          <Card style={{ textAlign:'center', padding:'32px 20px' }}>
            <div style={{ fontFamily:"'Hind Siliguri',sans-serif", fontSize:14, color:'#666', marginBottom:8 }}>{lang==='bn'?'পূর্বাভাসিত GPA':'Predicted GPA'}</div>
            <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:52, fontWeight:700, color:parseFloat(gpa)>=4.5?C.success:parseFloat(gpa)>=3?C.warning:C.danger }}>{gpa}</div>
            <div style={{ fontSize:13, color:'#999' }}>{lang==='bn'?'৫.০ স্কেলে':'out of 5.0'}</div>
          </Card>
          <Card style={{ padding:'14px 16px' }}>
            <div style={{ display:'flex', gap:6, alignItems:'center', marginBottom:8 }}><AIBadge /><span style={{ fontFamily:"'Sora',sans-serif", fontSize:12, fontWeight:700 }}>What-if Analysis</span></div>
            <p style={{ fontFamily:"'Hind Siliguri',sans-serif", fontSize:12, color:'#555', margin:0 }}>
              {lang==='bn'?`ইংরেজিতে A+ পেলে আপনার GPA ${(parseFloat(gpa)+0.3).toFixed(2)} হবে।`:`Getting A+ in English would raise your GPA to ${(parseFloat(gpa)+0.3).toFixed(2)}.`}
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function StudentDashboard({ activeTab }: { activeTab: string }) {
  switch (activeTab) {
    case 'overview':    return <OverviewTab />
    case 'library':     return <LibraryTab />
    case 'assessments': return <AssessmentsTab />
    case 'cognitive':   return <CognitiveTab />
    case 'performance': return <PerformanceChart />
    case 'gpa':         return <GPATab />
    case 'notices':     return <NoticesTab />
    case 'messages':    return <MessagesTab />
    case 'growth': return (
      <div>
        <SectionTitle badge={<AIBadge />}>{'AI বিকাশ পরিকল্পনা'}</SectionTitle>
        {[{ title:'গণিতের বীজগণিত অধ্যায় পুনরাবৃত্তি', status:'চলমান', p:'high' },{ title:'ইংরেজি গ্রামার দক্ষতা বৃদ্ধি', status:'শুরু হয়নি', p:'medium' },{ title:'বিজ্ঞানের পরীক্ষার প্রস্তুতি', status:'সম্পন্ন', p:'low' }].map((a,i) => (
          <Card key={i} style={{ marginBottom:12, borderLeft:`4px solid ${a.p==='high'?C.danger:a.p==='medium'?C.gold:C.success}` }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
              <span style={{ fontFamily:"'Hind Siliguri',sans-serif", fontSize:14, fontWeight:700 }}>{a.title}</span>
              <Badge color={a.status==='সম্পন্ন'?'green':a.status==='চলমান'?'blue':'grey'}>{a.status}</Badge>
            </div>
          </Card>
        ))}
      </div>
    )
    case 'career': return (
      <div>
        <SectionTitle>ক্যারিয়ার সম্ভাবনা</SectionTitle>
        <Card>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart layout="vertical" data={[{ career:'কম্পিউটার বিজ্ঞান',score:91 },{ career:'প্রকৌশল',score:82 },{ career:'ব্যবসা',score:79 },{ career:'চিকিৎসা',score:74 },{ career:'শিক্ষকতা',score:68 },{ career:'কৃষিবিজ্ঞান',score:65 }]}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.muted} />
              <XAxis type="number" domain={[0,100]} tick={{ fontSize:11 }} />
              <YAxis type="category" dataKey="career" width={130} tick={{ fontSize:11, fontFamily:"'Hind Siliguri',sans-serif" }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="score" fill={C.forest} radius={[0,4,4,0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    )
    case 'askteacher': return (
      <div>
        <SectionTitle>শিক্ষককে প্রশ্ন করুন</SectionTitle>
        <Card style={{ marginBottom:20 }}>
          <textarea rows={3} placeholder="আপনার প্রশ্ন লিখুন..." style={{ width:'100%', border:`1px solid ${C.muted}`, borderRadius:6, padding:'10px 12px', fontFamily:"'Hind Siliguri',sans-serif", fontSize:13, resize:'none', boxSizing:'border-box', marginBottom:10 }} />
          <Btn>প্রশ্ন পোস্ট করুন</Btn>
        </Card>
        {QA_FEED.map(q => (
          <Card key={q.id} style={{ marginBottom:14 }}>
            <div style={{ display:'flex', gap:10, marginBottom:12 }}>
              <div style={{ width:36, height:36, borderRadius:'50%', background:C.forest, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:14, fontWeight:700 }}>{q.student[0]}</div>
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', gap:6, alignItems:'center', marginBottom:4 }}>
                  <span style={{ fontFamily:"'Hind Siliguri',sans-serif", fontSize:13, fontWeight:700 }}>{q.student}</span>
                  <Badge color="gold">{q.subject}</Badge>
                  <span style={{ fontSize:11, color:'#999', marginLeft:'auto' }}>{q.time}</span>
                </div>
                <p style={{ fontFamily:"'Hind Siliguri',sans-serif", fontSize:14, color:C.dark, margin:0 }}>{q.question}</p>
              </div>
            </div>
            {q.answers.map((a,i) => (
              <div key={i} style={{ marginLeft:46, padding:'12px 14px', background:C.successBg, borderRadius:8, borderLeft:`3px solid ${C.forest}` }}>
                <div style={{ display:'flex', gap:6, alignItems:'center', marginBottom:6 }}>
                  <Badge color="green">শিক্ষক</Badge>
                  <span style={{ fontFamily:"'Hind Siliguri',sans-serif", fontSize:12, fontWeight:700 }}>{a.teacher}</span>
                  <span style={{ marginLeft:'auto', fontSize:11, color:C.success }}>👍 {a.votes}</span>
                </div>
                <p style={{ fontFamily:"'Hind Siliguri',sans-serif", fontSize:13, color:C.dark, margin:0 }}>{a.text}</p>
              </div>
            ))}
          </Card>
        ))}
      </div>
    )
    default: return <Card style={{ textAlign:'center', padding:60 }}><div style={{ fontSize:40, marginBottom:12 }}>🚧</div><div style={{ fontFamily:"'Hind Siliguri',sans-serif", color:'#888' }}>শীঘ্রই আসছে</div></Card>
  }
}
