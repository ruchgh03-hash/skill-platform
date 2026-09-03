from typing import List, Dict, Optional
import random
import re
from ..services.ml_loader import MLModels


QUESTION_TEMPLATES = {
    "definition": [
        "What is the definition of {concept}?",
        "Which of the following best defines {concept}?",
        "{concept} refers to:",
    ],
    "application": [
        "In which scenario would {concept} be applied?",
        "{concept} is most useful when:",
        "How is {concept} used in practice?",
    ],
    "comparison": [
        "How does {concept} differ from related approaches?",
        "Which statement correctly compares {concept}?",
        "What distinguishes {concept} from alternatives?",
    ],
    "advantage": [
        "What is a key advantage of {concept}?",
        "Which benefit does {concept} provide?",
        "Why is {concept} important?",
    ],
    "process": [
        "What are the steps involved in {concept}?",
        "Which is the correct order for {concept}?",
        "How does {concept} work?",
    ],
}

DOMAIN_DISTRACTORS = {
    "statistical": [
        "Simple random sampling",
        "Systematic error",
        "Population parameter",
        "Confidence interval",
        "Standard deviation",
        "Regression analysis",
        "Hypothesis testing",
        "Data validation",
    ],
    "technical": [
        "Object-oriented programming",
        "Database normalization",
        "API endpoint",
        "Version control",
        "Cloud deployment",
        "Data pipeline",
        "Machine learning model",
        "Query optimization",
    ],
    "digital_governance": [
        "Data encryption",
        "Access control",
        "Audit logging",
        "Compliance framework",
        "Risk assessment",
        "Incident response",
        "Security protocol",
        "Digital certification",
    ],
    "behavioural": [
        "Active listening",
        "Stakeholder engagement",
        "Conflict resolution",
        "Strategic planning",
        "Team collaboration",
        "Performance review",
        "Change management",
        "Decision framework",
    ],
}


