---
description: Repository Information Overview
alwaysApply: true
---

# Digital Health Record Repository Information

## Repository Summary
This repository contains a comprehensive Digital Health Record system, featuring a Node.js backend and a React-based frontend. It supports patient data management, health records, appointments, consent management, and AI-driven clinical insights.

## Repository Structure
The project is organized as a monorepo with separate directories for backend and frontend components.
- **backend/**: Express.js server providing API endpoints for authentication, patient records, appointments, and AI features.
- **frontend/**: React application built with Vite, offering dashboards for patients, doctors, and administrators.

### Main Repository Components
- **Backend API**: Handles data persistence via MongoDB and provides core business logic.
- **Frontend App**: Interactive user interface with role-based dashboards and multilingual support.

## Projects

### Backend Service
**Configuration File**: [./backend/package.json](./backend/package.json)

#### Language & Runtime
**Language**: JavaScript (Node.js)  
**Version**: Node.js 16+ (assumed from dependencies)  
**Build System**: Node.js  
**Package Manager**: npm

#### Dependencies
**Main Dependencies**:
- `express`: Web framework
- `mongoose`: MongoDB ODM
- `jsonwebtoken`: Authentication
- `bcryptjs`: Password hashing
- `multer`: File uploads
- `openai`: AI integration
- `nodemailer`, `@sendgrid/mail`: Email services
- `helmet`, `cors`, `morgan`: Middleware utilities

**Development Dependencies**:
- `nodemon`: Development server auto-reload

#### Build & Installation
```bash
cd backend && npm install
```

#### Main Files & Resources
- **Entry Point**: [./backend/src/index.js](./backend/src/index.js)
- **Database Config**: [./backend/src/config/db.js](./backend/src/config/db.js)
- **Models**: [./backend/src/models/](./backend/src/models/) (Patient, HealthRecord, Appointment, Consent)
- **Routes**: [./backend/src/routes/](./backend/src/routes/)
- **Controllers**: [./backend/src/controllers/](./backend/src/controllers/)

---

### Frontend Application
**Configuration File**: [./frontend/package.json](./frontend/package.json)

#### Language & Runtime
**Language**: TypeScript / JavaScript (React)  
**Version**: Vite 6, React 18  
**Build System**: Vite  
**Package Manager**: npm

#### Dependencies
**Main Dependencies**:
- `@mui/material`, `@radix-ui/*`: UI components
- `lucide-react`: Icon library
- `recharts`: Data visualization
- `react-hook-form`: Form management
- `tailwind-merge`, `clsx`: Styling utilities
- `date-fns`: Date manipulation

**Development Dependencies**:
- `vite`: Build tool
- `tailwindcss`: Utility-first CSS framework
- `@vitejs/plugin-react`: React support for Vite

#### Build & Installation
```bash
cd frontend && npm install
npm run build --prefix frontend
```

#### Main Files & Resources
- **Entry Point**: [./frontend/src/main.tsx](./frontend/src/main.tsx)
- **Main Component**: [./frontend/src/app/App.tsx](./frontend/src/app/App.tsx)
- **Dashboards**: [./frontend/src/app/components/dashboards/](./frontend/src/app/components/dashboards/)
- **Patient Components**: [./frontend/src/app/components/patient/](./frontend/src/app/components/patient/)
- **Contexts**: [./frontend/src/app/context/](./frontend/src/app/context/) (e.g., LanguageContext)

#### Usage & Operations
**Key Commands**:
```bash
# Run both backend and frontend in development mode
npm run dev

# Run backend only
npm run backend

# Run frontend only
npm run frontend
```

---

## Testing & Validation
- **Manual Tests**: Root level scripts [./test_api.js](./test_api.js) and [./test_otp.js](./test_otp.js) are available for manual API and OTP verification.
- **Backend Utilities**: [./backend/src/test-email.js](./backend/src/test-email.js) for testing email delivery.
