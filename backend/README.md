# Digital Health Record — Backend (Patient Module)

This backend implements the Patient module APIs using Node.js, Express and MongoDB (Mongoose). Features:

- JWT authentication with role-based access (PATIENT, DOCTOR, ADMIN)
- Patient registration/login and profile management
- Health record metadata storage (no file blobs)
- Consent model for data sharing
- QR-token based record access
- Emergency access flow
- Multilingual preference support

Quick start:

1. Copy `.env.example` to `.env` and fill values.
2. Install dependencies:

```bash
cd backend
npm install
```

3. Run in development:

```bash
npm run dev
```
