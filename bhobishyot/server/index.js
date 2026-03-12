require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const compression = require('compression');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3001;

// ─── Security & Performance ───────────────────────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: false, // allow inline scripts for React
  crossOriginEmbedderPolicy: false,
}));
app.use(compression());
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? process.env.CLIENT_ORIGIN || '*'
    : 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '1mb' }));

// ─── Rate Limiting ────────────────────────────────────────────────────────────
const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20,
  message: { error: 'Too many requests. Please wait a moment.' },
  standardHeaders: true,
});
const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: { error: 'AI request limit reached. Please wait 1 minute.' },
  standardHeaders: true,
});

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_DB = {
  users: [
    { id: 'U001', email: 'student@bhobishyot.edu.bd', password: 'demo123', role: 'student', name: 'আরিফ হোসেন', nameEn: 'Arif Hossain' },
    { id: 'U002', email: 'parent@bhobishyot.edu.bd', password: 'demo123', role: 'parent', name: 'রোকেয়া বেগম', nameEn: 'Rokeya Begum' },
    { id: 'U003', email: 'teacher@bhobishyot.edu.bd', password: 'demo123', role: 'teacher', name: 'ফাতেমা বেগম', nameEn: 'Fatema Begum' },
    { id: 'U004', email: 'admin@bhobishyot.edu.bd', password: 'demo123', role: 'admin', name: 'প্রশাসক আহমেদ', nameEn: 'Admin Ahmed' },
    { id: 'U005', email: 'gov@bhobishyot.edu.bd', password: 'demo123', role: 'government', name: 'কর্মকর্তা রহমান', nameEn: 'Officer Rahman' },
  ],
  students: [
    { id: 'S001', name: 'আরিফ হোসেন', class: 8, section: 'A', roll: 7, score: 78.5, risk: 'low', rank: 8, attendance: 92, gpa: 4.2 },
    { id: 'S002', name: 'নুসরাত জাহান', class: 8, section: 'A', roll: 12, score: 85.2, risk: 'low', rank: 3, attendance: 96, gpa: 4.6 },
    { id: 'S003', name: 'সুমাইয়া আক্তার', class: 8, section: 'B', roll: 5, score: 52.1, risk: 'high', rank: 31, attendance: 71, gpa: 2.8 },
    { id: 'S004', name: 'রহিম উদ্দিন', class: 8, section: 'B', roll: 18, score: 63.4, risk: 'medium', rank: 22, attendance: 84, gpa: 3.3 },
    { id: 'S005', name: 'তাসনিম ইসলাম', class: 8, section: 'A', roll: 3, score: 91.0, risk: 'low', rank: 1, attendance: 98, gpa: 5.0 },
    { id: 'S006', name: 'মারিয়াম বেগম', class: 8, section: 'C', roll: 9, score: 44.3, risk: 'high', rank: 38, attendance: 65, gpa: 2.0 },
    { id: 'S007', name: 'সাইফুল ইসলাম', class: 8, section: 'A', roll: 21, score: 71.8, risk: 'low', rank: 14, attendance: 89, gpa: 3.9 },
    { id: 'S008', name: 'ফাতেমা খানম', class: 8, section: 'B', roll: 6, score: 58.9, risk: 'medium', rank: 26, attendance: 78, gpa: 3.0 },
  ],
  teachers: [
    { id: 'T001', name: 'ফাতেমা বেগম', subject: 'গণিত ও বিজ্ঞান', school: 'খুলনা সরকারি উচ্চ বিদ্যালয়', district: 'খুলনা', experience: 8, avgClassScore: 74.2, passRate: 88, assessmentsCreated: 12, transferScore: 78 },
    { id: 'T002', name: 'করিম শেখ', subject: 'বাংলা ও ইংরেজি', school: 'রাজশাহী মডেল স্কুল', district: 'রাজশাহী', experience: 12, avgClassScore: 68.5, passRate: 79, assessmentsCreated: 8, transferScore: 65 },
    { id: 'T003', name: 'রেহানা পারভীন', subject: 'সমাজ ও ধর্ম', school: 'সিলেট সরকারি বালিকা বিদ্যালয়', district: 'সিলেট', experience: 6, avgClassScore: 65.1, passRate: 72, assessmentsCreated: 6, transferScore: 82 },
  ],
  assessments: [
    { id: 'A001', title: 'গণিত মাসিক পরীক্ষা - এপ্রিল', subject: 'গণিত', type: 'মাসিক পরীক্ষা', date: '১৫ এপ্রিল ২০২৪', totalMarks: 50, assigned: 42, submitted: 38, status: 'graded', avgScore: 36.4, passRate: 86, createdBy: 'T001' },
    { id: 'A002', title: 'বিজ্ঞান কুইজ - চ্যাপ্টার ৪', subject: 'বিজ্ঞান', type: 'কুইজ', date: '২২ এপ্রিল ২০২৪', totalMarks: 20, assigned: 42, submitted: 40, status: 'grading', avgScore: null, passRate: null, createdBy: 'T001' },
    { id: 'A003', title: 'গণিত শ্রেণী পরীক্ষা', subject: 'গণিত', type: 'শ্রেণী পরীক্ষা', date: '৫ মে ২০২৪', totalMarks: 30, assigned: 42, submitted: 0, status: 'open', avgScore: null, passRate: null, createdBy: 'T001' },
  ],
  notices: [
    { id: 1, title: 'SSC পরীক্ষার সময়সূচি প্রকাশিত', body: '২০২৪ সালের SSC পরীক্ষা আগামী ১৫ ফেব্রুয়ারি থেকে শুরু হবে।', priority: 'high', author: 'সরকারি কর্মকর্তা', scope: 'জাতীয়', date: '১০ জানু ২০২৪' },
    { id: 2, title: 'বার্ষিক ক্রীড়া প্রতিযোগিতা', body: 'আগামী সপ্তাহে বিদ্যালয় মাঠে বার্ষিক ক্রীড়া প্রতিযোগিতা অনুষ্ঠিত হবে।', priority: 'normal', author: 'ফাতেমা বেগম', scope: 'বিদ্যালয়', date: '৮ জানু ২০২৪' },
    { id: 3, title: 'অভিভাবক-শিক্ষক সভা', body: 'আগামী শুক্রবার সকাল ১০টায় অভিভাবক-শিক্ষক সভা অনুষ্ঠিত হবে।', priority: 'important', author: 'বিদ্যালয় প্রশাসক', scope: 'বিদ্যালয়', date: '৫ জানু ২০২৪' },
  ],
  messages: [],
  grades: {},
  libraryDownloads: {},
};