class MCQGenerator:
    def __init__(self):
        self.ml = MLModels()
    
    def generate_mcqs_from_text(self, text: str, num_questions: int = 5, 
                                 difficulty: str = "medium") -> List[Dict]:
        sentences = self._split_into_sentences(text)
        key_concepts = self._extract_key_concepts(text)
        sections = self._extract_sections(text)
        
        if not sentences:
            sentences = [text[i:i+200] for i in range(0, len(text), 200) if text[i:i+200].strip()]
        
        mcqs = []
        
        for i in range(min(num_questions, len(sentences) + len(key_concepts))):
            if i < len(sentences):
                source_text = sentences[i]
                concept = key_concepts[i % len(key_concepts)] if key_concepts else self._extract_main_noun(source_text)
            else:
                concept = key_concepts[i - len(sentences)] if key_concepts else "this concept"
                source_text = text[:500]
            
            question_type = random.choice(list(QUESTION_TEMPLATES.keys()))
            template = random.choice(QUESTION_TEMPLATES[question_type])
            question = template.format(concept=concept)
            
            correct_answer = self._extract_answer_from_context(source_text, concept)
            
            distractors = self._generate_distractors(correct_answer, key_concepts, difficulty)
            
            options = [correct_answer] + distractors
            random.shuffle(options)
            
            correct_index = options.index(correct_answer)
            
            explanation = self._generate_explanation(source_text, concept, question_type)
            
            mcqs.append({
                "id": len(mcqs) + 1,
                "question": question,
                "options": options,
                "correct_answer": chr(65 + correct_index),
                "explanation": explanation,
                "difficulty": difficulty,
                "concept": concept,
                "question_type": question_type,
                "source_text": source_text[:300]
            })
        
        return mcqs[:num_questions]
    
    def generate_mcqs_from_concept(self, concept: str, context: str = "",
                                    num_questions: int = 3) -> List[Dict]:
        mcqs = []
        question_types = list(QUESTION_TEMPLATES.keys())
        
        for i in range(num_questions):
            q_type = question_types[i % len(question_types)]
            template = random.choice(QUESTION_TEMPLATES[q_type])
            question = template.format(concept=concept)
            
            if context:
                correct_answer = self._extract_answer_from_context(context[:500], concept)
            else:
                correct_answer = f"A systematic approach to {concept}"
            
            distractors = [
                f"An unrelated approach to {concept}",
                f"The opposite of {concept}",
                f"A random process without structure",
            ]
            
            options = [correct_answer] + distractors
            random.shuffle(options)
            
            correct_index = options.index(correct_answer)
            
            explanations = {
                "definition": f"{concept} is a fundamental concept that involves systematic processes and methodologies.",
                "application": f"{concept} is applied in practical scenarios to achieve specific outcomes.",
                "comparison": f"{concept} has unique characteristics that distinguish it from other approaches.",
                "advantage": f"{concept} provides significant benefits including improved efficiency and accuracy.",
                "process": f"{concept} follows a structured process with clearly defined steps.",
            }
            
            mcqs.append({
                "id": i + 1,
                "question": question,
                "options": options,
                "correct_answer": chr(65 + correct_index),
                "explanation": explanations.get(q_type, f"{concept} is an important concept in this domain."),
                "difficulty": "medium",
                "concept": concept,
                "question_type": q_type
            })
        
        return mcqs
    
    def generate_quiz(self, documents: List[str], title: str = "Generated Quiz",
                      num_questions: int = 10, difficulty: str = "medium") -> Dict:
        all_mcqs = []
        for doc in documents:
            mcqs = self.generate_mcqs_from_text(doc, num_questions=min(5, num_questions), difficulty=difficulty)
            all_mcqs.extend(mcqs)
        
        if len(all_mcqs) > num_questions:
            selected_mcqs = random.sample(all_mcqs, num_questions)
        else:
            selected_mcqs = all_mcqs
        
        for i, mcq in enumerate(selected_mcqs):
            mcq["id"] = i + 1
        
        return {
            "title": title,
            "questions": selected_mcqs,
            "total_questions": len(selected_mcqs),
            "difficulty": difficulty,
            "time_limit_minutes": len(selected_mcqs) * 2,
            "question_types": list(set(q.get("question_type", "general") for q in selected_mcqs))
        }
    
    def _split_into_sentences(self, text: str) -> List[str]:
        doc = self.ml.nlp(text)
        sentences = [sent.text.strip() for sent in doc.sents if len(sent.text.strip()) > 30]
        return sentences
    
    def _extract_key_concepts(self, text: str) -> List[str]:
        doc = self.ml.nlp(text)
        
        concepts = []
        for chunk in doc.noun_chunks:
            if len(chunk.text.split()) >= 2 and len(chunk.text) > 5:
                concepts.append(chunk.text)
        
        for ent in doc.ents:
            if ent.label_ in ["ORG", "PRODUCT", "EVENT", "WORK_OF_ART"]:
                concepts.append(ent.text)
        
        unique_concepts = list(set(concepts))
        
        statistical_terms = [
            "survey", "sampling", "census", "statistic", "data", "analysis",
            "population", "sample", "variance", "mean", "median", "distribution",
            "probability", "regression", "correlation", "hypothesis", "test",
            "confidence", "interval", "estimation", "measurement", "quality",
            "validation", "collection", "processing", "visualization", "model",
            "machine learning", "artificial intelligence", "algorithm", "database",
            "python", "r programming", "sql", "tableau", "excel", "gis",
            "price", "inflation", "gdp", "national accounts", "labour",
            "employment", "agriculture", "industry", "trade", "sdg"
        ]
        
        text_lower = text.lower()
        for term in statistical_terms:
            if term in text_lower and term.title() not in unique_concepts:
                unique_concepts.append(term.title())
        
        return unique_concepts[:15]
    
    def _extract_sections(self, text: str) -> List[Dict]:
        sections = []
        lines = text.split('\n')
        current_section = {"title": "Introduction", "content": ""}
        
        for line in lines:
            line = line.strip()
            if not line:
                continue
            
            if line.isupper() or (len(line) < 100 and line.endswith(':')):
                if current_section["content"]:
                    sections.append(current_section)
                current_section = {"title": line, "content": ""}
            else:
                current_section["content"] += line + " "
        
        if current_section["content"]:
            sections.append(current_section)
        
        return sections if sections else [{"title": "Content", "content": text}]
    
    def _extract_main_noun(self, sentence: str) -> str:
        doc = self.ml.nlp(sentence)
        for chunk in doc.noun_chunks:
            if len(chunk.text.split()) >= 1:
                return chunk.text
        words = sentence.split()
        return " ".join(words[:3]) if len(words) >= 3 else "this concept"
    
    def _generate_explanation(self, source_text: str, concept: str, question_type: str) -> str:
        explanation_templates = {
            "definition": f"Based on the source material, {concept} is defined within the context of: {source_text[:150]}...",
            "application": f"The application of {concept} can be understood from: {source_text[:150]}...",
            "comparison": f"When comparing approaches, {concept} is distinguished by: {source_text[:150]}...",
            "advantage": f"The advantage of {concept} relates to: {source_text[:150]}...",
            "process": f"The process involving {concept} includes: {source_text[:150]}...",
        }
        return explanation_templates.get(question_type, f"This relates to {concept} as described in the material.")
    
    def _generate_distractors(self, correct_answer: str, 
                               all_concepts: List[str], 
                               difficulty: str = "medium",
                               num_distractors: int = 3) -> List[str]:
        distractors = []
        
        related_concepts = [c for c in all_concepts if c.lower() != correct_answer.lower()]
        random.shuffle(related_concepts)
        
        for concept in related_concepts[:num_distractors]:
            distractors.append(concept)
        
        if difficulty == "easy":
            generic_distractors = [
                "None of the above",
                "All of the above",
                "Not applicable",
            ]
        elif difficulty == "hard":
            generic_distractors = [
                "A related but distinct concept",
                "An alternative methodology",
                "A contrasting approach",
            ]
        else:
            generic_distractors = [
                "None of the above",
                "Cannot be determined from the given information",
                "An unrelated concept",
            ]
        
        while len(distractors) < num_distractors:
            distractor = random.choice(generic_distractors)
            if distractor not in distractors:
                distractors.append(distractor)
        
        return distractors[:num_distractors]
    
    def evaluate_quiz(self, quiz: Dict, user_answers: Dict) -> Dict:
        questions = quiz["questions"]
        correct_count = 0
        results = []
        category_scores = {}
        
        for q in questions:
            q_id = str(q["id"])
            user_answer = user_answers.get(q_id)
            is_correct = user_answer == q["correct_answer"]
            
            if is_correct:
                correct_count += 1
            
            concept = q.get("concept", "General")
            if concept not in category_scores:
                category_scores[concept] = {"correct": 0, "total": 0}
            category_scores[concept]["total"] += 1
            if is_correct:
                category_scores[concept]["correct"] += 1
            
            results.append({
                "question_id": q_id,
                "question": q["question"],
                "user_answer": user_answer,
                "correct_answer": q["correct_answer"],
                "is_correct": is_correct,
                "explanation": q.get("explanation", ""),
                "concept": concept,
                "question_type": q.get("question_type", "general")
            })
        
        total = len(questions)
        score = (correct_count / total * 100) if total > 0 else 0
        
        concept_analysis = {}
        for concept, data in category_scores.items():
            concept_analysis[concept] = {
                "score": round((data["correct"] / data["total"] * 100) if data["total"] > 0 else 0, 2),
                "correct": data["correct"],
                "total": data["total"]
            }
        
        return {
            "score": round(score, 2),
            "correct_count": correct_count,
            "total_questions": total,
            "results": results,
            "grade": self._calculate_grade(score),
            "concept_analysis": concept_analysis,
            "strengths": [c for c, d in concept_analysis.items() if d["score"] >= 80],
            "weaknesses": [c for c, d in concept_analysis.items() if d["score"] < 60]
        }
    
    def _calculate_grade(self, score: float) -> str:
        if score >= 90:
            return "A+"
        elif score >= 80:
            return "A"
        elif score >= 70:
            return "B"
        elif score >= 60:
            return "C"
        elif score >= 50:
            return "D"
        else:
            return "F"
