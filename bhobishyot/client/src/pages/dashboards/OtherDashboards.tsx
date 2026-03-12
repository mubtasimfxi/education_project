import { useState, useEffect } from 'react'
import { Card, SectionTitle, Badge, Btn, AIBadge, KPICard, C, TabBar, RiskBadge, CustomTooltip, SUBJECT_COLORS } from '../../components/ui'
import { NoticesTab, MessagesTab, CognitiveTab, PerformanceChart } from '../../components/SharedTabs'
import { useLang } from '../../context/LangContext'
import { getNationalAnalytics, getTeachers, getStudents, createAssessment, getAiDistrictReport, getAiPolicyInsight, streamAiFeedback } from '../../api/client'
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'

const STUDENTS_MOCK = [
  { id:'S001', name:'আরিফ হোসেন', class:8, section:'A', roll:7, score:78.5, risk:'low', rank:8, attendance:92, gpa:4.2 },
  { id:'S002', name:'নুসরাত জাহান', class:8, section:'A', roll:12, score:85.2, risk:'low', rank:3, attendance:96, gpa:4.6 },
  { id:'S003', name:'সুমাইয়া আক্তার', class:8, section:'B', roll:5, score:52.1, risk:'high', rank:31, attendance:71, gpa:2.8 },
  { id:'S004', name:'রহিম উদ্দিন', class:8, section:'B', roll:18, score:63.4, risk:'medium', rank:22, attendance:84, gpa:3.3 },
  { id:'S005', name:'তাসনিম ইসলাম', class:8, section:'A', roll:3, score:91.0, risk:'low', rank:1, attendance:98, gpa:5.0 },
  { id:'S006', name:'মারিয়াম বেগম', class:8, section:'C', roll:9, score:44.3, risk:'high', rank:38, attendance:65, gpa:2.0 },
  { id:'S007', name:'সাইফুল ইসলাম', class:8, section:'A', roll:21, score:71.8, risk:'low', rank:14, attendance:89, gpa:3.9 },
  { id:'S008', name:'ফাতেমা খানম', class:8, section:'B', roll:6, score:58.9, risk:'medium', rank:26, attendance:78, gpa:3.0 },
]

// ─── PARENT ────────────────────────────────────────────────────────────────────
const CHILDREN = [STUDENTS_MOCK[0], STUDENTS_MOCK[1]]

function ParentOverview({ child }: { child: typeof STUDENTS_MOCK[0] }) {
  const { lang } = useLang()
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:16 }}>
        <KPICard label={lang==='bn'?'পারফরম্যান্স স্কোর':'Score'} value={child.score} sub="/100" icon="🎯" color={C.forest} />
        <KPICard label={lang==='bn'?'শ্রেণী র‍্যাংক':'Class Rank'} value={`#${child.rank}`} icon="🏆" color={C.gold} />
        <KPICard label={lang==='bn'?'উপস্থিতি':'Attendance'} value={`${child.attendance}%`} icon="📅" color={child.attendance>=85?C.success:C.warning} />
        <KPICard label="GPA" value={child.gpa} sub="/5.0" icon="🎓" color={C.info} />
      </div>
      <Card style={{ borderLeft:`4px solid ${child.risk==='high'?C.danger:child.risk==='medium'?C.gold:C.forest}` }}>
        <div style={{ display:'flex', gap:8, alignItems:'flex-start' }}>
          <span style={{ fontSize:24 }}>{child.risk==='high'?'⚠️':child.risk==='medium'?'📌':'✅'}</span>
          <div>
            <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:6 }}><span style={{ fontFamily:"'Sora',sans-serif", fontSize:14, fontWeight:700, color:C.dark }}>AI Alert</span><AIBadge /><RiskBadge level={child.risk} lang={lang} /></div>
            <p style={{ fontFamily:"'Hind Siliguri',sans-serif", fontSize:13, color:'#555', margin:0 }}>{child.risk==='low'?(lang==='bn'?'আপনার সন্তান ভালো করছে! নিয়মিত পড়ার অভ্যাস বজায় রাখুন।':'Your child is doing great! Keep up the regular study habits.'):(lang==='bn'?'বিজ্ঞান ও ইংরেজিতে মনোযোগ বাড়ানো প্রয়োজন। শিক্ষকের সাথে কথা বলুন।':'Science and English need more attention. Contact the teacher.')}</p>
          </div>
        </div>
      </Card>
      <PerformanceChart />
    </div>
  )
}

function AttendanceTab() {
  const { lang } = useLang()
  return (
    <div>
      <SectionTitle>{lang==='bn'?'উপস্থিতির বিবরণ':'Attendance Details'}</SectionTitle>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))', gap:14, marginBottom:20 }}>
        <KPICard label={lang==='bn'?'উপস্থিত':'Present'} value="46" sub="দিন" icon="✅" color={C.success} />
        <KPICard label={lang==='bn'?'অনুপস্থিত':'Absent'} value="4" sub="দিন" icon="❌" color={C.danger} />
        <KPICard label={lang==='bn'?'দেরি':'Late'} value="2" sub="দিন" icon="⏰" color={C.warning} />
        <KPICard label={lang==='bn'?'উপস্থিতির হার':'Rate'} value="92%" icon="📅" color={C.success} />
      </div>
      <Card>
        <SectionTitle>এপ্রিল ২০২৪</SectionTitle>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:4 }}>
          {['রবি','সোম','মঙ্গল','বুধ','বৃহ','শুক্র','শনি'].map(d => <div key={d} style={{ padding:'6px 0', textAlign:'center' as const, fontSize:10, fontFamily:"'Hind Siliguri',sans-serif", fontWeight:700, color:'#888' }}>{d}</div>)}
          {Array.from({length:30}).map((_,i) => {
            const status = i===2||i===15?'absent':i===8?'late':i>=5&&i<7?'holiday':'present'
            return <div key={i} style={{ padding:6, textAlign:'center' as const, borderRadius:6, background:status==='absent'?C.dangerBg:status==='late'?C.warningBg:status==='holiday'?C.muted:C.successBg, fontSize:11, fontFamily:"'JetBrains Mono',monospace", color:status==='absent'?C.danger:status==='late'?C.warning:status==='holiday'?'#999':C.success, fontWeight:600 }}>{i+1}</div>
          })}
        </div>
      </Card>
    </div>
  )
}