// ─── Auth Routes ──────────────────────────────────────────────────────────────
app.post('/api/auth/login', apiLimiter, (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }
  const user = MOCK_DB.users.find(
    u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const { password: _, ...safeUser } = user;
  res.json({ success: true, user: safeUser, token: `mock-token-${user.id}-${Date.now()}` });
});

app.get('/api/auth/me', apiLimiter, (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token' });
  const userId = authHeader.split('-')[2];
  const user = MOCK_DB.users.find(u => u.id === userId);
  if (!user) return res.status(401).json({ error: 'Invalid token' });
  const { password: _, ...safeUser } = user;
  res.json({ user: safeUser });
});

// ─── Students ─────────────────────────────────────────────────────────────────
app.get('/api/students', apiLimiter, (req, res) => {
  const { section, risk } = req.query;
  let students = [...MOCK_DB.students];
  if (section) students = students.filter(s => s.section === section);
  if (risk) students = students.filter(s => s.risk === risk);
  res.json({ students });
});

app.get('/api/students/:id', apiLimiter, (req, res) => {
  const student = MOCK_DB.students.find(s => s.id === req.params.id);
  if (!student) return res.status(404).json({ error: 'Student not found' });
  res.json({ student });
});

// ─── Teachers ─────────────────────────────────────────────────────────────────
app.get('/api/teachers', apiLimiter, (req, res) => {
  const { district } = req.query;
  let teachers = [...MOCK_DB.teachers];
  if (district) teachers = teachers.filter(t => t.district === district);
  res.json({ teachers });
});

