// External API Client for Roadmap Project API
const API_BASE = "https://roadmap-project-api-production.up.railway.app/api/v1";
const API_KEY = "e7b12f8bf9c4e92b13a45b0d7c9e1b342fc4d8ff6c2a9a1e3b6d91f7c8a12bcd";

// Types
export interface ExternalRoadmap {
  _id: string;
  title: string;
  description: string;
  sections: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ExternalSection {
  _id: string;
  title: string;
  description: string;
  roadmapId: string;
  resources: ExternalResource[];
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  createdAt: string;
  updatedAt: string;
}

export interface ExternalResource {
  _id: string;
  url: string;
  type: "article" | "video";
  title: string;
  sectionId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExternalQuestion {
  _id: string;
  question: string;
  answer: string;
  options: string[];
  quizId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExternalQuiz {
  _id: string;
  title: string;
  description: string;
  questions?: ExternalQuestion[];
  rank?: string;
  createdAt?: string;
  updatedAt?: string;
}

// API Functions
async function fetchApi<T>(endpoint: string): Promise<T> {
  const url = `${API_BASE}${endpoint}${endpoint.includes('?') ? '&' : '?'}key=${API_KEY}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  const data = await response.json();
  if (!data.success) {
    throw new Error(data.message || 'API request failed');
  }
  return data;
}

// Roadmaps
export async function getAllRoadmaps(): Promise<ExternalRoadmap[]> {
  const data = await fetchApi<{ success: boolean; roadmap: ExternalRoadmap[] }>('/roadmap');
  return data.roadmap || [];
}

export async function getRoadmapById(id: string): Promise<ExternalRoadmap | null> {
  try {
    const data = await fetchApi<{ success: boolean; roadmap: ExternalRoadmap }>(`/roadmap/${id}`);
    return data.roadmap;
  } catch {
    return null;
  }
}

export async function getRoadmapSections(roadmapId: string): Promise<ExternalSection[]> {
  const data = await fetchApi<{ success: boolean; sections: ExternalSection[] }>(`/roadmap/${roadmapId}/sections`);
  return data.sections || [];
}

// Quizzes
export async function getAllQuizzes(): Promise<ExternalQuiz[]> {
  const data = await fetchApi<{ success: boolean; quizData: ExternalQuiz[] }>('/quiz');
  return data.quizData || [];
}

export async function getQuizById(id: string): Promise<{ quiz: ExternalQuiz; totalQuestions: number } | null> {
  try {
    const data = await fetchApi<{ success: boolean; quiz: ExternalQuiz; totalQuestions: number }>(`/quiz/${id}`);
    return { quiz: data.quiz, totalQuestions: data.totalQuestions };
  } catch {
    return null;
  }
}

export async function submitQuizAnswers(
  quizId: string, 
  answers: { questionId: string; selectedOption: string }[]
): Promise<{ score: number; total: number; percentage: number; results: any[] }> {
  const url = `${API_BASE}/quiz/${quizId}/submit?key=${API_KEY}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ answers }),
  });
  
  if (!response.ok) {
    // If the API doesn't have a submit endpoint, calculate locally
    throw new Error('Submit not available');
  }
  
  const data = await response.json();
  return data;
}

// Sections
export async function getSectionById(sectionId: string): Promise<ExternalSection | null> {
  try {
    const data = await fetchApi<{ success: boolean; section: ExternalSection }>(`/sections/${sectionId}`);
    return data.section;
  } catch {
    return null;
  }
}

export async function getSectionResources(sectionId: string): Promise<ExternalResource[]> {
  const data = await fetchApi<{ success: boolean; resources: ExternalResource[] }>(`/sections/${sectionId}/resources`);
  return data.resources || [];
}

// Resources
export async function getResourceById(resourceId: string): Promise<ExternalResource | null> {
  try {
    const data = await fetchApi<{ success: boolean; resource: ExternalResource }>(`/resources/${resourceId}`);
    return data.resource;
  } catch {
    return null;
  }
}