export function ParentDashboard({ activeTab }: { activeTab: string }) {
  const [child, setChild] = useState(CHILDREN[0])
  const { lang } = useLang()
  return (
    <div>
      {/* Child selector */}
      <div style={{ background:C.paper, borderRadius:10, padding:'10px 16px', display:'flex', gap:10, alignItems:'center', marginBottom:20, border:`1px solid ${C.muted}` }}>
        <span style={{ fontFamily:"'Hind Siliguri',sans-serif", fontSize:12, color:'#888', marginRight:4 }}>{lang==='bn'?'সন্তান:':'Child:'}</span>
        {CHILDREN.map((c,i) => (
          <button key={c.id} onClick={() => setChild(c)} style={{ display:'flex', gap:8, alignItems:'center', padding:'6px 14px', borderRadius:9999, border:`1.5px solid ${child.id===c.id?C.forest:C.muted}`, background:child.id===c.id?C.successBg:'transparent', cursor:'pointer', fontFamily:"'Hind Siliguri',sans-serif", fontSize:13, fontWeight:child.id===c.id?700:400, color:child.id===c.id?C.forest:'#555' }}>
            <div style={{ width:22, height:22, borderRadius:'50%', background:C.forest, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:10, fontWeight:700 }}>{c.name[0]}</div>
            {c.name} <Badge color="grey">{lang==='bn'?'শ্রেণী':'Cls'} {c.class}{c.section}</Badge>
          </button>
        ))}
      </div>
      {activeTab==='overview' && <ParentOverview child={child} />}
      {activeTab==='attendance' && <AttendanceTab />}
      {activeTab==='cognitive' && <CognitiveTab />}
      {activeTab==='notices' && <NoticesTab />}
      {activeTab==='messages' && <MessagesTab />}
      {(activeTab==='performance'||activeTab==='assessments') && <PerformanceChart />}
    </div>
  )
}