app.get('/api/teachers/:id', apiLimiter, (req, res) => {
  const teacher = MOCK_DB.teachers.find(t => t.id === req.params.id);
  if (!teacher) return res.status(404).json({ error: 'Teacher not found' });
  res.json({ teacher });
});

// ─── Assessments ──────────────────────────────────────────────────────────────
app.get('/api/assessments', apiLimiter, (req, res) => {
  const { teacherId, status } = req.query;
  let assessments = [...MOCK_DB.assessments];
  if (teacherId) assessments = assessments.filter(a => a.createdBy === teacherId);
  if (status) assessments = assessments.filter(a => a.status === status);
  res.json({ assessments });
});

app.get('/api/assessments/:id', apiLimiter, (req, res) => {
  const assessment = MOCK_DB.assessments.find(a => a.id === req.params.id);
  if (!assessment) return res.status(404).json({ error: 'Assessment not found' });
  res.json({ assessment });
});

app.post('/api/assessments', apiLimiter, (req, res) => {
  const { title, subject, type, date, totalMarks, instructions, assignedTo, status } = req.body;
  if (!title || !subject || !totalMarks) {
    return res.status(400).json({ error: 'Title, subject, and total marks are required' });
  }
  const newAssessment = {
    id: `A${String(MOCK_DB.assessments.length + 1).padStart(3, '0')}`,
    title, subject, type: type || 'কুইজ', date: date || new Date().toLocaleDateString('bn-BD'),
    totalMarks: parseInt(totalMarks), assigned: assignedTo?.length || 42,
    submitted: 0, status: status || 'open', avgScore: null, passRate: null,
    createdBy: 'T001', createdAt: new Date().toISOString(),
  };
  MOCK_DB.assessments.push(newAssessment);
  res.status(201).json({ assessment: newAssessment, message: 'Assessment created successfully' });
});

app.patch('/api/assessments/:id/grade', apiLimiter, (req, res) => {
  const { studentId, scores, totalScore, feedback } = req.body;
  const assessment = MOCK_DB.assessments.find(a => a.id === req.params.id);
  if (!assessment) return res.status(404).json({ error: 'Assessment not found' });
  const key = `${req.params.id}_${studentId}`;
  MOCK_DB.grades[key] = { studentId, scores, totalScore, feedback, gradedAt: new Date().toISOString() };
  res.json({ success: true, grade: MOCK_DB.grades[key] });
});

app.get('/api/assessments/:id/grades', apiLimiter, (req, res) => {
  const grades = Object.entries(MOCK_DB.grades)
    .filter(([key]) => key.startsWith(req.params.id))
    .map(([_, val]) => val);
  res.json({ grades });
});

// ─── Notices ──────────────────────────────────────────────────────────────────
app.get('/api/notices', apiLimiter, (req, res) => {
  const { scope } = req.query;
  let notices = [...MOCK_DB.notices];
  if (scope && scope !== 'all') notices = notices.filter(n => n.scope === scope);
  res.json({ notices });
});

app.post('/api/notices', apiLimiter, (req, res) => {
  const { title, body, priority, author, scope } = req.body;
  if (!title || !body) return res.status(400).json({ error: 'Title and body required' });
  const notice = {
    id: MOCK_DB.notices.length + 1, title, body,
    priority: priority || 'normal', author: author || 'Unknown',
    scope: scope || 'বিদ্যালয়', date: new Date().toLocaleDateString('bn-BD'),
  };
  MOCK_DB.notices.unshift(notice);
  res.status(201).json({ notice });
});

// ─── Messages ────────────────────────────────────────────────────────────────
app.get('/api/messages', apiLimiter, (req, res) => {
  const { role, category } = req.query;
  let messages = [...MOCK_DB.messages];
  if (role) messages = messages.filter(m => m.senderRole === role);
  if (category) messages = messages.filter(m => m.category === category);
  res.json({ messages });
});

