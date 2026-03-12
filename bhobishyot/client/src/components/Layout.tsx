import { Logo, Badge, C } from './ui'
import { useAuth } from '../context/AuthContext'
import { useLang } from '../context/LangContext'

const SIDEBAR_ITEMS: Record<string, { id: string; icon: string; bn: string; en: string }[]> = {
  student: [
    { id:'overview',     icon:'🏠', bn:'সংক্ষিপ্ত বিবরণ',     en:'Overview'         },
    { id:'library',      icon:'📚', bn:'ডিজিটাল লাইব্রেরি',   en:'Digital Library'  },
    { id:'assessments',  icon:'📝', bn:'মূল্যায়ন',            en:'Assessments'      },
    { id:'cognitive',    icon:'🧠', bn:'জ্ঞান মানচিত্র',      en:'Cognitive Map'    },
    { id:'performance',  icon:'📈', bn:'পারফরম্যান্স',         en:'Performance'      },
    { id:'growth',       icon:'🎯', bn:'বিকাশ পরিকল্পনা',     en:'Growth Plan'      },
    { id:'career',       icon:'🚀', bn:'ক্যারিয়ার পথ',        en:'Career Path'      },
    { id:'gpa',          icon:'🎓', bn:'GPA পূর্বাভাস',        en:'GPA Predictor'    },
    { id:'askteacher',   icon:'💬', bn:'শিক্ষককে প্রশ্ন',     en:'Ask Teacher'      },
    { id:'notices',      icon:'📢', bn:'নোটিশ বোর্ড',          en:'Notices'          },
    { id:'messages',     icon:'✉️', bn:'বার্তা',               en:'Messages'         },
  ],
  parent: [
    { id:'overview',     icon:'🏠', bn:'সংক্ষিপ্ত বিবরণ',     en:'Overview'         },
    { id:'performance',  icon:'📈', bn:'পারফরম্যান্স',         en:'Performance'      },
    { id:'attendance',   icon:'📅', bn:'উপস্থিতি',            en:'Attendance'       },
    { id:'assessments',  icon:'📝', bn:'মূল্যায়ন ফলাফল',     en:'Assessment Results'},
    { id:'cognitive',    icon:'🧠', bn:'জ্ঞান প্রোফাইল',      en:'Cognitive Profile'},
    { id:'notices',      icon:'📢', bn:'নোটিশ বোর্ড',          en:'Notices'          },
    { id:'messages',     icon:'✉️', bn:'বার্তা',               en:'Messages'         },
  ],
  teacher: [
    { id:'overview',        icon:'🏠', bn:'শ্রেণীর বিবরণ',        en:'Class Overview'    },
    { id:'heatmap',         icon:'🔥', bn:'ঝুঁকির হিটম্যাপ',      en:'Risk Heatmap'      },
    { id:'flagged',         icon:'⚠️', bn:'চিহ্নিত শিক্ষার্থী',  en:'Flagged Students'  },
    { id:'assessments',     icon:'📝', bn:'মূল্যায়ন',            en:'Assessments'       },
    { id:'studentprofiles', icon:'👤', bn:'শিক্ষার্থীর প্রোফাইল',en:'Student Profiles'  },
    { id:'syllabus',        icon:'📋', bn:'পাঠ্যক্রম ট্র্যাকার', en:'Syllabus Tracker'  },
    { id:'library',         icon:'📚', bn:'ডিজিটাল লাইব্রেরি',   en:'Digital Library'   },
    { id:'training',        icon:'🏫', bn:'প্রশিক্ষণ',            en:'Training'          },
    { id:'profile',         icon:'👩‍🏫', bn:'আমার প্রোফাইল',      en:'My Profile'        },
    { id:'notices',         icon:'📢', bn:'নোটিশ বোর্ড',          en:'Notices'           },
    { id:'messages',        icon:'✉️', bn:'বার্তা',               en:'Messages'          },
  ],
  admin: [
    { id:'overview',   icon:'🏫', bn:'বিদ্যালয়ের বিবরণ',   en:'School Overview'   },
    { id:'attendance', icon:'📅', bn:'ডিজিটাল উপস্থিতি',   en:'Digital Attendance'},
    { id:'students',   icon:'🎓', bn:'শিক্ষার্থীর রেকর্ড', en:'Student Records'   },
    { id:'teachers',   icon:'👩‍🏫', bn:'শিক্ষকের তালিকা',   en:'Teacher Registry'  },
    { id:'exams',      icon:'📊', bn:'পরীক্ষা ও ফলাফল',    en:'Exam & Results'    },
    { id:'reports',    icon:'📄', bn:'স্বয়ংক্রিয় রিপোর্ট',en:'Automated Reports' },
    { id:'fees',       icon:'💰', bn:'রাজস্ব ও ফি',         en:'Revenue & Fees'    },
    { id:'notices',    icon:'📢', bn:'নোটিশ বোর্ড',          en:'Notices'           },
    { id:'messages',   icon:'✉️', bn:'বার্তা',               en:'Messages'          },
  ],
  government: [
    { id:'national',          icon:'🏛️', bn:'জাতীয় সংক্ষিপ্ত বিবরণ',   en:'National Overview'     },
    { id:'district',          icon:'🗺️', bn:'জেলা বিশ্লেষণ',            en:'District Analytics'    },
    { id:'dropout',           icon:'⚠️', bn:'ঝরে পড়ার ঝুঁকি',         en:'Dropout Risk'          },
    { id:'teacherregistry',   icon:'👩‍🏫', bn:'শিক্ষকের তালিকা',         en:'Teacher Registry'      },
    { id:'assessmentintel',   icon:'📊', bn:'মূল্যায়ন বুদ্ধিমত্তা',    en:'Assessment Intel'      },
    { id:'talent',            icon:'⭐', bn:'প্রতিভা ইঞ্জিন',           en:'Talent Engine'         },
    { id:'policy',            icon:'⚖️', bn:'নীতি সিমুলেশন',           en:'Policy Simulation'     },
    { id:'aireports',         icon:'🤖', bn:'AI প্রতিবেদন',            en:'AI Reports'            },
    { id:'transfers',         icon:'🔄', bn:'বদলি সুপারিশ',            en:'Transfer Recs'         },
    { id:'messages',          icon:'✉️', bn:'বার্তার ইনবক্স',           en:'Messages Inbox'        },
    { id:'notices',           icon:'📢', bn:'নোটিশ তৈরি',              en:'Create Notices'        },
    { id:'revenue',           icon:'💰', bn:'রাজস্ব ও তহবিল',          en:'Revenue & Funding'     },
  ],
}

