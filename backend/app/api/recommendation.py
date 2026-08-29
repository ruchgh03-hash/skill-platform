from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional, Dict

from ..models.database import get_db
from ..models.models import User, UserCompetency, LearningPath
from ..services.recommendation_engine import RecommendationEngine
from ..api.auth import get_current_user

router = APIRouter()
rec_engine = RecommendationEngine()

class RecommendationRequest(BaseModel):
    skill_gaps: Optional[List[Dict]] = None
    num_recommendations: int = 5

class LearningPathResponse(BaseModel):
    skill_gaps: List[Dict]
    recommended_courses: List[Dict]
    total_courses: int
    estimated_duration_hours: int
    estimated_completion_days: int
    learning_milestones: List[Dict]

@router.post("/courses")
async def get_course_recommendations(
    request: RecommendationRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if request.skill_gaps is None:
        competencies = db.query(UserCompetency).filter(
            UserCompetency.user_id == current_user.id
        ).all()
        
        from ..services.skill_gap_analyzer import SkillGapAnalyzer
        analyzer = SkillGapAnalyzer()
        current_levels = {c.skill_name: c.current_level for c in competencies}
        request.skill_gaps = analyzer.identify_gaps(current_levels)
    
    recommendations = rec_engine.recommend_courses(
        skill_gaps=request.skill_gaps,
        num_recommendations=request.num_recommendations
    )
    
    return {"recommendations": recommendations}

@router.post("/learning-path", response_model=LearningPathResponse)
async def generate_learning_path(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    competencies = db.query(UserCompetency).filter(
        UserCompetency.user_id == current_user.id
    ).all()
    
    from ..services.skill_gap_analyzer import SkillGapAnalyzer
    analyzer = SkillGapAnalyzer()
    current_levels = {c.skill_name: c.current_level for c in competencies}
    skill_gaps = analyzer.identify_gaps(current_levels)
    
    learning_path = rec_engine.generate_learning_path(skill_gaps)
    
    db_path = LearningPath(
        user_id=current_user.id,
        skill_gaps=learning_path["skill_gaps"],
        recommended_courses=learning_path["recommended_courses"],
        priority_order=[c["id"] for c in learning_path["recommended_courses"]],
        estimated_completion_days=learning_path["estimated_completion_days"]
    )
    db.add(db_path)
    db.commit()
    
    return learning_path

@router.get("/by-skill/{skill_name}")
async def recommend_by_skill(
    skill_name: str,
    current_level: float = 0,
    num_recommendations: int = 3,
    current_user: User = Depends(get_current_user)
):
    recommendations = rec_engine.recommend_by_skill(
        skill_name=skill_name,
        current_level=current_level,
        num_recommendations=num_recommendations
    )
    
    return {"skill": skill_name, "recommendations": recommendations}

@router.get("/active-path")
async def get_active_learning_path(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    path = db.query(LearningPath).filter(
        LearningPath.user_id == current_user.id,
        LearningPath.is_active == True
    ).order_by(LearningPath.created_at.desc()).first()
    
    if not path:
        return {"message": "No active learning path", "path": None}
    
    return {
        "id": path.id,
        "skill_gaps": path.skill_gaps,
        "recommended_courses": path.recommended_courses,
        "estimated_completion_days": path.estimated_completion_days,
        "created_at": path.created_at
    }