app.post('/api/messages', apiLimiter, (req, res) => {
  const { from, senderRole, category, subject, body } = req.body;
  if (!subject || !body) return res.status(400).json({ error: 'Subject and body required' });
  const message = {
    id: `M${String(MOCK_DB.messages.length + 1).padStart(3, '0')}`,
    from: from || 'Anonymous', senderRole: senderRole || 'student',
    category: category || 'প্রশ্ন', subject, body,
    sentAt: new Date().toISOString(), read: false,
  };
  MOCK_DB.messages.push(message);
  res.status(201).json({ message, sent: true });
});

app.patch('/api/messages/:id/read', apiLimiter, (req, res) => {
  const msg = MOCK_DB.messages.find(m => m.id === req.params.id);
  if (!msg) return res.status(404).json({ error: 'Message not found' });
  msg.read = true;
  res.json({ success: true });
});

// ─── Library Downloads ────────────────────────────────────────────────────────
app.post('/api/library/download', apiLimiter, (req, res) => {
  const { userId, itemId } = req.body;
  if (!userId || !itemId) return res.status(400).json({ error: 'userId and itemId required' });
  if (!MOCK_DB.libraryDownloads[userId]) MOCK_DB.libraryDownloads[userId] = [];
  if (!MOCK_DB.libraryDownloads[userId].includes(itemId)) {
    MOCK_DB.libraryDownloads[userId].push(itemId);
  }
  res.json({ success: true, downloads: MOCK_DB.libraryDownloads[userId] });
});

app.get('/api/library/downloads/:userId', apiLimiter, (req, res) => {
  res.json({ downloads: MOCK_DB.libraryDownloads[req.params.userId] || [] });
});

// ─── Analytics ────────────────────────────────────────────────────────────────
app.get('/api/analytics/national', apiLimiter, (req, res) => {
  res.json({
    avgScore: 68.4, totalStudents: 40200000, totalSchools: 152000,
    dropoutRisk: 9.2, atRiskStudents: 3700000,
    trend: [
      { year: '২০১৯', score: 61.2 }, { year: '২০২০', score: 59.8 },
      { year: '২০২১', score: 62.4 }, { year: '২০২২', score: 64.1 },
      { year: '২০২৩', score: 66.8 }, { year: '২০২৪', score: 68.4 },
    ],
    districts: [
      { name: 'ঢাকা', div: 'ঢাকা', schools: 4821, students: 1820000, score: 72.4, dropout: 7.2 },
      { name: 'চট্টগ্রাম', div: 'চট্টগ্রাম', schools: 3214, students: 1240000, score: 69.8, dropout: 8.9 },
      { name: 'খুলনা', div: 'খুলনা', schools: 2108, students: 890000, score: 67.2, dropout: 10.1 },
      { name: 'রাজশাহী', div: 'রাজশাহী', schools: 1987, students: 810000, score: 65.4, dropout: 11.3 },
      { name: 'সিলেট', div: 'সিলেট', schools: 1654, students: 720000, score: 63.1, dropout: 14.2 },
      { name: 'বরিশাল', div: 'বরিশাল', schools: 1432, students: 580000, score: 61.8, dropout: 15.7 },
      { name: 'রংপুর', div: 'রংপুর', schools: 1876, students: 760000, score: 64.3, dropout: 12.8 },
      { name: 'ময়মনসিংহ', div: 'ময়মনসিংহ', schools: 1543, students: 640000, score: 62.9, dropout: 13.4 },
    ],
  });
});