interface SidebarProps {
  role: string
  activeTab: string
  onTabChange: (id: string) => void
  collapsed: boolean
  onToggle: () => void
}

export const Sidebar = ({ role, activeTab, onTabChange, collapsed, onToggle }: SidebarProps) => {
  const { logout } = useAuth()
  const { lang } = useLang()
  const items = SIDEBAR_ITEMS[role] || []

  return (
    <div style={{ width:collapsed?72:260, minWidth:collapsed?72:260, background:`linear-gradient(180deg, ${C.dark} 0%, ${C.navy} 100%)`, height:'100vh', display:'flex', flexDirection:'column', transition:'width 0.3s ease', overflowY:'auto', overflowX:'hidden', flexShrink:0 }}>
      <div style={{ padding:'20px 16px', borderBottom:'1px solid rgba(255,255,255,0.07)', display:'flex', alignItems:'center', justifyContent:collapsed?'center':'space-between' }}>
        {collapsed ? <Logo size={32} variant="mark" /> : <Logo size={32} variant="compact" theme="dark" />}
        {!collapsed && (
          <button onClick={onToggle} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.4)', cursor:'pointer', fontSize:16, padding:4 }}>◀</button>
        )}
      </div>
      {collapsed && (
        <div style={{ display:'flex', justifyContent:'center', padding:'8px 0' }}>
          <button onClick={onToggle} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.4)', cursor:'pointer', fontSize:16 }}>▶</button>
        </div>
      )}
      {!collapsed && (
        <div style={{ padding:'8px 16px 12px', fontFamily:"'Hind Siliguri',sans-serif", fontSize:10, color:'rgba(232,160,32,0.5)', letterSpacing:'0.03em' }}>
          আজকের মূল্যায়ন আগামীর সফলতা
        </div>
      )}
      <nav style={{ flex:1, padding:'8px' }}>
        {items.map(item => (
          <button key={item.id} onClick={() => onTabChange(item.id)}
            style={{ width:'100%', display:'flex', alignItems:'center', gap:collapsed?0:10, padding:collapsed?'12px 0':'10px 12px', justifyContent:collapsed?'center':'flex-start', background:activeTab===item.id?'rgba(0,92,75,0.25)':'none', border:'none', borderLeft:activeTab===item.id?`3px solid ${C.gold}`:'3px solid transparent', borderRadius:activeTab===item.id?'0 8px 8px 0':'0', color:activeTab===item.id?'#fff':'rgba(255,255,255,0.6)', cursor:'pointer', fontSize:13, fontFamily:"'Hind Siliguri',sans-serif", fontWeight:activeTab===item.id?600:400, transition:'all 0.15s', textAlign:'left', marginBottom:2 }}>
            <span style={{ fontSize:16, flexShrink:0 }}>{item.icon}</span>
            {!collapsed && <span>{lang==='bn'?item.bn:item.en}</span>}
          </button>
        ))}
      </nav>
      {!collapsed && (
        <div style={{ padding:16, borderTop:'1px solid rgba(255,255,255,0.07)' }}>
          <button onClick={logout} style={{ width:'100%', background:'rgba(192,57,43,0.15)', border:'1px solid rgba(192,57,43,0.3)', color:'#e87c6b', borderRadius:8, padding:8, cursor:'pointer', fontSize:12, fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:600 }}>
            🚪 {lang==='bn'?'লগআউট':'Logout'}
          </button>
        </div>
      )}
    </div>
  )
}

