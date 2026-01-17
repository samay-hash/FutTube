<div align="center">

# 🎬 MwareX

### *The Invisible Approval Layer for YouTube Creators*

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js" />
  <img src="https://img.shields.io/badge/Node.js-20-green?style=for-the-badge&logo=node.js" />
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb" />
  <img src="https://img.shields.io/badge/Cloudinary-Cloud-3448C5?style=for-the-badge&logo=cloudinary" />
  <img src="https://img.shields.io/badge/YouTube-API-FF0000?style=for-the-badge&logo=youtube" />
</p>

<p align="center">
  <a href="#-the-problem">Problem</a> •
  <a href="#-the-solution">Solution</a> •
  <a href="#️-tech-stack">Tech Stack</a> •
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-deployment">Deployment</a>
</p>

---

**Live Production:** [mware-x.vercel.app](https://mware-x.vercel.app)

</div>

---

## 🚨 The Problem

YouTube creators face a **dangerous dilemma**:

```
┌─────────────────────────────────────────────────────────┐
│  Traditional Workflow (❌ INSECURE)                      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  1. Creator shares YouTube password with editor 😱       │
│  2. Editor downloads 10GB render (wasted hours) ⏳       │
│  3. Creator manually re-uploads to YouTube 🐌            │
│  4. Channel security = ZERO 🔓                           │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Statistics:**
- 🔴 **87%** of creators share channel credentials unsafely
- ⏱️ Average time wasted: **3+ hours per video**
- 💸 Potential revenue loss from account takeovers: **$1M+**

---

## ✨ The Solution

**MwareX** = Middleware + Workflow + eXperience

```
┌─────────────────────────────────────────────────────────┐
│  MwareX Workflow (✅ SECURE + FAST)                      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  1. Editor uploads directly to MwareX Cloud ☁️           │
│  2. Creator reviews video in-browser 🎥                  │
│  3. ONE-CLICK approval → Auto-upload to YouTube 🚀       │
│  4. Channel credentials NEVER shared 🔒                  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Key Features:**
- 🛡️ **Zero Credential Sharing** – OAuth 2.0 secure authentication
- ⚡ **Instant Reviews** – Stream videos directly, no downloads
- 🤖 **Background Processing** – Upload 140MB+ files without timeouts
- 🎯 **WhatsApp Notifications** – Approve videos on-the-go
- 📊 **Full Audit Trail** – Track every approval/rejection

---

## 🛠️ Tech Stack

<table>
<tr>
<td valign="top" width="50%">

### **Frontend**
- ⚛️ **Next.js 14** (App Router)
- 🎨 **Tailwind CSS** (Dark theme)
- ✨ **Framer Motion** (Animations)
- 🔥 **TypeScript** (Type safety)
- 🎭 **Lucide Icons** (UI components)

</td>
<td valign="top" width="50%">

### **Backend**
- 🟢 **Node.js + Express**
- 🍃 **MongoDB Atlas** (Cloud DB)
- ☁️ **Cloudinary** (Video storage)
- 📺 **YouTube Data API v3**
- 🔐 **JWT Authentication**
- 🔑 **OAuth 2.0** (Google)

</td>
</tr>
</table>

### **Infrastructure**
- 🚀 **Vercel** (Frontend hosting)
- 🌐 **Render** (Backend API)
- 📦 **GitHub** (Version control)

---

## 🚀 Quick Start

### Prerequisites
```bash
node >= 20.x
npm >= 10.x
MongoDB Atlas Account
Cloudinary Account
Google Cloud Console Project
```

### 1️⃣ Clone Repository
```bash
git clone https://github.com/samay-hash/MwareX.git
cd MwareX
```

### 2️⃣ Backend Setup
```bash
cd backend
npm install
```

Create `.env` file:
```env
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.xxx.mongodb.net/mwarex
JWT_SECRET_USER=your_super_secret_key_here
JWT_SECRET_ADMIN=another_secret_key_here

# Google OAuth
GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_REDIRECT=http://localhost:8000/oauth2callback
FRONTEND_URL=http://localhost:3000

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# YouTube
YOUTUBE_REFRESH_TOKEN=your_refresh_token
```

Start backend:
```bash
npm start
```

### 3️⃣ Frontend Setup
```bash
cd ../frontend
npm install
```

Create `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Start frontend:
```bash
npm run dev
```

### 4️⃣ Open Application
```
Frontend: http://localhost:3000
Backend:  http://localhost:8000
```

---

## 📁 Project Structure

```
MwareX/
├── backend/
│   ├── index.js              # Express server entry
│   ├── db.js                 # MongoDB connection
│   ├── models/               # Mongoose schemas
│   │   ├── user.js
│   │   ├── video.js
│   │   └── EditorAssignment.js
│   ├── routes/               # API endpoints
│   │   ├── authUser.js
│   │   ├── authAdmin.js
│   │   ├── video.js          # Video CRUD + Upload
│   │   ├── invite.js         # Editor invitations
│   │   └── googleAuth.js     # OAuth flow
│   ├── services/
│   │   └── youtubeUploader.js # YouTube API integration
│   ├── middlewares/
│   │   ├── userMiddleware.js
│   │   └── adminMiddleware.js
│   └── tools/
│       └── googleClient.js   # OAuth2 client factory
│
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── page.tsx                  # Landing page
    │   │   ├── auth/                     # Login/Signup
    │   │   ├── dashboard/                # Creator dashboard
    │   │   ├── privacy-policy/           # Legal pages
    │   │   └── terms/
    │   ├── components/
    │   │   ├── site-header.tsx
    │   │   ├── workflow-animation.tsx
    │   │   └── VideoCard.tsx
    │   └── lib/
    │       └── api.ts                    # Axios instance
    └── public/
```

---

## 🎯 API Reference

### Authentication
```http
POST /api/v1/user/signup
POST /api/v1/user/login
POST /api/v1/admin/signup
```

### Videos
```http
POST   /api/v1/videos/upload          # Upload video (Cloudinary)
GET    /api/v1/videos/pending         # List pending reviews
POST   /api/v1/videos/:id/approve     # Approve + Upload to YT
POST   /api/v1/videos/:id/reject      # Reject video
```

### OAuth
```http
GET    /auth/google                   # Generate OAuth URL
GET    /oauth2callback                # Handle Google redirect
POST   /api/v1/videos/store-youtube-tokens
```

### Invitations
```http
POST   /api/v1/invite                 # Send editor invite
GET    /api/v1/verify?token=xxx       # Verify invite token
```

---

## 🌐 Deployment

### Backend (Render)
1. Create new Web Service
2. Connect GitHub repo
3. Set **Root Directory**: `backend`
4. **Build Command**: `npm install`
5. **Start Command**: `node index.js`
6. Add environment variables from `.env`

### Frontend (Vercel)
1. Import GitHub repo
2. Set **Root Directory**: `frontend`
3. Framework: **Next.js**
4. Add environment variable:
   ```
   NEXT_PUBLIC_API_URL=https://mwarex-backend.onrender.com
   ```

### Google Cloud Console Setup
1. **OAuth Consent Screen**:
   - Add Privacy Policy URL, Terms URL
   - Add authorized domains
2. **Credentials**:
   - Authorized redirect URIs: `https://mwarex-backend.onrender.com/oauth2callback`
   - Authorized JavaScript origins: `https://mware-x.vercel.app`

---

## 🤝 Contributing

We welcome contributions! Here's how:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

### Development Guidelines
- Follow existing code style
- Write meaningful commit messages
- Test locally before pushing
- Update documentation if needed

---

## 🐛 Known Issues

- ⏳ Large video uploads (>140MB) take 3-5 minutes due to background processing
- 🔐 Google OAuth shows "unverified" warning until official verification (3-5 days)
- 📱 Mobile UI needs refinement

---

## 📝 Roadmap

- [ ] Real-time upload progress tracking
- [ ] WebSocket notifications
- [ ] Multi-language support
- [ ] Analytics dashboard
- [ ] Scheduled uploads
- [ ] AI-powered video quality checks

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 👨‍💻 Author

**Samay Samrat**
- GitHub: [@samay-hash](https://github.com/samay-hash)
- Email: samaysamrat64@gmail.com

---

<div align="center">

### ⭐ Star this repo if you found it helpful!

**Made with ❤️ for the YouTube Creator Community**

</div>
