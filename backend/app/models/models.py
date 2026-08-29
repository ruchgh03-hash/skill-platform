from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, JSON, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

from .database import Base

class UserRole(str, enum.Enum):
    LEARNER = "learner"
    ADMIN = "admin"
    SPOC = "spoc"

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    full_name = Column(String)
    role = Column(String, default=UserRole.LEARNER)
    designation = Column(String)
    department = Column(String)
    job_role = Column(String)
    years_of_experience = Column(Integer)
    educational_qualifications = Column(String)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    profile = relationship("UserProfile", back_populates="user", uselist=False)
    competencies = relationship("UserCompetency", back_populates="user")
    enrollments = relationship("CourseEnrollment", back_populates="user")
    quiz_attempts = relationship("QuizAttempt", back_populates="user")

class UserProfile(Base):
    __tablename__ = "user_profiles"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    technical_skills = Column(JSON, default=list)
    soft_skills = Column(JSON, default=list)
    certifications = Column(JSON, default=list)
    learning_style = Column(String)
    preferred_language = Column(String, default="en")
    career_interests = Column(JSON, default=list)
    
    user = relationship("User", back_populates="profile")

class CompetencyFramework(Base):
    __tablename__ = "competency_frameworks"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    category = Column(String)  # Statistical, Technical, Digital Governance, Behavioural
    skills = Column(JSON)  # List of skills in this framework
    level_requirements = Column(JSON)  # Required levels per job role

class UserCompetency(Base):
    __tablename__ = "user_competencies"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    skill_name = Column(String)
    category = Column(String)
    current_level = Column(Float, default=0.0)  # 0-5 scale
    target_level = Column(Float, default=3.0)
    last_assessed = Column(DateTime)
    
    user = relationship("User", back_populates="competencies")

class Course(Base):
    __tablename__ = "courses"
    
    id = Column(Integer, primary_key=True, index=True)
    igot_course_id = Column(String, unique=True)
    title = Column(String)
    description = Column(String)
    category = Column(String)
    skills_covered = Column(JSON)
    difficulty_level = Column(String)
    duration_minutes = Column(Integer)
    url = Column(String)
    language = Column(String, default="en")
    
    enrollments = relationship("CourseEnrollment", back_populates="course")

class CourseEnrollment(Base):
    __tablename__ = "course_enrollments"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    course_id = Column(Integer, ForeignKey("courses.id"))
    status = Column(String, default="enrolled")  # enrolled, in_progress, completed
    progress = Column(Float, default=0.0)
    enrolled_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    
    user = relationship("User", back_populates="enrollments")
    course = relationship("Course", back_populates="enrollments")

class Quiz(Base):
    __tablename__ = "quizzes"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    description = Column(String)
    source_document = Column(String)
    questions = Column(JSON)  # List of questions
    difficulty = Column(String)
    category = Column(String)
    created_by = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    
    attempts = relationship("QuizAttempt", back_populates="quiz")

class QuizAttempt(Base):
    __tablename__ = "quiz_attempts"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    quiz_id = Column(Integer, ForeignKey("quizzes.id"))
    answers = Column(JSON)
    score = Column(Float)
    time_taken_seconds = Column(Integer)
    completed_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="quiz_attempts")
    quiz = relationship("Quiz", back_populates="attempts")

class LearningPath(Base):
    __tablename__ = "learning_paths"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    skill_gaps = Column(JSON)
    recommended_courses = Column(JSON)
    priority_order = Column(JSON)
    estimated_completion_days = Column(Integer)
    created_at = Column(DateTime, default=datetime.utcnow)
    is_active = Column(Boolean, default=True)