interface TopBarProps {
  title: string
  showNotifs: boolean
  onNotifClick: () => void
  notifications: { id: number; icon: string; title: string; time: string; read: boolean }[]
}

export const TopBar = ({ title, showNotifs, onNotifClick, notifications }: TopBarProps) => {
  const { lang, setLang } = useLang()
  const { user } = useAuth()
  const unread = notifications.filter(n => !n.read).length
  const roleLabels: Record<string, string> = {
    student:'ছাত্র/ছাত্রী', parent:'অভিভাবক', teacher:'শিক্ষক', admin:'বিদ্যালয় প্রশাসক', government:'সরকারি কর্মকর্তা',
  }

  return (
    <div style={{ height:64, background:C.paper, borderBottom:`1px solid ${C.muted}`, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 24px', flexShrink:0, position:'sticky', top:0, zIndex:9 }}>
      <div style={{ fontFamily:"'Sora',sans-serif", fontSize:16, fontWeight:700, color:C.dark }}>{title}</div>
      <div style={{ display:'flex', alignItems:'center', gap:12 }}>
        <div style={{ display:'flex', background:C.muted, borderRadius:9999, padding:3, gap:2 }}>
          {(['en','bn'] as const).map(l => (
            <button key={l} onClick={() => setLang(l)}
              style={{ padding:'4px 12px', borderRadius:9999, border:'none', background:lang===l?C.forest:'transparent', color:lang===l?'#fff':'#666', fontSize:12, fontWeight:600, cursor:'pointer', transition:'all 0.2s' }}>
              {l==='en'?'EN':'বাং'}
            </button>
          ))}
        </div>
        <div style={{ position:'relative' }}>
          <button onClick={onNotifClick} style={{ background:'none', border:'none', cursor:'pointer', fontSize:20, padding:4 }}>
            🔔
            {unread > 0 && <span style={{ position:'absolute', top:-2, right:-2, background:C.danger, color:'#fff', borderRadius:9999, fontSize:9, fontWeight:700, padding:'1px 4px' }}>{unread}</span>}
          </button>
          {showNotifs && (
            <div style={{ position:'absolute', right:0, top:40, width:320, background:C.paper, border:`1px solid ${C.muted}`, borderRadius:12, boxShadow:'0 8px 32px rgba(0,0,0,0.12)', zIndex:100 }}>
              <div style={{ padding:'14px 16px', borderBottom:`1px solid ${C.muted}`, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span style={{ fontWeight:700, fontSize:14, fontFamily:"'Sora',sans-serif" }}>{lang==='bn'?'বিজ্ঞপ্তি':'Notifications'}</span>
                {unread > 0 && <Badge color="red">{unread}</Badge>}
              </div>
              <div style={{ maxHeight:300, overflowY:'auto' }}>
                {notifications.map(n => (
                  <div key={n.id} style={{ padding:'12px 16px', borderBottom:`1px solid ${C.muted}`, background:n.read?'transparent':C.infoBg, display:'flex', gap:10 }}>
                    <span style={{ fontSize:18 }}>{n.icon}</span>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:13, fontWeight:600, color:C.dark, fontFamily:"'Hind Siliguri',sans-serif" }}>{n.title}</div>
                      <div style={{ fontSize:11, color:'#999', marginTop:2 }}>{n.time}</div>
                    </div>
                    {!n.read && <div style={{ width:8, height:8, borderRadius:'50%', background:C.forest, marginTop:4, flexShrink:0 }} />}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <Badge color="green">{user?.role ? roleLabels[user.role] : ''}</Badge>
      </div>
    </div>
  )
}
