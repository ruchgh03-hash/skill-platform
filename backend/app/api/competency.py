from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional, Dict
from datetime import datetime

from ..models.database import get_db
from ..models.models import User, UserCompetency, UserProfile
from ..services.skill_gap_analyzer import SkillGapAnalyzer
from ..api.auth import get_current_user

router = APIRouter()
skill_analyzer = SkillGapAnalyzer()

class SkillInput(BaseModel):
    skills: List[str]
    experience: int

class CompetencyResponse(BaseModel):
    skill: str
    current_level: float
    target_level: float
    gap: float
    priority: str

class CompetencyReport(BaseModel):
    user_id: int
    competency_levels: Dict[str, float]
    skill_gaps: List[CompetencyResponse]
    category_summary: Dict
    overall_score: float
    recommendations: List[str]

@router.post("/assess", response_model=CompetencyReport)
async def assess_competencies(
    skill_input: SkillInput,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    report = skill_analyzer.generate_competency_report(
        user_id=current_user.id,
        user_skills=skill_input.skills,
        experience=skill_input.experience
    )
    
    profile = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()
    if profile:
        profile.technical_skills = [s for s in skill_input.skills if s.lower() in 
            ['python', 'r', 'sql', 'stata', 'spss', 'sas', 'gis', 'data visualization', 'ai/ml', 'cloud computing']]
        profile.soft_skills = [s for s in skill_input.skills if s.lower() in 
            ['leadership', 'communication', 'project management', 'ethics', 'decision making']]
    
    for skill, level in report["competency_levels"].items():
        existing = db.query(UserCompetency).filter(
            UserCompetency.user_id == current_user.id,
            UserCompetency.skill_name == skill
        ).first()
        
        if existing:
            existing.current_level = level
            existing.last_assessed = datetime.utcnow()
        else:
            competency = UserCompetency(
                user_id=current_user.id,
                skill_name=skill,
                category="general",
                current_level=level,
                target_level=3.0,
                last_assessed=datetime.utcnow()
            )
            db.add(competency)
    
    db.commit()
    
    return report

@router.get("/gaps")
async def get_skill_gaps(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    competencies = db.query(UserCompetency).filter(
        UserCompetency.user_id == current_user.id
    ).all()
    
    current_levels = {c.skill_name: c.current_level for c in competencies}
    gaps = skill_analyzer.identify_gaps(current_levels)
    
    return {"skill_gaps": gaps}

@router.get("/framework")
async def get_competency_framework():
    from ..services.skill_gap_analyzer import COMPETENCY_FRAMEWORK
    return COMPETENCY_FRAMEWORK

@router.get("/report")
async def get_competency_report(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    competencies = db.query(UserCompetency).filter(
        UserCompetency.user_id == current_user.id
    ).all()
    
    current_levels = {c.skill_name: c.current_level for c in competencies}
    gaps = skill_analyzer.identify_gaps(current_levels)
    
    category_summary = {}
    from ..services.skill_gap_analyzer import COMPETENCY_FRAMEWORK
    for category, data in COMPETENCY_FRAMEWORK.items():
        cat_skills = data["skills"]
        cat_levels = [current_levels.get(s, 0) for s in cat_skills]
        category_summary[category] = {
            "average_level": sum(cat_levels) / len(cat_levels) if cat_levels else 0,
            "skills_assessed": len([l for l in cat_levels if l > 0]),
            "total_skills": len(cat_skills)
        }
    
    return {
        "user_id": current_user.id,
        "competency_levels": current_levels,
        "skill_gaps": gaps,
        "category_summary": category_summary,
        "overall_score": sum(current_levels.values()) / len(current_levels) if current_levels else 0
    }