// ─── TEACHER ──────────────────────────────────────────────────────────────────
function TeacherAssessments() {
  const { lang } = useLang()
  const [subTab, setSubTab] = useState('active')
  const [feedback, setFeedback] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<typeof STUDENTS_MOCK[0]|null>(null)
  const [createForm, setCreateForm] = useState({ title:'', subject:'গণিত', type:'মাসিক পরীক্ষা', totalMarks:'50' })
  const [created, setCreated] = useState(false)

  const simulateAI = () => {
    setAiLoading(true)
    setFeedback('')
    streamAiFeedback(
      { score: 36, total: 50, subject: createForm.subject, lang },
      (chunk) => setFeedback(f => f + chunk),
      () => setAiLoading(false)
    )
  }

  const handleCreate = async () => {
    await createAssessment({ ...createForm, totalMarks: parseInt(createForm.totalMarks) })
    setCreated(true)
  }

  const ASSESSMENTS = [
    { id:'A001', title:'গণিত মাসিক পরীক্ষা - এপ্রিল', subject:'গণিত', type:'মাসিক পরীক্ষা', date:'১৫ এপ্রিল ২০২৪', totalMarks:50, submitted:38, assigned:42, status:'graded', avgScore:36.4, passRate:86 },
    { id:'A002', title:'বিজ্ঞান কুইজ - চ্যাপ্টার ৪', subject:'বিজ্ঞান', type:'কুইজ', date:'২২ এপ্রিল ২০২৪', totalMarks:20, submitted:40, assigned:42, status:'grading', avgScore:null, passRate:null },
    { id:'A003', title:'গণিত শ্রেণী পরীক্ষা', subject:'গণিত', type:'শ্রেণী পরীক্ষা', date:'৫ মে ২০২৪', totalMarks:30, submitted:0, assigned:42, status:'open', avgScore:null, passRate:null },
  ]

  return (
    <div>
      <SectionTitle>{lang==='bn'?'মূল্যায়ন ব্যবস্থাপনা':'Assessment Management'}</SectionTitle>
      <TabBar small tabs={[
        { id:'active', label: lang==='bn'?'সক্রিয়':'Active' },
        { id:'grade', label: lang==='bn'?'মূল্যায়ন করুন':'Grade' },
        { id:'results', label: lang==='bn'?'ফলাফল':'Results' },
        { id:'analytics', label: lang==='bn'?'বিশ্লেষণ':'Analytics' },
        { id:'create', label: lang==='bn'?'নতুন তৈরি':'+ Create' },
      ]} active={subTab} onSelect={setSubTab} />

      {subTab==='active' && (
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {ASSESSMENTS.map(a => (
            <Card key={a.id}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap' as const, gap:12 }}>
                <div>
                  <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:6 }}>
                    <div style={{ width:10, height:10, borderRadius:'50%', background:SUBJECT_COLORS[a.subject]||C.forest }} />
                    <h4 style={{ fontFamily:"'Hind Siliguri',sans-serif", fontSize:15, fontWeight:700, color:C.dark, margin:0 }}>{a.title}</h4>
                  </div>
                  <div style={{ display:'flex', gap:8, flexWrap:'wrap' as const }}>
                    <Badge color="gold">{a.type}</Badge><Badge color="grey">{a.subject}</Badge>
                    <span style={{ fontSize:12, color:'#999' }}>📅 {a.date}</span>
                    <span style={{ fontSize:12, color:'#999' }}>🎯 {a.totalMarks} নম্বর</span>
                  </div>
                </div>
                <div style={{ textAlign:'right' as const }}>
                  <Badge color={a.status==='graded'?'green':a.status==='grading'?'amber':a.status==='open'?'blue':'grey'}>{a.status==='graded'?'সম্পন্ন':a.status==='grading'?'মূল্যায়ন চলছে':a.status==='open'?'খোলা':'খসড়া'}</Badge>
                  <div style={{ fontSize:12, color:'#999', marginTop:4 }}>{a.submitted}/{a.assigned} জমা</div>
                </div>
              </div>
              {a.status==='graded' && a.avgScore && (
                <div style={{ marginTop:12, display:'flex', gap:14 }}>
                  <div style={{ flex:1, background:C.successBg, borderRadius:8, padding:'10px 14px', textAlign:'center' as const }}>
                    <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:20, fontWeight:700, color:C.success }}>{a.avgScore}/{a.totalMarks}</div>
                    <div style={{ fontSize:11, color:C.success }}>শ্রেণীর গড়</div>
                  </div>
                  <div style={{ flex:1, background:C.infoBg, borderRadius:8, padding:'10px 14px', textAlign:'center' as const }}>
                    <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:20, fontWeight:700, color:C.info }}>{a.passRate}%</div>
                    <div style={{ fontSize:11, color:C.info }}>পাসের হার</div>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {subTab==='grade' && (
        <div style={{ display:'grid', gridTemplateColumns:'260px 1fr', gap:16 }}>
          <Card style={{ padding:0, overflow:'hidden' }}>
            <div style={{ padding:'12px 14px', background:C.warm, borderBottom:`1px solid ${C.muted}`, fontFamily:"'Sora',sans-serif", fontSize:12, fontWeight:700, color:C.dark }}>শিক্ষার্থীর তালিকা</div>
            {STUDENTS_MOCK.slice(0,6).map(s => (
              <div key={s.id} onClick={() => setSelectedStudent(s)} style={{ padding:'10px 14px', borderBottom:`1px solid ${C.muted}`, cursor:'pointer', background:selectedStudent?.id===s.id?C.successBg:'white', borderLeft:selectedStudent?.id===s.id?`3px solid ${C.forest}`:'3px solid transparent', display:'flex', alignItems:'center', gap:10 }}>
                <div style={{ width:32, height:32, borderRadius:'50%', background:C.forest, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:13, fontWeight:700 }}>{s.name[0]}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontFamily:"'Hind Siliguri',sans-serif", fontSize:13, fontWeight:600, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' as const }}>{s.name}</div>
                  <div style={{ fontSize:11, color:'#999' }}>Roll: {s.roll}</div>
                </div>
                <Badge color="amber">জমা</Badge>
              </div>
            ))}
          </Card>
          {selectedStudent ? (
            <Card>
              <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:16, paddingBottom:16, borderBottom:`1px solid ${C.muted}` }}>
                <div style={{ width:48, height:48, borderRadius:'50%', background:C.forest, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:20, fontWeight:700 }}>{selectedStudent.name[0]}</div>
                <div>
                  <h3 style={{ fontFamily:"'Hind Siliguri',sans-serif", fontSize:16, fontWeight:700, margin:0 }}>{selectedStudent.name}</h3>
                  <span style={{ fontSize:12, color:'#999' }}>Roll {selectedStudent.roll} · Class {selectedStudent.class}{selectedStudent.section}</span>
                </div>
              </div>
              {[{ q:'ত্রিভুজের ক্ষেত্রফল নির্ণয় কর', max:10 },{ q:'বীজগণিতীয় রাশি সরল কর', max:15 },{ q:'সমীকরণ সমাধান কর', max:25 }].map((q,i) => (
                <div key={i} style={{ padding:'12px 14px', background:C.warm, borderRadius:8, marginBottom:10 }}>
                  <div style={{ fontFamily:"'Hind Siliguri',sans-serif", fontSize:13, fontWeight:600, marginBottom:8 }}>{i+1}. {q.q}</div>
                  <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                    <input type="number" min={0} max={q.max} defaultValue={Math.floor(q.max*0.8)} style={{ width:60, padding:'6px 10px', borderRadius:6, border:`1px solid ${C.muted}`, textAlign:'center' as const, fontFamily:"'JetBrains Mono',monospace", fontSize:14, fontWeight:600 }} />
                    <span style={{ color:'#999', fontSize:13 }}>/ {q.max} নম্বর</span>
                  </div>
                </div>
              ))}
              <div style={{ marginBottom:12 }}>
                <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:6 }}>
                  <label style={{ fontFamily:"'Hind Siliguri',sans-serif", fontSize:13, fontWeight:600 }}>সামগ্রিক মন্তব্য</label>
                  <button onClick={simulateAI} disabled={aiLoading} style={{ padding:'4px 10px', borderRadius:6, background:C.warningBg, border:'none', color:C.warning, fontSize:11, fontWeight:600, cursor:'pointer' }}>
                    {aiLoading?'✨ লিখছে...':'✦ AI সহায়তা'}
                  </button>
                </div>
                <textarea rows={3} value={feedback} onChange={e => setFeedback(e.target.value)} placeholder="মন্তব্য লিখুন বা AI সহায়তা নিন..." style={{ width:'100%', padding:'10px 12px', borderRadius:6, border:`1px solid ${C.muted}`, fontFamily:"'Hind Siliguri',sans-serif", fontSize:13, resize:'vertical' as const, boxSizing:'border-box' as const }} />
              </div>
              <Btn>সংরক্ষণ করুন ও পরবর্তী →</Btn>
            </Card>
          ) : (
            <Card style={{ display:'flex', alignItems:'center', justifyContent:'center', color:'#999', fontFamily:"'Hind Siliguri',sans-serif" }}>বাম থেকে শিক্ষার্থী নির্বাচন করুন</Card>
          )}
        </div>
      )}

      {subTab==='results' && (
        <div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))', gap:16, marginBottom:20 }}>
            <KPICard label="শ্রেণীর গড়" value="36.4" sub="/50" icon="📊" color={C.forest} />
            <KPICard label="সর্বোচ্চ" value="48" sub="/50" icon="🏆" color={C.gold} />
            <KPICard label="সর্বনিম্ন" value="18" sub="/50" icon="📉" color={C.danger} />
            <KPICard label="পাসের হার" value="86%" icon="✅" color={C.success} />
          </div>
          <Card>
            <table style={{ width:'100%', borderCollapse:'collapse' as const, fontFamily:"'Hind Siliguri',sans-serif", fontSize:13 }}>
              <thead><tr style={{ background:C.warm }}>{['র‍্যাংক','নাম','স্কোর','গ্রেড','ফলাফল'].map(h => <th key={h} style={{ padding:'10px 12px', textAlign:'left' as const, fontWeight:700, fontSize:12, color:'#555', borderBottom:`1px solid ${C.muted}` }}>{h}</th>)}</tr></thead>
              <tbody>
                {STUDENTS_MOCK.map((s,i) => {
                  const score = Math.floor(25+s.score*0.3)
                  const pct = score/50
                  const grade = pct>=0.8?'A+':pct>=0.7?'A':pct>=0.6?'A-':pct>=0.5?'B':'C'
                  return <tr key={s.id} style={{ borderBottom:`1px solid ${C.muted}` }}>
                    <td style={{ padding:'10px 12px', fontFamily:"'JetBrains Mono',monospace", fontWeight:600 }}>{i+1}</td>
                    <td style={{ padding:'10px 12px' }}>{s.name}</td>
                    <td style={{ padding:'10px 12px', fontFamily:"'JetBrains Mono',monospace", fontWeight:600, color:C.forest }}>{score}/50</td>
                    <td style={{ padding:'10px 12px' }}><Badge color={pct>=0.6?'green':pct>=0.5?'amber':'red'}>{grade}</Badge></td>
                    <td style={{ padding:'10px 12px' }}><Badge color={pct>=0.5?'green':'red'}>{pct>=0.5?'পাস':'ফেল'}</Badge></td>
                  </tr>
                })}
              </tbody>
            </table>
          </Card>
        </div>
      )}

      {subTab==='analytics' && (
        <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
          <Card>
            <SectionTitle>পারফরম্যান্সের ধারা</SectionTitle>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={[{m:'জানু',avg:68},{m:'ফেব্রু',avg:71},{m:'মার্চ',avg:69},{m:'এপ্রিল',avg:74},{m:'মে',avg:72},{m:'জুন',avg:76}]}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.muted} /><XAxis dataKey="m" tick={{ fontSize:11 }} /><YAxis domain={[50,100]} tick={{ fontSize:11 }} /><Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="avg" name="শ্রেণীর গড়" stroke={C.forest} strokeWidth={2.5} dot={{ r:4 }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
          <div style={{ padding:16, background:C.warningBg, borderRadius:12, borderLeft:`4px solid ${C.gold}` }}>
            <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:6 }}><AIBadge /><span style={{ fontFamily:"'Sora',sans-serif", fontSize:13, fontWeight:700, color:C.warning }}>AI বিশ্লেষণ</span></div>
            <p style={{ fontFamily:"'Hind Siliguri',sans-serif", fontSize:13, color:C.warning, margin:0 }}>৮ম শ্রেণীর ক বিভাগ ধারাবাহিকভাবে বিজ্ঞানে দুর্বল পারফর্ম করছে। অধ্যায় ৪–৬ এ প্রতিকারমূলক সেশনের পরামর্শ।</p>
          </div>
        </div>
      )}

      {subTab==='create' && (
        <Card>
          <SectionTitle>নতুন মূল্যায়ন তৈরি করুন</SectionTitle>
          {created ? (
            <div style={{ textAlign:'center', padding:40 }}>
              <div style={{ fontSize:40, marginBottom:12 }}>✅</div>
              <div style={{ fontFamily:"'Hind Siliguri',sans-serif", fontSize:16, fontWeight:600, color:C.success }}>মূল্যায়ন প্রকাশিত!</div>
              <Btn onClick={() => { setCreated(false); setCreateForm({ title:'', subject:'গণিত', type:'মাসিক পরীক্ষা', totalMarks:'50' }) }} style={{ marginTop:16 }}>নতুন তৈরি করুন</Btn>
            </div>
          ) : (
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
              {[
                { label:'শিরোনাম', field:'title', type:'text', placeholder:'মূল্যায়নের শিরোনাম...' },
                { label:'বিষয়', field:'subject', type:'select', options:['গণিত','বাংলা','ইংরেজি','বিজ্ঞান','সমাজ বিজ্ঞান','আইসিটি'] },
                { label:'ধরন', field:'type', type:'select', options:['মাসিক পরীক্ষা','কুইজ','শ্রেণী পরীক্ষা','মডেল টেস্ট'] },
                { label:'মোট নম্বর', field:'totalMarks', type:'number', placeholder:'50' },
              ].map((f: any, i) => (
                <div key={i}>
                  <label style={{ fontFamily:"'Hind Siliguri',sans-serif", fontSize:13, fontWeight:600, display:'block', marginBottom:6 }}>{f.label}</label>
                  {f.type==='select' ? (
                    <select value={(createForm as any)[f.field]} onChange={e => setCreateForm(prev => ({...prev, [f.field]:e.target.value}))} style={{ width:'100%', padding:'10px 12px', borderRadius:6, border:`1px solid ${C.muted}`, fontSize:13 }}>
                      {f.options.map((o: string) => <option key={o}>{o}</option>)}
                    </select>
                  ) : (
                    <input type={f.type} value={(createForm as any)[f.field]} onChange={e => setCreateForm(prev => ({...prev, [f.field]:e.target.value}))} placeholder={f.placeholder} style={{ width:'100%', padding:'10px 12px', borderRadius:6, border:`1px solid ${C.muted}`, fontSize:13, boxSizing:'border-box' as const }} />
                  )}
                </div>
              ))}
              <div style={{ gridColumn:'1/-1' }}>
                <Btn variant="gold" onClick={handleCreate}>✦ মূল্যায়ন প্রকাশ করুন</Btn>
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  )
}

function TeacherProfile() {
  const { lang } = useLang()
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
      <Card style={{ background:`linear-gradient(135deg, ${C.dark} 0%, ${C.navy} 100%)`, color:'white' }}>
        <div style={{ display:'flex', gap:16, alignItems:'flex-start', flexWrap:'wrap' as const }}>
          <div style={{ width:80, height:80, borderRadius:'50%', background:`linear-gradient(135deg, ${C.forest}, ${C.emerald})`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:32, fontWeight:700, border:`3px solid ${C.gold}`, flexShrink:0 }}>ফ</div>
          <div style={{ flex:1 }}>
            <h2 style={{ fontFamily:"'Hind Siliguri',sans-serif", fontSize:24, fontWeight:700, margin:'0 0 6px', color:'white' }}>ফাতেমা বেগম</h2>
            <div style={{ display:'flex', gap:8, flexWrap:'wrap' as const, marginBottom:6 }}><Badge color="gold">সহকারী শিক্ষক</Badge><span style={{ fontSize:13, color:'rgba(255,255,255,0.7)' }}>📍 খুলনা সরকারি উচ্চ বিদ্যালয়</span></div>
            <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:12, color:'rgba(255,255,255,0.5)' }}>ID: TH-2024-04471</div>
          </div>
          <div style={{ background:'rgba(0,92,75,0.4)', borderRadius:8, padding:'8px 14px', border:`1px solid rgba(0,92,75,0.5)`, textAlign:'center' as const }}>
            <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:28, fontWeight:700, color:C.gold }}>78</div>
            <div style={{ display:'flex', gap:4, alignItems:'center', justifyContent:'center' }}><AIBadge /><span style={{ fontSize:10, color:'rgba(255,255,255,0.6)' }}>বদলি স্কোর</span></div>
          </div>
        </div>
      </Card>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))', gap:16 }}>
        <KPICard label="মূল্যায়ন তৈরি" value={12} icon="📝" color={C.forest} />
        <KPICard label="গড় শ্রেণী স্কোর" value="74.2" sub="/100" icon="📊" color={C.gold} />
        <KPICard label="পাসের হার" value="88%" icon="✅" color={C.success} />
        <KPICard label="অভিজ্ঞতা" value="৮ বছর" icon="🎓" color={C.info} />
      </div>
      <Card>
        <SectionTitle>বিষয় দক্ষতা</SectionTitle>
        {[{ sub:'গণিত', pct:90, level:'বিশেষজ্ঞ' },{ sub:'বিজ্ঞান', pct:65, level:'মধ্যবর্তী' },{ sub:'আইসিটি', pct:45, level:'শিক্ষানবিশ' }].map(e => (
          <div key={e.sub} style={{ marginBottom:14 }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
              <span style={{ fontFamily:"'Hind Siliguri',sans-serif", fontSize:13, fontWeight:600 }}>{e.sub}</span>
              <div style={{ display:'flex', gap:6 }}><Badge color={e.pct>=80?'green':e.pct>=50?'amber':'grey'}>{e.level}</Badge><span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:12, color:'#666' }}>{e.pct}%</span></div>
            </div>
            <div style={{ height:6, background:C.muted, borderRadius:3 }}><div style={{ height:'100%', width:`${e.pct}%`, background:e.pct>=80?C.success:e.pct>=50?C.warning:C.info, borderRadius:3, transition:'width 1s ease' }} /></div>
          </div>
        ))}
      </Card>
      <Card>
        <SectionTitle>প্রশাসনিক নোট</SectionTitle>
        <div style={{ padding:'10px 14px', background:C.warm, borderRadius:8, marginBottom:10 }}>
          <div style={{ display:'flex', gap:6, marginBottom:4 }}><Badge color="navy">বিদ্যালয় প্রশাসক</Badge><span style={{ fontSize:11, color:'#999' }}>১২ মার্চ ২০২৪</span></div>
          <p style={{ fontFamily:"'Hind Siliguri',sans-serif", fontSize:13, margin:0, color:C.dark }}>নিয়মিত ক্লাস নেন এবং শিক্ষার্থীদের সাথে ভালো সম্পর্ক বজায় রাখেন।</p>
        </div>
        <textarea rows={2} placeholder="নোট যোগ করুন..." style={{ width:'100%', padding:'10px 12px', borderRadius:6, border:`1px solid ${C.muted}`, fontSize:13, fontFamily:"'Hind Siliguri',sans-serif", boxSizing:'border-box' as const, marginBottom:8, resize:'vertical' as const }} />
        <Btn size="sm">নোট সংরক্ষণ</Btn>
      </Card>
    </div>
  )
}

