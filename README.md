# ProjectPulse – Project Health Tracker

ProjectPulse is a full-stack internal system for tracking project progress, employee confidence, client feedback, and delivery risks.  
It automatically calculates a Project Health Score to help teams identify project issues early.

---

## 🌐 Live Demo
🔗 Live URL:https://projectpulse-z2yp.vercel.app/
🔗 GitHub Server: https://github.com/mehedi67719/projectpules-server.git

---

## 🛠 Tech Stack
- **Frontend:** Next.js, Tailwind CSS
- **Backend:** Express.js
- **Database:** MongoDB Atlas
- **Authorization:** Role-based (Admin / Employee / Client)

---

## 👥 User Roles
**Admin**
- Manage projects, users, and risks
- Monitor project health

**Employee**
- Submit weekly check-ins
- Report risks and blockers

**Client**
- Submit weekly feedback
- Flag project issues

---

## 📁 Core Features
- Secure login (no public registration)
- Project creation & assignment
- Weekly employee check-ins
- Weekly client feedback
- Risk management system
- Role-based dashboards
- Activity timeline per project

---

## ❤️ Project Health Score Logic (0–100)
Calculated using:
- Client satisfaction (30%)
- Employee confidence (25%)
- Progress vs timeline (25%)
- Open risks & flagged issues (20%)

**Health Status**
- 80–100 → On Track  
- 60–79 → At Risk  
- Below 60 → Critical  

---

## Login info <br/>
-Admin :  email= mehedi@gmail.com , password = mehedi123 <br/>
-Empolyee: email = asad@gmail.com , password= asad123 <br/>
-Clint: email=jewel@gmail.com , password= jewel123 <br/>

## ⚙️ Setup
```bash
git clone https://github.com/mehedi67719/PROJECTPULSE.git
npm install
npm run seed
npm run dev
