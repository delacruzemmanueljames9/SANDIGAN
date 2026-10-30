# TINIG KABATAAN (TK) — COMPLETE DIGITAL ECOSYSTEM

> **"Your Voice Matters. Your Mind Matters."**

Tinig KaBataan (TK) is a unified, youth-led digital institution in the Philippines. It combines public-facing services with an interactive, private virtual headquarters.

---

## 🏛️ Two Distinct Environments

1. **Public Ecosystem**:
   - Central Institutional Portal (`/`)
   - Mental Health Support Sanctuary (`/mental-health`)
     - **Talk to Tinig**: Guided conversational support with crisis de-escalation
     - **Help Me Right Now**: Immediate distress triage (panic, burnout, loneliness, family tension)
     - **The Reset Room**: Interactive guided breathing (4-7-8 and Box Breathing), 5-4-3-2-1 sensory grounding, and Web Audio synthesized soundscapes
     - **Inner Garden**: Private local journaling, mood tracking, and gratitude practice
     - **MindLab**: Evidence-based psychoeducation, myth vs. fact cards, and mental health FAQs
     - **Support Directory**: Verified Philippine crisis hotlines (NCMH 1553, Hopeline) and free clinic teleconsults
     - **Youth Voice Wall**: Safe, moderated youth perspective and reflection wall
   - **TK Publication Division & Gazette** (`/publication`)
   - **TK Youth Action Hub & Volunteer Chapters** (`/youth`)
   - **TK Leadership & Learning Academy** (`/learning`)
   - About, Departments, Services, News, Campaigns, Contact, Terms, and RA 10173 Privacy Policy.

2. **Private Virtual Headquarters (HQ 2.0)** (`/hq`):
   - **Interactive 2.5D Isometric Virtual Office Map** featuring 10 departmental rooms:
     1. Main Administration Office
     2. Mental Health Department
     3. Publication Department
     4. Youth Engagement Department
     5. Learning and Development Department
     6. Research Department
     7. Project Coordination Room
     8. Meeting Room
     9. Knowledge Center
     10. Officer Workspace
   - **HQ Command Center**: Real analytics with Recharts, KPI overview, date and department filters, and CSV/JSON export.
   - **Officer Directory & RBAC Matrix**: Full profile and role permissions management.
   - **Project Kanban & Sprints**: Interactive task board with stage progression.
   - **Central Knowledge Brain**: Categorized repository for organizational SOPs, research papers, and charters with public, internal, and restricted clearance.
   - **Websites & Portals Registry**: Add, manage, publish, and organize multiple autonomous websites.
   - **Content Management System (CMS)**: Editorial dispatches and child-safety moderation queue.
   - **Department AI Copilots**: 5 compartmentalized internal assistants with strict privacy boundaries.
   - **System Audit Logs**: Real-time event logging.

---

## 🛠️ Technology Stack

- **Frontend**: Next.js 14+ (App Router), TypeScript, Tailwind CSS, Lucide Icons, Recharts, Canvas Confetti.
- **Backend & Security**: Supabase PostgreSQL, Row Level Security (RLS), Supabase Auth & Storage.
- **AI Service Layer**: Provider-independent server architecture supporting Google Gemini API with compassionate rule-based fallback and crisis keyword detection.
- **Audio Engine**: Native HTML5 Web Audio API synthesizer for ambient noise generation (no third-party audio dependencies).
- **Compliance**: Philippine Data Privacy Act of 2012 (RA 10173) and Mental Health Act (RA 11036).

---

## 🚀 Getting Started Locally

### 1. Clone & Install
```bash
git clone https://github.com/tinig-kabataan/tinig-kabataan.git
cd tinig-kabataan
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
*(The platform features an integrated in-memory reactive data layer, so it runs immediately out-of-the-box without waiting for cloud credentials!)*

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000).

---

## 🔐 Evaluating Roles & Access Control

Use the **Role Switcher** in the navigation bar to test identities:
- **Super Admin** (Founder): Complete HQ access, website registry, CMS, and audit logs.
- **Platform Admin**: System configuration and operations.
- **Department Head**: Dedicated room and initiative management.
- **Officer**: Collaborative sprint boards and document library.
- **Content Reviewer**: Moderation queue and publication review.
- **Public User**: Accesses public sanctuary only. Attempting to enter `/hq` demonstrates the security gatekeeper.

---

## 📦 Deployment Instructions

See [DEPLOYMENT.md](DEPLOYMENT.md) for step-by-step instructions on deploying the project to **Vercel** and connecting **Supabase PostgreSQL**.