app.get('/api/analytics/student/:id', apiLimiter, (req, res) => {
  res.json({
    performance: [
      { month: 'জানু', math: 72, bangla: 68, english: 65, science: 70 },
      { month: 'ফেব্রু', math: 74, bangla: 71, english: 67, science: 72 },
      { month: 'মার্চ', math: 76, bangla: 73, english: 69, science: 68 },
      { month: 'এপ্রিল', math: 79, bangla: 75, english: 70, science: 74 },
      { month: 'মে', math: 81, bangla: 76, english: 72, science: 71 },
      { month: 'জুন', math: 82, bangla: 76, english: 71, science: 69 },
    ],
    cognitive: [
      { skill: 'বিশ্লেষণ', current: 78, previous: 72 },
      { skill: 'সমস্যা সমাধান', current: 82, previous: 75 },
      { skill: 'স্মৃতিশক্তি', current: 71, previous: 68 },
      { skill: 'সৃজনশীলতা', current: 65, previous: 60 },
      { skill: 'যোগাযোগ', current: 74, previous: 71 },
      { skill: 'সমালোচনা', current: 69, previous: 65 },
    ],
  });
});

// ─── AI Routes (Streaming SSE) ────────────────────────────────────────────────
app.post('/api/ai/feedback', aiLimiter, async (req, res) => {
  const { score, total, subject, assessmentType, lang } = req.body;
  if (!score || !total || !subject) {
    return res.status(400).json({ error: 'score, total, and subject are required' });
  }

  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
  if (!ANTHROPIC_API_KEY) {
    const fallback = lang === 'bn'
      ? `তুমি ${subject} পরীক্ষায় ${score}/${total} পেয়েছ। সামগ্রিকভাবে ভালো পারফরম্যান্স। নিয়মিত অনুশীলন চালিয়ে গেলে আরও ভালো ফলাফল আসবে। দুর্বল অংশগুলো পুনরায় পড়ার পরামর্শ দেওয়া হচ্ছে।`
      : `You scored ${score}/${total} in ${subject}. Good overall performance. Continue regular practice for better results. Review the weaker sections again.`;
    return res.json({ text: fallback, cached: true });
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  try {
    const Anthropic = require('@anthropic-ai/sdk');
    const client = new Anthropic({ apiKey: ANTHROPIC_API_KEY });
    const prompt = lang === 'bn'
      ? `তুমি বাংলাদেশের একজন সহকারী শিক্ষক। একজন শিক্ষার্থী ${subject} ${assessmentType || 'পরীক্ষায়'} ${score}/${total} পেয়েছে। ২-৩ বাক্যে উৎসাহমূলক ও গঠনমূলক মন্তব্য লেখো বাংলায়। সহজ ভাষা ব্যবহার করো।`
      : `You are a teacher in Bangladesh. A student scored ${score}/${total} in ${subject} ${assessmentType || 'exam'}. Write 2-3 sentences of encouraging and constructive feedback in English. Use simple, warm language appropriate for a school student.`;

    const stream = client.messages.stream({
      model: 'claude-opus-4-5',
      max_tokens: 200,
      messages: [{ role: 'user', content: prompt }],
    });

    for await (const chunk of stream) {
      if (chunk.type === 'content_block_delta' && chunk.delta?.text) {
        res.write(`data: ${JSON.stringify({ text: chunk.delta.text })}\n\n`);
      }
    }
    res.write('data: [DONE]\n\n');
    res.end();
  } catch (err) {
    console.error('AI error:', err.message);
    res.write(`data: ${JSON.stringify({ error: 'AI unavailable', text: lang === 'bn' ? 'AI সেবা এই মুহূর্তে অনুপলব্ধ।' : 'AI service unavailable.' })}\n\n`);
    res.write('data: [DONE]\n\n');
    res.end();
  }
});

app.post('/api/ai/lesson-plan', aiLimiter, async (req, res) => {
  const { subject, topic, classLevel, lang } = req.body;
  if (!subject || !topic) return res.status(400).json({ error: 'subject and topic required' });

  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
  if (!ANTHROPIC_API_KEY) {
    return res.json({
      text: lang === 'bn'
        ? `বিষয়: ${subject}\nবিষয়বস্তু: ${topic}\n\nউদ্দেশ্য:\n১. শিক্ষার্থীরা মূল ধারণাটি বুঝতে পারবে\n২. ব্যবহারিক প্রয়োগ করতে পারবে\n\nভূমিকা (৫ মিনিট): পূর্ববর্তী পাঠের পুনরাবৃত্তি\nমূল শিক্ষাদান (২৫ মিনিট): বোর্ডে উদাহরণ সহ বিস্তারিত আলোচনা\nঅনুশীলন (১০ মিনিট): শিক্ষার্থীদের সমস্যা সমাধান\nসারসংক্ষেপ (৫ মিনিট): মূল বিষয় পর্যালোচনা ও বাড়ির কাজ প্রদান`
        : `Subject: ${subject}\nTopic: ${topic}\n\nObjectives:\n1. Students understand core concept\n2. Can apply practically\n\nIntro (5 min): Review previous lesson\nMain (25 min): Detailed explanation with board examples\nPractice (10 min): Student problem solving\nSummary (5 min): Review key points and assign homework`,
      cached: true,
    });
  }

  try {
    const Anthropic = require('@anthropic-ai/sdk');
    const client = new Anthropic({ apiKey: ANTHROPIC_API_KEY });
    const prompt = lang === 'bn'
      ? `বাংলাদেশ NCTB পাঠ্যক্রম অনুসরণ করে শ্রেণী ${classLevel} ${subject} বিষয়ে "${topic}" টপিকের জন্য ৪৫ মিনিটের একটি পাঠ পরিকল্পনা তৈরি করো। ফরম্যাট: শিখন উদ্দেশ্য (৩টি), ভূমিকা ৫মিনিট, মূল কার্যক্রম ২৫মিনিট, অনুশীলন ১০মিনিট, সারসংক্ষেপ ৫মিনিট। বাংলায় লেখো। গ্রামীণ বিদ্যালয়ের জন্য উপযুক্ত করো।`
      : `Create a 45-minute lesson plan for Class ${classLevel} ${subject} on "${topic}" following Bangladesh NCTB curriculum. Format: Learning objectives (3), Intro 5min, Main activity 25min, Practice 10min, Summary 5min. Keep it practical for a rural school with limited resources.`;

    const message = await client.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 600,
      messages: [{ role: 'user', content: prompt }],
    });
    res.json({ text: message.content[0].text });
  } catch (err) {
    res.status(500).json({ error: 'AI service error', message: err.message });
  }
});

