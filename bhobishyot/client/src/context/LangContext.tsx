import { createContext, useContext, useState, ReactNode } from 'react'

type Lang = 'bn' | 'en'

interface LangCtx {
  lang: Lang
  setLang: (l: Lang) => void
  t: (key: string) => string
}

const STRINGS: Record<string, Record<Lang, string>> = {
  appName: { bn: 'ভবিষ্যৎ', en: 'Bhobishyot' },
  tagline: { bn: 'আজকের মূল্যায়ন আগামীর সফলতা', en: "Today's Assessment, Tomorrow's Success" },
  signIn: { bn: 'প্রবেশ করুন', en: 'Sign In' },
  email: { bn: 'ইমেইল', en: 'Email' },
  password: { bn: 'পাসওয়ার্ড', en: 'Password' },
  overview: { bn: 'সংক্ষিপ্ত বিবরণ', en: 'Overview' },
  assessments: { bn: 'মূল্যায়ন', en: 'Assessments' },
  library: { bn: 'ডিজিটাল লাইব্রেরি', en: 'Digital Library' },
  notices: { bn: 'নোটিশ বোর্ড', en: 'Notice Board' },
  messages: { bn: 'বার্তা', en: 'Messages' },
  profile: { bn: 'আমার প্রোফাইল', en: 'My Profile' },
  teachers: { bn: 'শিক্ষক', en: 'Teachers' },
  students: { bn: 'শিক্ষার্থী', en: 'Students' },
  logout: { bn: 'লগআউট', en: 'Logout' },
  save: { bn: 'সংরক্ষণ', en: 'Save' },
  cancel: { bn: 'বাতিল', en: 'Cancel' },
  loading: { bn: 'লোড হচ্ছে...', en: 'Loading...' },
  noData: { bn: 'কোনো তথ্য নেই', en: 'No data available' },
  national: { bn: 'জাতীয় সংক্ষিপ্ত বিবরণ', en: 'National Overview' },
  attendance: { bn: 'উপস্থিতি', en: 'Attendance' },
  performance: { bn: 'পারফরম্যান্স', en: 'Performance' },
  reports: { bn: 'প্রতিবেদন', en: 'Reports' },
  generate: { bn: 'তৈরি করুন', en: 'Generate' },
  send: { bn: 'পাঠান', en: 'Send' },
  submit: { bn: 'জমা দিন', en: 'Submit' },
  approve: { bn: 'অনুমোদন', en: 'Approve' },
  reject: { bn: 'প্রত্যাখ্যান', en: 'Reject' },
}

const Ctx = createContext<LangCtx | null>(null)

export const LangProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<Lang>(() => {
    return (localStorage.getItem('bhobishyot_lang') as Lang) || 'bn'
  })

  const setLang = (l: Lang) => {
    setLangState(l)
    localStorage.setItem('bhobishyot_lang', l)
  }

  const t = (key: string) => STRINGS[key]?.[lang] || key

  return <Ctx.Provider value={{ lang, setLang, t }}>{children}</Ctx.Provider>
}

export const useLang = () => {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useLang must be used within LangProvider')
  return ctx
}