export function TeacherDashboard({ activeTab }: { activeTab: string }) {
  const { lang } = useLang()
  if (activeTab==='assessments') return <TeacherAssessments />
  if (activeTab==='profile') return <TeacherProfile />
  if (activeTab==='notices') return <NoticesTab />
  if (activeTab==='messages') return <MessagesTab />
  if (activeTab==='heatmap') return (
    <div>
      <SectionTitle badge={<AIBadge />}>ঝুঁকির হিটম্যাপ</SectionTitle>
      <Card style={{ overflowX:'auto' as const }}>
        <table style={{ borderCollapse:'separate' as const, borderSpacing:3, width:'100%' }}>
          <thead><tr><th style={{ padding:'8px 10px', fontFamily:"'Hind Siliguri',sans-serif", fontSize:12, textAlign:'left' as const, color:'#555' }}>শিক্ষার্থী</th>{['গণিত','বাংলা','ইংরেজি','বিজ্ঞান','সমাজ'].map(s => <th key={s} style={{ padding:'8px 10px', fontFamily:"'Hind Siliguri',sans-serif", fontSize:11, fontWeight:600, color:'#555', textAlign:'center' as const, minWidth:60 }}>{s}</th>)}</tr></thead>
          <tbody>{STUDENTS_MOCK.map(s => {
            const scores = [Math.floor(40+s.score*0.5),Math.floor(35+s.score*0.48),Math.floor(30+s.score*0.45),Math.floor(38+s.score*0.47),Math.floor(36+s.score*0.49)]
            return <tr key={s.id}>
              <td style={{ padding:'6px 10px', fontFamily:"'Hind Siliguri',sans-serif", fontSize:12, fontWeight:600, whiteSpace:'nowrap' as const }}>{s.name}</td>
              {scores.map((sc,i) => <td key={i} style={{ padding:'10px 6px', background:sc>=85?C.success:sc>=70?C.emerald:sc>=55?C.gold:sc>=40?C.warning:C.danger, borderRadius:6, textAlign:'center' as const, fontFamily:"'JetBrains Mono',monospace", fontSize:12, fontWeight:700, color:'white' }}>{sc}</td>)}
            </tr>
          })}</tbody>
        </table>
      </Card>
    </div>
  )
  if (activeTab==='flagged') return (
    <div>
      <SectionTitle badge={<AIBadge />}>চিহ্নিত শিক্ষার্থী</SectionTitle>
      {STUDENTS_MOCK.filter(s=>s.risk!=='low').map(s => (
        <Card key={s.id} style={{ marginBottom:12, borderLeft:`4px solid ${s.risk==='high'?C.danger:C.gold}` }}>
          <div style={{ display:'flex', gap:12, alignItems:'flex-start', flexWrap:'wrap' as const }}>
            <div style={{ width:44, height:44, borderRadius:'50%', background:s.risk==='high'?C.dangerBg:C.warningBg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0 }}>{s.name[0]}</div>
            <div style={{ flex:1 }}>
              <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:6, flexWrap:'wrap' as const }}>
                <span style={{ fontFamily:"'Hind Siliguri',sans-serif", fontSize:15, fontWeight:700 }}>{s.name}</span>
                <RiskBadge level={s.risk} lang={lang} />
                <Badge color="grey">{lang==='bn'?'শ্রেণী':'Class'} {s.class}{s.section}</Badge>
              </div>
              <div style={{ padding:'8px 12px', background:C.warm, borderRadius:6, marginBottom:8 }}>
                <div style={{ display:'flex', gap:4, alignItems:'center', marginBottom:4 }}><AIBadge /><span style={{ fontSize:11, fontWeight:700, color:C.dark }}>পরামর্শ</span></div>
                <p style={{ fontFamily:"'Hind Siliguri',sans-serif", fontSize:12, color:'#555', margin:0 }}>অভিভাবকের সাথে যোগাযোগ করুন এবং অতিরিক্ত ক্লাসের ব্যবস্থা করুন।</p>
              </div>
              <Btn size="sm" variant="ghost">অভিভাবককে সতর্ক করুন</Btn>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
  // Default overview
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))', gap:14 }}>
        <KPICard label="মোট শিক্ষার্থী" value="126" icon="🎓" color={C.forest} />
        <KPICard label="পাসের হার" value="88%" icon="✅" color={C.success} />
        <KPICard label="গড় স্কোর" value="74.2" icon="📊" color={C.gold} />
        <KPICard label="উপস্থিতির হার" value="91%" icon="📅" color={C.info} />
      </div>
      <Card>
        <SectionTitle>শিক্ষার্থীর তালিকা (দ্রুত দৃষ্টিভঙ্গি)</SectionTitle>
        <table style={{ width:'100%', borderCollapse:'collapse', fontFamily:"'Hind Siliguri',sans-serif", fontSize:13 }}>
          <thead><tr style={{ background:C.warm }}>{['নাম','স্কোর','উপস্থিতি','ঝুঁকি'].map(h => <th key={h} style={{ padding:'8px 12px', textAlign:'left', fontWeight:700, fontSize:12, color:'#555', borderBottom:`1px solid ${C.muted}` }}>{h}</th>)}</tr></thead>
          <tbody>{STUDENTS_MOCK.map((s,i) => <tr key={s.id} style={{ borderBottom:`1px solid ${C.muted}`, background:i%2===0?'transparent':C.warm+'50' }}>
            <td style={{ padding:'8px 12px', fontWeight:600 }}>{s.name}</td>
            <td style={{ padding:'8px 12px', fontFamily:"'JetBrains Mono',monospace", fontWeight:600, color:C.forest }}>{s.score}</td>
            <td style={{ padding:'8px 12px' }}><Badge color={s.attendance>=85?'green':'amber'}>{s.attendance}%</Badge></td>
            <td style={{ padding:'8px 12px' }}><RiskBadge level={s.risk} lang={lang} /></td>
          </tr>)}</tbody>
        </table>
      </Card>
    </div>
  )
}