app.post('/api/ai/district-report', aiLimiter, async (req, res) => {
  const { district, stats, lang } = req.body;
  if (!district) return res.status(400).json({ error: 'district required' });

  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
  if (!ANTHROPIC_API_KEY) {
    return res.json({
      text: lang === 'bn'
        ? `${district} জেলা শিক্ষা প্রতিবেদন\n\nনির্বাহী সারসংক্ষেপ:\n${district} জেলায় বর্তমানে শিক্ষা কার্যক্রম চলমান রয়েছে। জাতীয় গড়ের তুলনায় পারফরম্যান্স কিছুটা কম।\n\nমূল ঝুঁকি:\nঝরে পড়ার হার নিয়ন্ত্রণ করা জরুরি।\n\nসুপারিশ:\n১. শিক্ষক প্রশিক্ষণ বৃদ্ধি করুন\n২. অবকাঠামো উন্নয়ন করুন\n৩. স্কুল মিল কর্মসূচি চালু করুন`
        : `${district} District Education Report\n\nExecutive Summary:\nEducation activities are ongoing in ${district} district. Performance is slightly below national average.\n\nKey Risks:\nDropout rate needs immediate attention.\n\nRecommendations:\n1. Increase teacher training\n2. Improve infrastructure\n3. Launch school meal program`,
      cached: true,
    });
  }

  try {
    const Anthropic = require('@anthropic-ai/sdk');
    const client = new Anthropic({ apiKey: ANTHROPIC_API_KEY });
    const statsStr = stats ? JSON.stringify(stats) : 'no specific stats provided';
    const prompt = lang === 'bn'
      ? `বাংলাদেশের ${district} জেলার জন্য একটি পেশাদার শিক্ষা প্রতিবেদন তৈরি করো। পরিসংখ্যান: ${statsStr}। বিভাগগুলো: নির্বাহী সারসংক্ষেপ (২ অনুচ্ছেদ), মূল পারফরম্যান্স সূচক বিশ্লেষণ, ঝুঁকিপূর্ণ এলাকা, মূল কারণ বিশ্লেষণ, ৫টি সুনির্দিষ্ট সুপারিশ। সরকারি প্রতিবেদনের ভাষায় বাংলায় লেখো।`
      : `Generate a professional education report for ${district} district, Bangladesh. Stats: ${statsStr}. Sections: Executive Summary (2 paragraphs), Key Performance Indicators analysis, Risk Areas, Root Cause Analysis, 5 specific recommendations. Government report tone.`;

    const message = await client.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 800,
      messages: [{ role: 'user', content: prompt }],
    });
    res.json({ text: message.content[0].text });
  } catch (err) {
    res.status(500).json({ error: 'AI service error', message: err.message });
  }
});

