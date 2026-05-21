# AI Resume Analyzer & Interview Prep Coach 📄✨

An advanced, full-stack AI-powered application that parses resumes (PDFs) and compares them against specific job descriptions. Using **Google Gemini AI**, the application computes a resume-to-job match score, conducts detailed skills gap analysis, generates tailored technical and behavioral interview preparation questions, and crafts a custom 1-14 day study plan to help candidates succeed.

---

## 🚀 Features

- 📂 **PDF Resume Parsing**: Upload resumes in PDF format; the backend automatically extracts and parses the text contents.
- 🤖 **Google Gemini AI Integration**: Utilizes the latest Gemini models (`gemini-3.1-flash-lite`) via the official `@google/genai` SDK with Zod schema validation.
- 🎯 **Advanced Match Scoring**: Computes a detailed match score (0-100%) indicating how well the candidate fits the target job description.
- 🔍 **Skills Gap Analysis**: Highlights missing skills and tags them with a severity rating (e.g., critical vs. moderate gaps).
- 📅 **Personalized Study Plan**: Creates a custom, day-by-day preparation schedule (ranging from 1 to 14 days) based on the gaps and job requirements.
- 💬 **Custom Interview Q&A**: Generates standard/advanced technical and behavioral questions tailored to the resume and job description, along with suggested answers.
- 🔒 **Secure Authentication**: Supports traditional email/password registration and login, as well as OAuth2.0 authentication via **Google Sign-In** using Passport.js and secure cookie-based JWT sessions.
- 📊 **Interactive Dashboard**: View, analyze, and keep track of all previously generated analysis reports.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 (using Vite)
- **Routing**: React Router v7
- **Styling**: Tailwind CSS v4 (with `@tailwindcss/vite` plugin), Sass
- **Icons**: Lucide React
- **API Client**: Axios

### Backend
- **Runtime & Framework**: Node.js, Express.js (v5)
- **Database**: MongoDB (configured with Mongoose ORM)
- **AI Integration**: `@google/genai` (Gemini API) & `zod-to-json-schema`
- **File Uploads**: Multer
- **PDF Extraction**: `pdf-parse`
- **Security & Session**: JWT (`jsonwebtoken`), BCrypt, Cookie Parser, Express Session, Passport.js (Google OAuth 2.0 Strategy)
- **Validation**: Zod

---

## 📂 Directory Structure

```text
Resume Analyzer/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── features/         # Feature-based modular structure
│   │   │   ├── auth/         # Login, Register, Google OAuth components
│   │   │   └── dashboard/    # Interactive dashboard & reports view
│   │   ├── utils/            # API setup, token helpers
│   │   ├── app.routes.jsx    # React Router setup
│   │   ├── App.jsx           # Root layout component
│   │   ├── index.css         # Styling styles
│   │   └── main.jsx          # Vite entrypoint
│   └── package.json
│
├── backend/                  # Node.js Express backend API
│   ├── src/
│   │   ├── config/           # DB & Passport config
│   │   ├── controllers/      # Request handlers (auth, reports)
│   │   ├── dao/              # Database Access Objects (encapsulated queries)
│   │   ├── middlewares/      # PDF parsing, auth & multer file upload guards
│   │   ├── models/           # Mongoose schemas (User, Report)
│   │   ├── routes/           # Express API endpoints
│   │   ├── services/         # Gemini integration & validation schemas
│   │   └── utils/            # JWT & Cookie helpers
│   ├── server.js             # Express startup file
│   └── package.json
└── README.md                 # Project documentation
```

---

## ⚙️ Getting Started

### Prerequisites
Before running the project locally, ensure you have:
1. **Node.js** (v18+ recommended)
2. **MongoDB Database** (local instance or MongoDB Atlas cluster)
3. **Google Gemini API Key** (obtainable from Google AI Studio)
4. **Google Cloud Console Credentials** (for Google Sign-In / OAuth)

---

### Setup Instructions

#### 1. Clone the Repository
```bash
git clone https://github.com/singhankit04/Resume-Analyzer.git
cd Resume-Analyzer
```

#### 2. Configure the Backend
Navigate to the `backend` folder and install dependencies:
```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory with the following variables:
```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
ACCESS_TOKEN_SECRET=your_jwt_access_secret
REFRESH_TOKEN_SECRET=your_jwt_refresh_secret
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
```

Start the backend server in development mode (using Nodemon):
```bash
npm run dev
```
The backend server will run on `http://localhost:3000`.

---

#### 3. Configure the Frontend
In a new terminal window, navigate to the `frontend` folder and install dependencies:
```bash
cd ../frontend
npm install
```

Start the frontend Vite dev server:
```bash
npm run dev
```
The frontend application will run on `http://localhost:5173`.

---

## 🔌 API Reference

### Authentication Endpoints
| HTTP Method | Route | Description | Auth Required |
|---|---|---|---|
| `POST` | `/auth/register` | Register a new user | No |
| `POST` | `/auth/login` | Login user & set cookie session | No |
| `POST` | `/auth/refresh` | Obtain a new JWT access token | No |
| `GET` | `/auth/google` | Trigger Google OAuth 2.0 flow | No |
| `GET` | `/auth/google/callback` | Callback destination for Google login | No |
| `GET` | `/auth/me` | Fetch authenticated user profiles | Yes (JWT) |

### Report & Analysis Endpoints
| HTTP Method | Route | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/generatereport` | Upload PDF Resume and compare with text Job Description | Yes (JWT) |
| `GET` | `/api/reports` | Get list of all previous reports for authenticated user | Yes (JWT) |
| `GET` | `/api/reports/:reportId` | Retrieve full details of a specific report | Yes (JWT) |

---

## 🛡️ License

This project is licensed under the ISC License. See `backend/package.json` for licensing details.

---

## 👨‍💻 Contributor

- **Ankit Singh** ([singhankit04](https://github.com/singhankit04))