// ─── ADMIN ────────────────────────────────────────────────────────────────────
export function AdminDashboard({ activeTab }: { activeTab: string }) {
  const { lang } = useLang()
  if (activeTab==='notices') return <NoticesTab />
  if (activeTab==='messages') return <MessagesTab />
  if (activeTab==='students') return (
    <div>
      <SectionTitle>শিক্ষার্থীর রেকর্ড</SectionTitle>
      <Card>
        <table style={{ width:'100%', borderCollapse:'collapse', fontFamily:"'Hind Siliguri',sans-serif", fontSize:13 }}>
          <thead><tr style={{ background:C.warm }}>{['নাম','শ্রেণী','বিভাগ','স্কোর','উপস্থিতি','ঝুঁকি'].map(h => <th key={h} style={{ padding:'10px 12px', textAlign:'left', fontWeight:700, fontSize:12, color:'#555', borderBottom:`1px solid ${C.muted}` }}>{h}</th>)}</tr></thead>
          <tbody>{STUDENTS_MOCK.map((s,i) => <tr key={s.id} style={{ borderBottom:`1px solid ${C.muted}`, background:i%2===0?'transparent':C.warm+'50' }}>
            <td style={{ padding:'10px 12px', fontWeight:600 }}>{s.name}</td>
            <td style={{ padding:'10px 12px' }}>{s.class}</td>
            <td style={{ padding:'10px 12px' }}>{s.section}</td>
            <td style={{ padding:'10px 12px', fontFamily:"'JetBrains Mono',monospace", fontWeight:600, color:C.forest }}>{s.score}</td>
            <td style={{ padding:'10px 12px' }}><Badge color={s.attendance>=85?'green':'amber'}>{s.attendance}%</Badge></td>
            <td style={{ padding:'10px 12px' }}><RiskBadge level={s.risk} lang={lang} /></td>
          </tr>)}</tbody>
        </table>
      </Card>
    </div>
  )
  // Default overview
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:16 }}>
        <KPICard label="মোট শিক্ষার্থী" value="1,248" icon="🎓" color={C.forest} />
        <KPICard label="মোট শিক্ষক" value="42" icon="👩‍🏫" color={C.info} />
        <KPICard label="আজকের উপস্থিতি" value="94.2%" icon="📅" color={C.success} />
        <KPICard label="পাসের হার" value="87.3%" icon="✅" color={C.emerald} />
        <KPICard label="ঝরে পড়ার ঝুঁকি" value="23" icon="⚠️" color={C.warning} />
      </div>
      <Card>
        <SectionTitle>বিদ্যালয়ের পারফরম্যান্সের ধারা</SectionTitle>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={[{m:'জানু',score:71},{m:'ফেব্রু',score:73},{m:'মার্চ',score:70},{m:'এপ্রিল',score:76},{m:'মে',score:75},{m:'জুন',score:78}]}>
            <CartesianGrid strokeDasharray="3 3" stroke={C.muted} /><XAxis dataKey="m" tick={{ fontSize:11 }} /><YAxis domain={[60,90]} tick={{ fontSize:11 }} /><Tooltip content={<CustomTooltip />} />
            <Bar dataKey="score" name="গড় স্কোর" fill={C.forest} radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  )
}

