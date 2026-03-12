import { useState, useEffect } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { Sidebar, TopBar } from '../components/Layout'
import { useAuth } from '../context/AuthContext'
import { useLang } from '../context/LangContext'
import { C } from '../components/ui'
import { StudentDashboard, ParentDashboard, TeacherDashboard, AdminDashboard, GovDashboard } from './dashboards'

const NOTIFICATIONS = [
  { id:1, icon:'📝', title:'নতুন মূল্যায়ন প্রকাশিত',          time:'২ মিনিট আগে', read:false },
  { id:2, icon:'📢', title:'SSC পরীক্ষার নোটিশ',               time:'১ ঘণ্টা আগে',  read:false },
  { id:3, icon:'✅', title:'আপনার মূল্যায়ন মূল্যায়িত হয়েছে', time:'৩ ঘণ্টা আগে', read:true  },
]

const TAB_LABELS: Record<string, { bn: string; en: string }> = {
  overview:        { bn:'সংক্ষিপ্ত বিবরণ',      en:'Overview'             },
  library:         { bn:'ডিজিটাল লাইব্রেরি',    en:'Digital Library'      },
  assessments:     { bn:'মূল্যায়ন',             en:'Assessments'          },
  cognitive:       { bn:'জ্ঞান মানচিত্র',       en:'Cognitive Map'        },
  performance:     { bn:'পারফরম্যান্স',          en:'Performance'          },
  growth:          { bn:'বিকাশ পরিকল্পনা',      en:'Growth Plan'          },
  career:          { bn:'ক্যারিয়ার পথ',         en:'Career Path'          },
  gpa:             { bn:'GPA পূর্বাভাস',         en:'GPA Predictor'        },
  askteacher:      { bn:'শিক্ষককে প্রশ্ন',      en:'Ask Teacher'          },
  notices:         { bn:'নোটিশ বোর্ড',           en:'Notice Board'         },
  messages:        { bn:'বার্তা',                en:'Messages'             },
  attendance:      { bn:'উপস্থিতি',             en:'Attendance'           },
  heatmap:         { bn:'ঝুঁকির হিটম্যাপ',      en:'Risk Heatmap'         },
  flagged:         { bn:'চিহ্নিত শিক্ষার্থী',  en:'Flagged Students'     },
  studentprofiles: { bn:"শিক্ষার্থীর প্রোফাইল", en:'Student Profiles'     },
  syllabus:        { bn:'পাঠ্যক্রম ট্র্যাকার', en:'Syllabus Tracker'     },
  training:        { bn:'প্রশিক্ষণ',            en:'Training'             },
  profile:         { bn:'আমার প্রোফাইল',        en:'My Profile'           },
  students:        { bn:"শিক্ষার্থীর রেকর্ড",   en:'Student Records'      },
  teachers:        { bn:"শিক্ষকের তালিকা",      en:'Teacher Registry'     },
  exams:           { bn:'পরীক্ষা ও ফলাফল',      en:'Exam & Results'       },
  reports:         { bn:'স্বয়ংক্রিয় রিপোর্ট', en:'Automated Reports'    },
  fees:            { bn:'রাজস্ব ও ফি',           en:'Revenue & Fees'       },
  national:        { bn:'জাতীয় সংক্ষিপ্ত বিবরণ',en:'National Overview'   },
  district:        { bn:'জেলা বিশ্লেষণ',        en:'District Analytics'   },
  dropout:         { bn:'ঝরে পড়ার ঝুঁকি',      en:'Dropout Risk'         },
  teacherregistry: { bn:"শিক্ষকের তালিকা",      en:'Teacher Registry'     },
  assessmentintel: { bn:'মূল্যায়ন বুদ্ধিমত্তা',en:'Assessment Intel'     },
  talent:          { bn:'প্রতিভা ইঞ্জিন',       en:'Talent Engine'        },
  policy:          { bn:'নীতি সিমুলেশন',        en:'Policy Simulation'    },
  aireports:       { bn:'AI প্রতিবেদন',         en:'AI Reports'           },
  transfers:       { bn:'বদলি সুপারিশ',         en:'Transfer Recs'        },
  revenue:         { bn:'রাজস্ব ও তহবিল',       en:'Revenue & Funding'    },
}

export default function Dashboard() {
  const { role } = useParams<{ role: string }>()
  const { user, loading } = useAuth()
  const { lang } = useLang()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [collapsed, setCollapsed] = useState(false)
  const [showNotifs, setShowNotifs] = useState(false)

  const activeTab = searchParams.get('tab') || (role === 'government' ? 'national' : 'overview')

  useEffect(() => {
    if (!loading && !user) navigate('/')
    if (!loading && user && user.role !== role) navigate(`/dashboard/${user.role}`)
  }, [user, loading, role])

  const setActiveTab = (tab: string) => {
    setSearchParams({ tab })
    setShowNotifs(false)
  }

  if (loading || !user) return (
    <div style={{ height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:C.warm, fontFamily:"'Hind Siliguri',sans-serif", color:'#888', fontSize:16 }}>
      লোড হচ্ছে...
    </div>
  )

  const title = TAB_LABELS[activeTab]?.[lang] || activeTab

  const renderDashboard = () => {
    switch (role) {
      case 'student':    return <StudentDashboard    activeTab={activeTab} />
      case 'parent':     return <ParentDashboard     activeTab={activeTab} />
      case 'teacher':    return <TeacherDashboard    activeTab={activeTab} />
      case 'admin':      return <AdminDashboard      activeTab={activeTab} />
      case 'government': return <GovDashboard        activeTab={activeTab} />
      default: return <div>Unknown role</div>
    }
  }

  return (
    <div style={{ display:'flex', height:'100vh', overflow:'hidden', background:C.warm }}>
      <Sidebar role={role!} activeTab={activeTab} onTabChange={setActiveTab} collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} />
      <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
        <TopBar title={title} showNotifs={showNotifs} onNotifClick={() => setShowNotifs(s => !s)} notifications={NOTIFICATIONS} />
        <div style={{ flex:1, overflowY:'auto', padding:24, background:C.warm }} onClick={() => showNotifs && setShowNotifs(false)}>
          {renderDashboard()}
        </div>
      </div>
    </div>
  )
}