app.post('/api/ai/policy-insight', aiLimiter, async (req, res) => {
  const { budget, lang } = req.body;
  if (!budget) return res.status(400).json({ error: 'budget required' });

  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
  if (!ANTHROPIC_API_KEY) {
    return res.json({
      text: lang === 'bn'
        ? 'শিক্ষক প্রশিক্ষণে বিনিয়োগ সর্বোচ্চ ROI দেবে। গ্রামীণ সংযোগ বৃদ্ধি ঝরে পড়া কমাবে। মিল কর্মসূচি উপস্থিতি বাড়াবে।'
        : 'Teacher training investment gives highest ROI. Rural connectivity will reduce dropout. Meal program will improve attendance.',
      cached: true,
    });
  }

  try {
    const Anthropic = require('@anthropic-ai/sdk');
    const client = new Anthropic({ apiKey: ANTHROPIC_API_KEY });
    const prompt = lang === 'bn'
      ? `বাংলাদেশের গ্রামীণ শিক্ষায় বাজেট বরাদ্দ: শিক্ষক প্রশিক্ষণ ৳${budget.training} কোটি, অবকাঠামো ৳${budget.infra} কোটি, EdTech ৳${budget.edtech} কোটি, মিল কর্মসূচি ৳${budget.meals} কোটি, গ্রামীণ সংযোগ ৳${budget.connectivity} কোটি। ৩ বাক্যে প্রভাব বিশ্লেষণ করো, সর্বোচ্চ সুফলদায়ী বিনিয়োগ চিহ্নিত করো, একটি ঝুঁকি উল্লেখ করো। বাংলায়।`
      : `Bangladesh rural education budget: Teacher Training ৳${budget.training}Cr, Infrastructure ৳${budget.infra}Cr, EdTech ৳${budget.edtech}Cr, Meals ৳${budget.meals}Cr, Connectivity ৳${budget.connectivity}Cr. In 3 sentences: analyze impact, identify highest-leverage investment, note one key risk.`;

    const message = await client.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 200,
      messages: [{ role: 'user', content: prompt }],
    });
    res.json({ text: message.content[0].text });
  } catch (err) {
    res.status(500).json({ error: 'AI service error', message: err.message });
  }
});

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    platform: 'ভবিষ্যৎ — Bangladesh Education Hub',
    version: '1.0.0',
    ai: !!process.env.ANTHROPIC_API_KEY ? 'enabled' : 'disabled (set ANTHROPIC_API_KEY)',
    timestamp: new Date().toISOString(),
  });
});

// ─── Serve React build in production ─────────────────────────────────────────
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '../client/dist');
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`\n🇧🇩 ভবিষ্যৎ Server running on port ${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/api/health`);
  console.log(`   AI: ${process.env.ANTHROPIC_API_KEY ? '✅ Enabled' : '⚠️  Disabled (add ANTHROPIC_API_KEY to .env)'}`);
});

module.exports = app;
