# ByteBlitz Staff Hub

Private CRM and resource dashboard for ByteBlitz sales team in Montrose, Scotland. Built for commission-based reps to manage leads, track bookings, and access company resources.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/byteblitz/staff-hub.git
cd byteblitz-staff-hub
```

2. Set up the database:
```bash
# Create database
createdb byteblitz_hub

# Run schema
psql -U postgres -d byteblitz_hub -f database/schema.sql
```

3. Configure environment variables:
```bash
# Backend
cp server/.env.example server/.env

# Edit server/.env with your credentials:
# DATABASE_URL=postgresql://postgres:password@localhost:5432/byteblitz_hub
# JWT_SECRET=your-super-secret-jwt-key-change-this
# PORT=5000
```

4. Install dependencies:
```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

5. Start development servers:
```bash
# Terminal 1 - Backend (from /server)
npm run dev

# Terminal 2 - Frontend (from /client)
npm run dev
```

6. Access the app:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api

## 🔐 Default Admin Credentials
```
Email: elias@byteblitz.co.uk
Password: ByteBlitz2025!
```

**⚠️ IMPORTANT:** Change the admin password immediately after first login!

## 📱 Features

### For Sales Reps
- **Dashboard** - Performance metrics, commission earned, quick links
- **Lead Management** - View assigned leads, update status, add notes
- **Lead Requests** - Request new leads by industry/region
- **Resources** - Access scripts, templates, objection handling guides
- **Commission Tracking** - View earnings (10% per sale, £30 minimum)
- **Support** - Contact Elias directly via in-app messaging

### For Admins (Elias)
- **User Management** - Add/remove reps, reset passwords
- **Lead Assignment** - Import and assign leads to reps
- **Announcements** - Post company-wide messages
- **Commission Control** - Mark payments as paid, adjust amounts
- **Full Analytics** - See all activity across the platform

## 🛠 Tech Stack

### Frontend
- **React 18** - UI framework
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **React Router v6** - Navigation
- **Axios** - API calls
- **React Hot Toast** - Notifications

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **PostgreSQL** - Database
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Helmet** - Security headers

### Design
- **Theme**: Dark mode with black background
- **Accent**: Purple gradients (#8B5CF6)
- **Font**: Red Hat Display
- **Icons**: Feather Icons

## 📦 Project Structure

```
byteblitz-staff-hub/
├── client/                 # React frontend
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── contexts/      # Auth context
│   │   ├── pages/         # Route pages
│   │   ├── services/      # API services
│   │   └── App.jsx        # Main app component
│   └── package.json
│
├── server/                 # Node.js backend
│   ├── config/            # Database config
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Auth middleware
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── server.js          # Express server
│   └── package.json
│
├── database/
│   └── schema.sql         # PostgreSQL schema
│
├── docker-compose.yml     # Docker setup (optional)
├── .env.example          # Environment template
└── README.md             # This file
```

## 🔗 Integrated Tools

The hub links to ByteBlitz's ecosystem:

| Tool | URL | Purpose |
|------|-----|---------|
| AI Assistant | ai.byteblitz.co.uk | GPT-powered helper |
| Automation | n8n.byteblitz.co.uk | Workflow automation |
| Email Marketing | mautic.byteblitz.co.uk | Campaign management |
| CRM | crm.byteblitz.co.uk | Client tracking |
| Lead Portal | leads.byteblitz.co.uk | Coming soon |
| Booking System | cal.byteblitz.co.uk | Meeting scheduler |

## 🚢 Deployment

### Option 1: Vercel + Supabase (Recommended)
```bash
# Frontend on Vercel
cd client
npm run build
vercel

# Backend on Supabase
# Use Supabase dashboard to create project
# Update DATABASE_URL in production
```

### Option 2: VPS with Docker
```bash
# Build and run with Docker Compose
docker-compose up -d
```

### Option 3: Railway/Render
- Deploy backend + PostgreSQL on Railway
- Deploy frontend on Vercel/Netlify
- Update environment variables

## 🔒 Security

- JWT tokens expire after 7 days
- Passwords hashed with bcrypt (10 rounds)
- Role-based access control (rep vs admin)
- Rate limiting on API endpoints
- CORS configured for production domain
- SQL injection protection via parameterized queries

## 📊 Commission Structure

- **Rate**: 10% of sale value
- **Minimum**: £30 per commission
- **Typical Sales**: £250-£850
- **Payment**: Monthly via bank transfer
- **Tracking**: Real-time in dashboard

## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Check PostgreSQL is running
sudo service postgresql status

# Test connection
psql -U postgres -d byteblitz_hub
```

### Port Conflicts
```bash
# Backend defaults to 5000, frontend to 5173
# Change in .env if needed
PORT=5001
```

### Missing Dependencies
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/new-feature`
2. Commit changes: `git commit -m 'Add new feature'`
3. Push branch: `git push origin feature/new-feature`
4. Open pull request

## 📞 Support

- **Internal Support**: Use in-app support tab
- **Direct Contact**: 07359 735508
- **Email**: elias@byteblitz.co.uk
- **Emergency**: Check #staff-hub in Discord

## 📝 License

Private and confidential. Property of ByteBlitz Ltd.

---

Built with 💜 by ByteBlitz - Turning Scottish businesses digital, one website at a time.

**Version**: 1.0.0  
**Last Updated**: January 2025  
**Location**: Montrose, Scotland 🏴󐁧󐁢󐁳󐁣󐁴󐁿