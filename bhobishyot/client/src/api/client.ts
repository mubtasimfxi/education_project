import axios from 'axios'

const BASE = '/api'

const api = axios.create({ baseURL: BASE, timeout: 15000 })

// Attach token from localStorage
api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('bhobishyot_token')
  if (token) cfg.headers.Authorization = `Bearer ${token}`
  return cfg
})

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const login = (email: string, password: string) =>
  api.post('/auth/login', { email, password }).then(r => r.data)

export const getMe = () =>
  api.get('/auth/me').then(r => r.data)

// ─── Students ─────────────────────────────────────────────────────────────────
export const getStudents = (params?: Record<string, string>) =>
  api.get('/students', { params }).then(r => r.data)

export const getStudent = (id: string) =>
  api.get(`/students/${id}`).then(r => r.data)

// ─── Teachers ─────────────────────────────────────────────────────────────────
export const getTeachers = (params?: Record<string, string>) =>
  api.get('/teachers', { params }).then(r => r.data)

export const getTeacher = (id: string) =>
  api.get(`/teachers/${id}`).then(r => r.data)

// ─── Assessments ──────────────────────────────────────────────────────────────
export const getAssessments = (params?: Record<string, string>) =>
  api.get('/assessments', { params }).then(r => r.data)

export const createAssessment = (data: Record<string, unknown>) =>
  api.post('/assessments', data).then(r => r.data)

export const gradeSubmission = (id: string, data: Record<string, unknown>) =>
  api.patch(`/assessments/${id}/grade`, data).then(r => r.data)

export const getGrades = (assessmentId: string) =>
  api.get(`/assessments/${assessmentId}/grades`).then(r => r.data)

// ─── Notices ──────────────────────────────────────────────────────────────────
export const getNotices = (params?: Record<string, string>) =>
  api.get('/notices', { params }).then(r => r.data)

export const createNotice = (data: Record<string, unknown>) =>
  api.post('/notices', data).then(r => r.data)

// ─── Messages ────────────────────────────────────────────────────────────────
export const getMessages = (params?: Record<string, string>) =>
  api.get('/messages', { params }).then(r => r.data)

export const sendMessage = (data: Record<string, unknown>) =>
  api.post('/messages', data).then(r => r.data)

export const markMessageRead = (id: string) =>
  api.patch(`/messages/${id}/read`).then(r => r.data)

// ─── Library ──────────────────────────────────────────────────────────────────
export const downloadLibraryItem = (userId: string, itemId: number) =>
  api.post('/library/download', { userId, itemId }).then(r => r.data)

export const getLibraryDownloads = (userId: string) =>
  api.get(`/library/downloads/${userId}`).then(r => r.data)

// ─── Analytics ────────────────────────────────────────────────────────────────
export const getNationalAnalytics = () =>
  api.get('/analytics/national').then(r => r.data)

export const getStudentAnalytics = (id: string) =>
  api.get(`/analytics/student/${id}`).then(r => r.data)

// ─── AI (streaming via EventSource) ──────────────────────────────────────────
export const streamAiFeedback = async (
  payload: { score: number; total: number; subject: string; assessmentType?: string; lang: string },
  onChunk: (text: string) => void,
  onDone: () => void
) => {
  const res = await fetch('/api/ai/feedback', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.body) { onDone(); return }
  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    const lines = decoder.decode(value).split('\n').filter(l => l.startsWith('data:'))
    for (const line of lines) {
      const data = line.slice(5).trim()
      if (data === '[DONE]') { onDone(); return }
      try { const json = JSON.parse(data); if (json.text) onChunk(json.text) } catch {}
    }
  }
  onDone()
}

export const getAiLessonPlan = (data: { subject: string; topic: string; classLevel: string; lang: string }) =>
  api.post('/ai/lesson-plan', data).then(r => r.data)

export const getAiDistrictReport = (data: { district: string; stats?: unknown; lang: string }) =>
  api.post('/ai/district-report', data).then(r => r.data)

export const getAiPolicyInsight = (data: { budget: Record<string, number>; lang: string }) =>
  api.post('/ai/policy-insight', data).then(r => r.data)

export default api
