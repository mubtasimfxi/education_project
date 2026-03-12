# ভবিষ্যৎ (Bhobishyot)
### বাংলাদেশের জাতীয় গ্রামীণ শিক্ষা ডিজিটাল হাব
**Today's Assessment, Tomorrow's Success**

---

## 🏗️ Project Structure

```
bhobishyot/
├── client/              # React 18 + TypeScript + Vite frontend
│   ├── src/
│   │   ├── api/         # All HTTP calls to backend
│   │   ├── components/  # Reusable UI + Layout
│   │   ├── context/     # Auth + Language state
│   │   └── pages/       # Login + 5 role dashboards
│   └── vite.config.ts   # Dev proxy → backend :3001
├── server/              # Node.js + Express backend
│   └── index.js         # All API routes + AI streaming
├── Dockerfile           # For container deployments
├── render.yaml          # One-click Render.com deploy
└── railway.toml         # One-click Railway deploy
```

---

## 🚀 Local Development (5 minutes)

### Prerequisites
- Node.js 18+ 
- An Anthropic API key (for AI features) — get one at https://console.anthropic.com/

### Steps

```bash
# 1. Clone / unzip the project
cd bhobishyot

# 2. Create your .env file
cp .env.example .env
# Then edit .env and add your ANTHROPIC_API_KEY

# 3. Install all dependencies
npm run install:all

# 4. Start both server + client together
npm run dev
```

Open http://localhost:5173 — the app is live! ✅

### Demo Accounts (all use password: demo123)
| Role | Email |
|------|-------|
| Student | student@bhobishyot.edu.bd |
| Parent | parent@bhobishyot.edu.bd |
| Teacher | teacher@bhobishyot.edu.bd |
| School Admin | admin@bhobishyot.edu.bd |
| Government | gov@bhobishyot.edu.bd |

---

## ☁️ Deployment

### Option 1: Render.com (Recommended — Free tier, Singapore region)

Render is closest to Bangladesh and has a generous free tier.

1. Push your code to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/bhobishyot.git
   git push -u origin main
   ```

2. Go to [render.com](https://render.com) → New → Web Service

3. Connect your GitHub repo

4. Render auto-detects `render.yaml`. Click **Deploy**.

5. In the Render dashboard → Environment → Add variable:
   - Key: `ANTHROPIC_API_KEY`  
   - Value: `sk-ant-...` (your key)

6. Your app will be live at: `https://bhobishyot.onrender.com` ✅

**Note:** Free tier spins down after 15 min of inactivity. Upgrade to Starter ($7/mo) to keep it always-on.

---

### Option 2: Railway.app (Fast deploys, $5/mo)

1. Install Railway CLI:
   ```bash
   npm install -g @railway/cli
   railway login
   ```

2. Deploy:
   ```bash
   railway init
   railway up
   ```

3. Set environment variable:
   ```bash
   railway variables set ANTHROPIC_API_KEY=sk-ant-...
   ```

4. Get your URL: `railway open`

---

### Option 3: Fly.io (Good for Bangladesh, $3-5/mo)

1. Install flyctl: https://fly.io/docs/hands-on/install-flyctl/

2. ```bash
   fly auth login
   fly launch --name bhobishyot
   fly secrets set ANTHROPIC_API_KEY=sk-ant-...
   fly deploy
   ```

---

### Option 4: VPS / DigitalOcean Droplet (Full control, $6/mo)

```bash
# On your server (Ubuntu 22.04)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs git

# Clone your repo
git clone https://github.com/YOUR_USERNAME/bhobishyot.git
cd bhobishyot

# Setup
cp .env.example .env
nano .env  # Add your ANTHROPIC_API_KEY

# Build client
cd client && npm install && npm run build && cd ..
cd server && npm install && cd ..

# Run with PM2 (keeps it alive)
npm install -g pm2
NODE_ENV=production pm2 start server/index.js --name bhobishyot
pm2 save
pm2 startup

# Setup Nginx as reverse proxy
sudo apt install nginx -y
sudo nano /etc/nginx/sites-available/bhobishyot
```

Nginx config:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/bhobishyot /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

# Add HTTPS with Certbot (free SSL)
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d your-domain.com
```

---

### Option 5: Docker (Any container platform)

```bash
# Build image
docker build -t bhobishyot .

# Run locally
docker run -p 3001:3001 -e ANTHROPIC_API_KEY=sk-ant-... bhobishyot

# Push to Docker Hub, then deploy on any VPS or container service
docker tag bhobishyot YOUR_DOCKERHUB/bhobishyot:latest
docker push YOUR_DOCKERHUB/bhobishyot:latest
```

---

## 🔌 API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/login` | Login (returns token) |
| GET | `/api/auth/me` | Get current user |
| GET | `/api/students` | List students |
| GET | `/api/teachers` | List teachers |
| GET | `/api/assessments` | List assessments |
| POST | `/api/assessments` | Create assessment |
| PATCH | `/api/assessments/:id/grade` | Grade submission |
| GET | `/api/notices` | Get notices |
| POST | `/api/notices` | Create notice |
| GET | `/api/messages` | Get messages |
| POST | `/api/messages` | Send message |
| GET | `/api/analytics/national` | National stats |
| POST | `/api/ai/feedback` | AI feedback (SSE streaming) |
| POST | `/api/ai/lesson-plan` | Generate lesson plan |
| POST | `/api/ai/district-report` | Generate district report |
| POST | `/api/ai/policy-insight` | AI policy analysis |
| GET | `/api/health` | Health check |

---

## 🗄️ Adding a Real Database

Currently uses in-memory mock data. To add PostgreSQL:

```bash
cd server && npm install pg drizzle-orm
```

On Render/Railway, add a **PostgreSQL** service and set `DATABASE_URL` in environment variables.

For production, replace the `MOCK_DB` object in `server/index.js` with real DB queries.

---

## ✨ Features

- **5 Role Dashboards**: Student, Parent, Teacher, School Admin, Government
- **Full Assessment System**: Create → Submit → AI-assisted grading → Results → Analytics
- **AI Integration**: Anthropic Claude for feedback, lesson plans, district reports, policy simulation
- **Bilingual**: Complete Bangla + English toggle throughout
- **Digital Library**: 6+ resources with offline download tracking
- **Real-time Notifications**: Cross-role notification system
- **Charts & Analytics**: Recharts-powered performance, cognitive maps, national heatmaps
- **Bangladesh-specific**: GPA 5.0 scale, Taka currency, 8 divisions, Bengali names
- **Production-ready**: Rate limiting, CORS, compression, Helmet security, health checks

---

## 📱 PWA Support

The app works offline-capable via browser caching. To add full PWA:
```bash
cd client && npm install vite-plugin-pwa
```
Then add the PWA plugin to `vite.config.ts`.

---

*ভবিষ্যৎ — আজকের মূল্যায়ন আগামীর সফলতা*
