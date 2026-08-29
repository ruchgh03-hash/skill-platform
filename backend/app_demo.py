from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional
import random

app = FastAPI(
    title="Skill Intelligence Platform",
    description="AI-Enabled Learning Platform - SIH PS 26101",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ====== MODELS ======

class UserCreate(BaseModel):
    email: str
    password: str
    full_name: str
    designation: Optional[str] = None
    department: Optional[str] = None

class SkillInput(BaseModel):
    skills: List[str]
    experience: int

class QuizRequest(BaseModel):
    text: Optional[str] = None
    concept: Optional[str] = None
    num_questions: int = 5
    difficulty: str = "medium"

class QuizSubmit(BaseModel):
    quiz_id: int
    answers: Dict[str, str]

# ====== COMPETENCY FRAMEWORK ======

COMPETENCY_FRAMEWORK = {
    "statistical": {
        "skills": ["Survey Design", "Sampling Methods", "National Accounts", "Price Statistics", 
                    "Labour Statistics", "Agricultural Statistics", "SDG Indicators", "Data Quality Frameworks"]
    },
    "technical": {
        "skills": ["Python", "R", "SQL", "Data Visualization", "AI/ML", "Cloud Computing", "GIS", "Machine Learning"]
    },
    "digital_governance": {
        "skills": ["Cybersecurity", "Data Privacy", "Digital Signatures", "Government Cloud"]
    },
    "behavioural": {
        "skills": ["Leadership", "Communication", "Project Management", "Ethics", "Decision Making"]
    }
}

# ====== MOCK IGOT COURSES ======

IGOT_COURSES = [
    {"id": "IGOT001", "title": "Python for Data Analysis", "category": "technical", "skills": ["Python", "Data Analysis"], "difficulty": "beginner", "duration": 120, "url": "https://igotkarmayogi.gov.in"},
    {"id": "IGOT002", "title": "Survey Design Fundamentals", "category": "statistical", "skills": ["Survey Design", "Sampling"], "difficulty": "intermediate", "duration": 180, "url": "https://igotkarmayogi.gov.in"},
    {"id": "IGOT003", "title": "National Accounts & GDP", "category": "statistical", "skills": ["National Accounts", "GDP"], "difficulty": "intermediate", "duration": 150, "url": "https://igotkarmayogi.gov.in"},
    {"id": "IGOT004", "title": "Data Visualization with Tableau", "category": "technical", "skills": ["Data Visualization", "Tableau"], "difficulty": "beginner", "duration": 90, "url": "https://igotkarmayogi.gov.in"},
    {"id": "IGOT005", "title": "Machine Learning Basics", "category": "technical", "skills": ["Machine Learning", "AI/ML"], "difficulty": "advanced", "duration": 240, "url": "https://igotkarmayogi.gov.in"},
    {"id": "IGOT006", "title": "Cybersecurity Essentials", "category": "digital_governance", "skills": ["Cybersecurity", "Data Privacy"], "difficulty": "beginner", "duration": 60, "url": "https://igotkarmayogi.gov.in"},
    {"id": "IGOT007", "title": "Communication Skills", "category": "behavioural", "skills": ["Communication", "Presentation"], "difficulty": "beginner", "duration": 45, "url": "https://igotkarmayogi.gov.in"},
    {"id": "IGOT008", "title": "Project Management", "category": "behavioural", "skills": ["Project Management", "Leadership"], "difficulty": "intermediate", "duration": 120, "url": "https://igotkarmayogi.gov.in"},
    {"id": "IGOT009", "title": "SQL for Data Management", "category": "technical", "skills": ["SQL", "Database"], "difficulty": "beginner", "duration": 90, "url": "https://igotkarmayogi.gov.in"},
    {"id": "IGOT010", "title": "Price Statistics & CPI", "category": "statistical", "skills": ["Price Statistics", "CPI"], "difficulty": "intermediate", "duration": 100, "url": "https://igotkarmayogi.gov.in"},
]

# ====== IN-MEMORY STORAGE ======

users_db = {}
quizzes_db = {}
quiz_counter = 0
user_counter = 0

# ====== ROUTES ======

@app.get("/")
async def root():
    return {
        "message": "Skill Intelligence Platform - SIH PS 26101",
        "status": "running",
        "endpoints": {
            "docs": "/docs",
            "health": "/health"
        }
    }

@app.get("/health")
async def health():
    return {"status": "healthy", "version": "1.0.0"}

@app.post("/api/auth/register")
async def register(user: UserCreate):
    global user_counter
    user_counter += 1
    users_db[user_counter] = {
        "id": user_counter,
        "email": user.email,
        "full_name": user.full_name,
        "designation": user.designation or "Officer",
        "department": user.department or "MoSPI",
        "role": "learner"
    }
    return {"message": "User registered", "user": users_db[user_counter]}

@app.post("/api/auth/login")
async def login(form_data: dict):
    email = form_data.get("username") or form_data.get("email")
    for uid, user in users_db.items():
        if user["email"] == email:
            return {"access_token": f"token_{uid}", "token_type": "bearer", "user": user}
    return {"access_token": "token_demo", "token_type": "bearer", "user": {"id": 1, "email": email, "full_name": "Demo User", "designation": "Under Secretary", "department": "MoSPI", "role": "admin"}}

@app.get("/api/competency/framework")
async def get_framework():
    return COMPETENCY_FRAMEWORK

@app.post("/api/competency/assess")
async def assess_competencies(input_data: SkillInput):
    competency_levels = {}
    for category, data in COMPETENCY_FRAMEWORK.items():
        for skill in data["skills"]:
            if skill.lower() in [s.lower() for s in input_data.skills]:
                level = min(5.0, 1.0 + (input_data.experience * 0.3) + random.uniform(0, 1))
                competency_levels[skill] = round(level, 1)
            else:
                competency_levels[skill] = 0.0
    
    gaps = []
    for skill, level in competency_levels.items():
        target = 3.5
        if level < target:
            gaps.append({
                "skill": skill,
                "current_level": level,
                "target_level": target,
                "gap": round(target - level, 1),
                "priority": "high" if (target - level) > 2 else "medium" if (target - level) > 1 else "low"
            })
    gaps.sort(key=lambda x: x["gap"], reverse=True)
    
    overall_score = sum(competency_levels.values()) / len(competency_levels) if competency_levels else 0
    
    return {
        "user_id": 1,
        "competency_levels": competency_levels,
        "skill_gaps": gaps[:10],
        "overall_score": round(overall_score, 2),
        "recommendations": [
            "Focus on high-priority skill gaps",
            "Enroll in iGOT Karmayogi courses",
            "Complete at least 2 courses this quarter"
        ]
    }

@app.post("/api/quiz/generate")
async def generate_quiz(request: QuizRequest):
    global quiz_counter
    quiz_counter += 1
    
    text = request.text or request.concept or "General knowledge"
    
    questions = []
    topics = ["Statistical Analysis", "Data Quality", "Python Programming", "Survey Methods", "Data Visualization"]
    
    for i in range(request.num_questions):
        topic = random.choice(topics)
        questions.append({
            "id": i + 1,
            "question": f"What is the best practice for {topic.lower()} in official statistics?",
            "options": [
                "Use standardized methodologies",
                "Follow international guidelines",
                "Ensure data quality checks",
                "All of the above"
            ],
            "correct_answer": "D",
            "explanation": f"Best practices in {topic.lower()} involve following standards and guidelines.",
            "difficulty": request.difficulty,
            "concept": topic
        })
    
    quizzes_db[quiz_counter] = {"questions": questions}
    
    return {
        "id": quiz_counter,
        "title": f"Quiz - {request.difficulty.title()}",
        "questions": questions,
        "total_questions": len(questions),
        "difficulty": request.difficulty,
        "time_limit_minutes": len(questions) * 2
    }

@app.post("/api/quiz/submit")
async def submit_quiz(request: QuizSubmit):
    quiz = quizzes_db.get(request.quiz_id, {"questions": []})
    questions = quiz["questions"]
    
    correct = 0
    results = []
    for q in questions:
        user_answer = request.answers.get(str(q["id"]))
        is_correct = user_answer == q["correct_answer"]
        if is_correct:
            correct += 1
        results.append({
            "question_id": q["id"],
            "question": q["question"],
            "user_answer": user_answer,
            "correct_answer": q["correct_answer"],
            "is_correct": is_correct,
            "explanation": q["explanation"]
        })
    
    total = len(questions)
    score = (correct / total * 100) if total > 0 else 0
    
    return {
        "score": round(score, 2),
        "grade": "A" if score >= 80 else "B" if score >= 60 else "C",
        "correct_count": correct,
        "total_questions": total,
        "results": results
    }

@app.post("/api/recommendation/learning-path")
async def get_learning_path():
    return {
        "skill_gaps": [
            {"skill": "Machine Learning", "current_level": 1.0, "target_level": 3.5, "gap": 2.5, "priority": "high"},
            {"skill": "Data Visualization", "current_level": 2.0, "target_level": 3.5, "gap": 1.5, "priority": "medium"},
            {"skill": "Cloud Computing", "current_level": 1.5, "target_level": 3.0, "gap": 1.5, "priority": "medium"}
        ],
        "recommended_courses": IGOT_COURSES[:5],
        "total_courses": 5,
        "estimated_duration_hours": 12,
        "estimated_completion_days": 30,
        "learning_milestones": [
            {"milestone": 1, "course": "Python for Data Analysis", "skills_to_gain": ["Python", "Data Analysis"], "estimated_completion": "Week 1"},
            {"milestone": 2, "course": "Data Visualization", "skills_to_gain": ["Data Visualization", "Tableau"], "estimated_completion": "Week 2"},
            {"milestone": 3, "course": "Machine Learning Basics", "skills_to_gain": ["Machine Learning", "AI/ML"], "estimated_completion": "Week 3-4"}
        ]
    }

@app.get("/api/recommendation/active-path")
async def get_active_path():
    return {
        "id": 1,
        "skill_gaps": [{"skill": "Machine Learning", "gap": 2.5}],
        "recommended_courses": IGOT_COURSES[:3],
        "estimated_completion_days": 30
    }

@app.get("/api/dashboard/learner")
async def learner_dashboard():
    return {
        "user": {"name": "Demo User", "designation": "Under Secretary", "department": "MoSPI"},
        "competency_summary": {
            "overall_score": 3.2,
            "skills_assessed": 12,
            "top_skills": [
                {"skill": "SQL", "level": 4.0},
                {"skill": "Python", "level": 3.5},
                {"skill": "Survey Design", "level": 3.2}
            ],
            "improvement_areas": [
                {"skill": "Machine Learning", "gap": 2.5},
                {"skill": "Cloud Computing", "gap": 1.8},
                {"skill": "GIS", "gap": 1.5}
            ]
        },
        "quiz_performance": {
            "total_attempts": 5,
            "average_score": 72.5,
            "recent_attempts": [
                {"quiz_id": 1, "score": 80, "date": "2026-08-28"},
                {"quiz_id": 2, "score": 65, "date": "2026-08-27"}
            ]
        },
        "learning_progress": {
            "courses_enrolled": 3,
            "courses_completed": 1,
            "active_learning_path": {"total_courses": 5, "estimated_days": 30}
        }
    }

@app.get("/api/dashboard/admin")
async def admin_dashboard():
    return {
        "overview": {
            "total_users": 156,
            "average_competency": 3.1,
            "total_quiz_attempts": 423,
            "average_quiz_score": 68.5,
            "total_enrollments": 289,
            "courses_completed": 145
        },
        "category_performance": [
            {"category": "statistical", "average_level": 3.2},
            {"category": "technical", "average_level": 2.8},
            {"category": "digital_governance", "average_level": 2.5},
            {"category": "behavioural", "average_level": 3.5}
        ],
        "recent_users": [
            {"id": 1, "name": "Rajesh Kumar", "department": "NSSO", "joined": "2026-08-25"},
            {"id": 2, "name": "Priya Sharma", "department": "CSO", "joined": "2026-08-24"},
            {"id": 3, "name": "Amit Patel", "department": "MoSPI", "joined": "2026-08-23"}
        ]
    }

@app.get("/api/dashboard/analytics")
async def analytics():
    return {
        "predictive_insights": {
            "skills_in_demand": ["AI/ML", "Data Visualization", "Cloud Computing", "Python"],
            "recommended_focus_areas": ["Digital Governance", "Advanced Analytics", "Machine Learning"],
            "projected_growth": "15% improvement expected in next quarter"
        }
    }

@app.get("/api/igot/courses")
async def get_igot_courses(category: str = None):
    if category and category != "all":
        filtered = [c for c in IGOT_COURSES if c["category"] == category]
        return {"courses": filtered}
    return {"courses": IGOT_COURSES}

@app.get("/api/igot/recommended")
async def get_recommended():
    return {"recommendations": IGOT_COURSES[:3]}

@app.post("/api/igot/enroll/{course_id}")
async def enroll(course_id: str):
    return {"status": "enrolled", "course_id": course_id, "message": "Successfully enrolled"}

@app.get("/api/quiz/history")
async def quiz_history():
    return {"attempts": []}

@app.get("/api/competency/gaps")
async def get_gaps():
    return {"skill_gaps": [
        {"skill": "Machine Learning", "current_level": 1.0, "target_level": 3.5, "gap": 2.5, "priority": "high"},
        {"skill": "Cloud Computing", "current_level": 1.5, "target_level": 3.0, "gap": 1.5, "priority": "medium"}
    ]}

@app.get("/api/competency/report")
async def get_report():
    return {
        "user_id": 1,
        "competency_levels": {"Python": 3.5, "SQL": 4.0, "Machine Learning": 1.0},
        "skill_gaps": [{"skill": "Machine Learning", "gap": 2.5}],
        "category_summary": {"technical": {"average_level": 2.8}},
        "overall_score": 3.2
    }

@app.get("/api/igot/progress")
async def igot_progress():
    return {"courses_completed": 5, "total_learning_hours": 24}