// ─── GOVERNMENT ───────────────────────────────────────────────────────────────
function PolicySim() {
  const { lang } = useLang()
  const [budget, setBudget] = useState({ training:100, infra:200, edtech:50, meals:150, connectivity:30 })
  const [aiText, setAiText] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const total = Object.values(budget).reduce((a,b) => a+b, 0)

  const getAI = async () => {
    setAiLoading(true); setAiText('')
    const data = await getAiPolicyInsight({ budget, lang })
    setAiText(data.text || ''); setAiLoading(false)
  }

  return (
    <div>
      <SectionTitle badge={<AIBadge />}>নীতি সিমুলেশন</SectionTitle>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
        <Card>
          <h4 style={{ fontFamily:"'Hind Siliguri',sans-serif", fontSize:14, fontWeight:700, marginBottom:16, color:C.dark }}>বাজেট বরাদ্দ — <span style={{ color:C.forest, fontFamily:"'JetBrains Mono',monospace" }}>৳{total} কোটি</span></h4>
          {[
            { key:'training', label:'শিক্ষক প্রশিক্ষণ', max:500, color:C.forest },
            { key:'infra', label:'অবকাঠামো', max:1000, color:C.emerald },
            { key:'edtech', label:'EdTech', max:300, color:C.info },
            { key:'meals', label:'মিল কর্মসূচি', max:400, color:C.gold },
            { key:'connectivity', label:'গ্রামীণ সংযোগ', max:200, color:'#A23B72' },
          ].map(s => (
            <div key={s.key} style={{ marginBottom:16 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                <span style={{ fontFamily:"'Hind Siliguri',sans-serif", fontSize:13, fontWeight:600 }}>{s.label}</span>
                <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:13, color:s.color, fontWeight:700 }}>৳{(budget as any)[s.key]} কোটি</span>
              </div>
              <input type="range" min={0} max={s.max} value={(budget as any)[s.key]} onChange={e => setBudget(b => ({...b, [s.key]:parseInt(e.target.value)}))} style={{ width:'100%', accentColor:s.color, cursor:'pointer' }} />
            </div>
          ))}
          <Btn onClick={getAI} disabled={aiLoading} variant="gold">✦ {aiLoading?'বিশ্লেষণ হচ্ছে...':'AI বিশ্লেষণ করুন'}</Btn>
        </Card>
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          {[
            { label:'স্কোর উন্নতি', value:`+${(budget.training*0.015+budget.edtech*0.018).toFixed(1)}%`, icon:'📈', color:C.success, bg:C.successBg },
            { label:'ঝরে পড়া হ্রাস', value:`-${(budget.meals*0.012+budget.connectivity*0.015).toFixed(1)}%`, icon:'🎯', color:C.forest, bg:C.successBg },
            { label:'প্রভাবিত শিক্ষার্থী', value:`${((budget.infra*800+budget.connectivity*1200)/1000000).toFixed(1)}M`, icon:'🎓', color:C.info, bg:C.infoBg },
            { label:'প্রশিক্ষিত শিক্ষক', value:`${Math.floor(budget.training*8).toLocaleString()}`, icon:'👩‍🏫', color:C.gold, bg:C.warningBg },
          ].map((item,i) => (
            <div key={i} style={{ background:item.bg, borderRadius:10, padding:'14px 16px', border:`1px solid ${item.color}22`, display:'flex', gap:12, alignItems:'center' }}>
              <span style={{ fontSize:24 }}>{item.icon}</span>
              <div><div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:22, fontWeight:700, color:item.color }}>{item.value}</div><div style={{ fontFamily:"'Hind Siliguri',sans-serif", fontSize:12, color:'#666' }}>{item.label}</div></div>
            </div>
          ))}
          {aiText && (
            <div style={{ padding:'14px 16px', background:C.warningBg, borderRadius:10, borderLeft:`3px solid ${C.gold}` }}>
              <div style={{ display:'flex', gap:6, alignItems:'center', marginBottom:6 }}><AIBadge /><span style={{ fontFamily:"'Sora',sans-serif", fontSize:11, fontWeight:700, color:C.warning }}>AI বিশ্লেষণ</span></div>
              <p style={{ fontFamily:"'Hind Siliguri',sans-serif", fontSize:12, color:C.warning, margin:0 }}>{aiText}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function GovDashboard({ activeTab }: { activeTab: string }) {
  const { lang } = useLang()
  const [national, setNational] = useState<any>(null)
  const [aiReport, setAiReport] = useState('')
  const [aiLoading, setAiLoading] = useState(false)

  useEffect(() => { getNationalAnalytics().then(d => setNational(d)) }, [])

  const generateReport = async (district: string) => {
    setAiLoading(true); setAiReport('')
    const data = await getAiDistrictReport({ district, lang })
    setAiReport(data.text || ''); setAiLoading(false)
  }

  if (activeTab==='policy') return <PolicySim />
  if (activeTab==='notices') return (
    <div>
      <SectionTitle>নতুন নোটিশ তৈরি করুন</SectionTitle>
      <Card style={{ marginBottom:20 }}>
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          <input placeholder="নোটিশের শিরোনাম..." style={{ padding:'10px 12px', borderRadius:6, border:`1px solid ${C.muted}`, fontSize:13, fontFamily:"'Hind Siliguri',sans-serif" }} />
          <textarea rows={4} placeholder="নোটিশের বিস্তারিত বিবরণ..." style={{ padding:'10px 12px', borderRadius:6, border:`1px solid ${C.muted}`, fontSize:13, fontFamily:"'Hind Siliguri',sans-serif", resize:'vertical' as const }} />
          <Btn variant="gold">নোটিশ প্রকাশ করুন</Btn>
        </div>
      </Card>
    </div>
  )
  if (activeTab==='messages') return <MessagesTab inboxMode />
  if (activeTab==='aireports') return (
    <div>
      <SectionTitle badge={<AIBadge />}>AI প্রতিবেদন</SectionTitle>
      <Card style={{ marginBottom:20 }}>
        <div style={{ display:'flex', gap:12, flexWrap:'wrap', marginBottom:16 }}>
          <select style={{ padding:'9px 12px', borderRadius:6, border:`1px solid ${C.muted}`, fontSize:13 }}><option>সকল বিভাগ</option>{['ঢাকা','চট্টগ্রাম','খুলনা','রাজশাহী'].map(d => <option key={d}>{d}</option>)}</select>
          <select style={{ padding:'9px 12px', borderRadius:6, border:`1px solid ${C.muted}`, fontSize:13 }}><option>সকল জেলা</option>{national?.districts?.map((d: any) => <option key={d.name}>{d.name}</option>)}</select>
        </div>
        <Btn onClick={() => generateReport('খুলনা')} disabled={aiLoading} variant="gold">✦ {aiLoading?'তৈরি হচ্ছে...':'AI রিপোর্ট তৈরি করুন'}</Btn>
      </Card>
      {aiReport && (
        <Card style={{ borderLeft:`4px solid ${C.gold}` }}>
          <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:12 }}><AIBadge /><span style={{ fontFamily:"'Sora',sans-serif", fontSize:14, fontWeight:700 }}>খুলনা জেলা শিক্ষা প্রতিবেদন</span></div>
          <div style={{ fontFamily:"'Hind Siliguri',sans-serif", fontSize:13, color:'#444', lineHeight:1.8, whiteSpace:'pre-wrap' as const }}>{aiReport}</div>
        </Card>
      )}
    </div>
  )

  // National overview (default)
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
      {national && (
        <>
          <div style={{ padding:'12px 16px', background:C.dangerBg, borderRadius:10, borderLeft:`4px solid ${C.danger}`, display:'flex', gap:10, alignItems:'center' }}>
            <span style={{ fontSize:20 }}>⚠️</span>
            <span style={{ fontFamily:"'Hind Siliguri',sans-serif", fontSize:13, color:C.danger, fontWeight:600 }}>
              {lang==='bn'?'৩টি জেলায় ঝরে পড়ার ঝুঁকি ১৫% এর বেশি — তাৎক্ষণিক হস্তক্ষেপ প্রয়োজন':'3 districts have dropout risk above 15% — Immediate intervention required'}
            </span>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:16 }}>
            <KPICard label="জাতীয় গড় স্কোর" value={national.avgScore} icon="📊" color={C.forest} trend={2.4} />
            <KPICard label="মোট শিক্ষার্থী" value="৪.০২ কোটি" icon="🎓" color={C.info} />
            <KPICard label="মোট বিদ্যালয়" value="১,৫২,০০০" icon="🏫" color={C.emerald} />
            <KPICard label="ঝরে পড়ার ঝুঁকি" value={`${national.dropoutRisk}%`} icon="⚠️" color={C.warning} />
          </div>
          <Card>
            <SectionTitle>জেলাভিত্তিক র‍্যাংকিং</SectionTitle>
            <table style={{ width:'100%', borderCollapse:'collapse', fontFamily:"'Hind Siliguri',sans-serif", fontSize:13 }}>
              <thead><tr style={{ background:C.warm }}>{['#','জেলা','বিভাগ','গড় স্কোর','ঝরে পড়া','স্ট্যাটাস'].map(h => <th key={h} style={{ padding:'8px 10px', textAlign:'left', fontWeight:700, fontSize:11, color:'#555', borderBottom:`1px solid ${C.muted}` }}>{h}</th>)}</tr></thead>
              <tbody>{national.districts?.sort((a:any,b:any)=>b.score-a.score).map((d:any,i:number) => (
                <tr key={d.name} style={{ borderBottom:`1px solid ${C.muted}`, background:i%2===0?'transparent':C.warm+'50' }}>
                  <td style={{ padding:'8px 10px', fontFamily:"'JetBrains Mono',monospace", fontWeight:700 }}>{i+1}</td>
                  <td style={{ padding:'8px 10px', fontWeight:600 }}>{d.name}</td>
                  <td style={{ padding:'8px 10px', color:'#666' }}>{d.div}</td>
                  <td style={{ padding:'8px 10px', fontFamily:"'JetBrains Mono',monospace", fontWeight:600, color:C.forest }}>{d.score}</td>
                  <td style={{ padding:'8px 10px' }}><Badge color={d.dropout<10?'green':d.dropout<15?'amber':'red'}>{d.dropout}%</Badge></td>
                  <td style={{ padding:'8px 10px' }}><Badge color={d.dropout<10?'green':d.dropout<15?'amber':'red'}>{d.dropout<10?'ভালো':d.dropout<15?'সতর্কতা':'জরুরি'}</Badge></td>
                </tr>
              ))}</tbody>
            </table>
          </Card>
          <Card>
            <SectionTitle>জাতীয় পারফরম্যান্সের ধারা (২০১৯–২০২৪)</SectionTitle>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={national.trend}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.muted} /><XAxis dataKey="year" tick={{ fontSize:11 }} /><YAxis domain={[55,75]} tick={{ fontSize:11 }} /><Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="score" name="জাতীয় গড়" stroke={C.forest} strokeWidth={3} dot={{ r:5, fill:C.gold }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </>
      )}
    </div>
  )
}
