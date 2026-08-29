# Skill Intelligence Platform

## SIH PS 26101 - AI-Enabled Learning Platform for India's Official Statistical System

### Organization: Ministry of Statistics and Programme Implementation (MoSPI)

---

## 🎯 Problem Statement

Develop an AI-enabled learning platform that:
- Identifies competency gaps
- Recommends personalized training through integration with iGOT Karmayogi ecosystem
- Generates Quizzes and MCQs from uploaded learning materials
- Strengthens capacity building in India's Official Statistical System

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                      │
│  Dashboard | Quiz Builder | Competency | Learning Path  │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                   BACKEND (FastAPI)                      │
│  Auth | Competency | Quiz | Recommendation | Dashboard  │
└─────────────────────────────────────────────────────────┘
                           │
           ┌───────────────┼───────────────┐
           ▼               ▼               ▼
    ┌────────────┐  ┌────────────┐  ┌────────────┐
    │ PostgreSQL │  │   Redis    │  │  Qdrant    │
    └────────────┘  └────────────┘  └────────────┘
```

---

## 🚀 Features

### 1. AI-Based Competency Assessment
- Skill extraction from user profiles
- Competency level scoring (0-5 scale)
- Gap analysis against target levels
- Category-wise performance (Statistical, Technical, Digital Governance, Behavioural)

### 2. Automated Skill-Gap Analysis
- O*NET-inspired competency framework
- Personalized gap identification
- Priority-based recommendations
- Progress tracking

### 3. iGOT Karmayogi Integration
- Course catalog sync
- Enrollment management
- Progress tracking
- Competency synchronization

### 4. Personalized Learning Recommendations
- Semantic similarity-based course matching
- Learning path generation
- Milestone tracking
- Adaptive recommendations

### 5. AI-Powered Quiz Generation
- MCQ generation from uploaded documents
- Concept-based quiz creation
- Difficulty level selection
- Auto-evaluation with explanations

### 6. Interactive Dashboards
- Learner dashboard with progress tracking
- Admin dashboard with org-wide analytics
- Predictive insights
- Skill distribution visualization

---

## 📊 Datasets Used

| Dataset | Purpose |
|---------|---------|
| Dataset QLOP | Skills taxonomy, O*NET mapping |
| Student Skill Gap Analysis | Gap assessment training |
| Engineering Graduate Competency | Competency scoring |
| AI-Powered Personalized Learning | Learning path optimization |
| Technical Generated Questions | MCQ generation |
| EduQG Dataset | Educational MCQs |
| O*NET Database | Skills framework |
| Indian Job Market Dataset | Indian context |

---

## 🛠️ Tech Stack

### Backend
- **Framework**: FastAPI (Python 3.10+)
- **Database**: PostgreSQL
- **Cache**: Redis
- **ML Models**: Hugging Face Transformers
- **NLP**: spaCy
- **Vector DB**: Qdrant

### AI/ML Models Used (Pre-trained)
- `all-MiniLM-L6-v2` - Sentence embeddings for skill matching
- `facebook/bart-large-mnli` - Zero-shot classification
- `google/flan-t5-base` - Text generation for MCQs
- `mrm8488/t5-base-finetuned-question-generation-ap` - Question generation
- `facebook/bart-large-cnn` - Summarization
- `en_core_web_sm` - spaCy NLP

### Frontend
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **State**: React Context
- **HTTP**: Axios

---

## 📁 Project Structure

```
skill-platform/
├── backend/
│   ├── app/
│   │   ├── api/           # API routes
│   │   ├── models/        # Database models
│   │   ├── services/      # Business logic & ML
│   │   └── main.py        # FastAPI app
│   ├── ml/                # ML model storage
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   └── App.jsx        # Main app
│   ├── package.json
│   └── Dockerfile
├── data/
│   ├── raw/               # Raw datasets
│   └── processed/         # Processed data
├── docker-compose.yml
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- PostgreSQL 15+
- Redis 7+

### Quick Start with Docker

```bash
# Clone the repository
git clone <repo-url>
cd skill-platform

# Start all services
docker-compose up -d

# Access the application
# Frontend: http://localhost:5173
# Backend: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

### Manual Setup

#### Backend
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
# or
venv\Scripts\activate  # Windows

# Install dependencies
pip install -r requirements.txt

# Download spacy model
python -m spacy download en_core_web_sm

# Set environment variables
cp .env.example .env
# Edit .env with your settings

# Run the server
uvicorn app.main:app --reload --port 8000
```

#### Frontend
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

---

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Competency
- `POST /api/competency/assess` - Run assessment
- `GET /api/competency/gaps` - Get skill gaps
- `GET /api/competency/framework` - Get framework
- `GET /api/competency/report` - Get report

### Quiz
- `POST /api/quiz/generate` - Generate quiz
- `POST /api/quiz/generate-from-document` - Generate from document
- `POST /api/quiz/submit` - Submit answers
- `GET /api/quiz/history` - Get history

### Recommendations
- `POST /api/recommendation/courses` - Get course recommendations
- `POST /api/recommendation/learning-path` - Generate learning path
- `GET /api/recommendation/active-path` - Get active path

### Dashboard
- `GET /api/dashboard/learner` - Learner dashboard
- `GET /api/dashboard/admin` - Admin dashboard
- `GET /api/dashboard/analytics` - Analytics

### iGOT Integration
- `GET /api/igot/courses` - Get iGOT courses
- `POST /api/igot/enroll/{course_id}` - Enroll in course
- `GET /api/igot/progress` - Get progress

---

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:postgres@localhost:5432/skill_platform` |
| `REDIS_URL` | Redis connection string | `redis://localhost:6379/0` |
| `SECRET_KEY` | JWT secret key | (required) |
| `IGOT_API_URL` | iGOT API endpoint | `https://api.karmayogi.gov.in` |
| `IGOT_API_KEY` | iGOT API key | (optional) |

---

## 🧪 Testing

```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test
```

---

## 📈 Performance Considerations

1. **ML Model Loading**: Models are loaded once at startup and cached
2. **Database Connection Pooling**: SQLAlchemy handles connection pooling
3. **Redis Caching**: Frequently accessed data is cached
4. **Async Operations**: FastAPI handles concurrent requests efficiently

---

## 🔒 Security Features

- JWT-based authentication
- Role-based access control (RBAC)
- Password hashing with bcrypt
- CORS configuration
- Input validation with Pydantic

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgements

- **Smart India Hackathon** for the problem statement
- **MoSPI** for the domain expertise
- **iGOT Karmayogi** for the learning platform integration
- **Hugging Face** for pre-trained models
- **O*NET** for the skills taxonomy framework
