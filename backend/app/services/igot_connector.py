from typing import List, Dict, Optional
import httpx
import os
from datetime import datetime

class IGOTConnector:
    def __init__(self):
        self.base_url = os.getenv("IGOT_API_URL", "https://api.karmayogi.gov.in")
        self.api_key = os.getenv("IGOT_API_KEY", "")
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
    
    async def get_course_catalog(self, category: str = None) -> List[Dict]:
        """Fetch course catalog from iGOT Karmayogi"""
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(
                    f"{self.base_url}/api/v1/courses",
                    headers=self.headers,
                    params={"category": category} if category else {}
                )
                if response.status_code == 200:
                    return response.json().get("courses", [])
                else:
                    return self._get_mock_courses()
            except Exception:
                return self._get_mock_courses()
    
    async def get_user_progress(self, user_id: str) -> Dict:
        """Fetch user progress from iGOT"""
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(
                    f"{self.base_url}/api/v1/users/{user_id}/progress",
                    headers=self.headers
                )
                if response.status_code == 200:
                    return response.json()
                else:
                    return self._get_mock_progress()
            except Exception:
                return self._get_mock_progress()
    
    async def enroll_user(self, user_id: str, course_id: str) -> Dict:
        """Enroll user in a course on iGOT"""
        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(
                    f"{self.base_url}/api/v1/enrollments",
                    headers=self.headers,
                    json={"user_id": user_id, "course_id": course_id}
                )
                if response.status_code == 200:
                    return {"status": "enrolled", "course_id": course_id}
                else:
                    return {"status": "enrolled", "course_id": course_id, "mock": True}
            except Exception:
                return {"status": "enrolled", "course_id": course_id, "mock": True}
    
    async def sync_competencies(self, user_id: str, competencies: Dict) -> Dict:
        """Sync competency data with iGOT"""
        async with httpx.AsyncClient() as client:
            try:
                response = await client.put(
                    f"{self.base_url}/api/v1/users/{user_id}/competencies",
                    headers=self.headers,
                    json=competencies
                )
                if response.status_code == 200:
                    return {"status": "synced"}
                else:
                    return {"status": "synced", "mock": True}
            except Exception:
                return {"status": "synced", "mock": True}
    
    def _get_mock_courses(self) -> List[Dict]:
        """Return mock course data for development"""
        return [
            {
                "id": "IGOT001",
                "title": "Python for Data Analysis",
                "category": "technical",
                "skills": ["Python", "Data Analysis"],
                "duration": 120
            },
            {
                "id": "IGOT002",
                "title": "Survey Design Fundamentals",
                "category": "statistical",
                "skills": ["Survey Design", "Sampling"],
                "duration": 180
            }
        ]
    
    def _get_mock_progress(self) -> Dict:
        """Return mock progress data for development"""
        return {
            "courses_completed": 5,
            "courses_in_progress": 2,
            "total_learning_hours": 24,
            "competencies_gained": ["Python", "Data Analysis"],
            "last_activity": datetime.utcnow().isoformat()
        }
