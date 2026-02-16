// External API Client for Roadmap Project API
const API_BASE = "https://roadmap-project-api-production.up.railway.app/api/v1";
const API_KEY = "e7b12f8bf9c4e92b13a45b0d7c9e1b342fc4d8ff6c2a9a1e3b6d91f7c8a12bcd";

// ==================== TYPES ====================

export interface ExternalRoadmap {
  _id: string;
  title: string;
  description: string;
  sections: string[] | { _id: string; title: string }[];
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

export interface ExternalUser {
  _id: string;
  username: string;
  email: string;
  role?: string;
  profileImage?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  token?: string;
  user?: ExternalUser;
}

export interface RoadmapProgress {
  _id: string;
  userId: string;
  roadmapId: string;
  completedSections: string[];
  progress: number;
}

// ==================== HELPER ====================

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE}${endpoint}${endpoint.includes('?') ? '&' : '?'}key=${API_KEY}`;
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options?.headers || {}),
  };
  
  // Add auth token if exists
  const token = localStorage.getItem('roadmap_auth_token');
  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(url, {
    ...options,
    headers,
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API error: ${response.status}`);
  }
  
  const data = await response.json();
  if (data.success === false) {
    throw new Error(data.message || 'API request failed');
  }
  return data;
}

// ==================== AUTH ====================

export async function login(email: string, password: string): Promise<AuthResponse> {
  const data = await fetchApi<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  
  if (data.token) {
    localStorage.setItem('roadmap_auth_token', data.token);
  }
  return data;
}

export async function signup(username: string, email: string, password: string): Promise<AuthResponse> {
  const data = await fetchApi<AuthResponse>('/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ username, email, password }),
  });
  
  if (data.token) {
    localStorage.setItem('roadmap_auth_token', data.token);
  }
  return data;
}

export async function logout(): Promise<void> {
  try {
    await fetchApi('/auth/logout', { method: 'POST' });
  } finally {
    localStorage.removeItem('roadmap_auth_token');
  }
}

// ==================== USER ====================

export async function getUserProfile(): Promise<ExternalUser | null> {
  try {
    const data = await fetchApi<{ success: boolean; user: ExternalUser }>('/users/profile');
    return data.user;
  } catch {
    return null;
  }
}

export async function updateUserProfile(updates: Partial<ExternalUser>): Promise<ExternalUser | null> {
  try {
    const data = await fetchApi<{ success: boolean; user: ExternalUser }>('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    return data.user;
  } catch {
    return null;
  }
}

export async function changePassword(currentPassword: string, newPassword: string): Promise<boolean> {
  try {
    await fetchApi('/users/change-password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    return true;
  } catch {
    return false;
  }
}

// ==================== ROADMAPS ====================

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

export async function getRoadmapProgress(roadmapId: string): Promise<RoadmapProgress | null> {
  try {
    const data = await fetchApi<{ success: boolean; progress: RoadmapProgress }>(`/roadmap/${roadmapId}/progress`);
    return data.progress;
  } catch {
    return null;
  }
}

// ==================== SECTIONS ====================

export async function getRoadmapSections(roadmapId: string): Promise<ExternalSection[]> {
  const data = await fetchApi<{ success: boolean; sections: ExternalSection[] }>(`/roadmap/${roadmapId}/sections`);
  return data.sections || [];
}

export async function getSectionById(sectionId: string): Promise<ExternalSection | null> {
  try {
    const data = await fetchApi<{ success: boolean; section: ExternalSection }>(`/sections/${sectionId}`);
    return data.section;
  } catch {
    return null;
  }
}

export async function toggleSectionCompletion(sectionId: string): Promise<boolean> {
  try {
    await fetchApi(`/sections/${sectionId}/toggle`, { method: 'PATCH' });
    return true;
  } catch {
    return false;
  }
}

// ==================== RESOURCES ====================

export async function getSectionResources(sectionId: string): Promise<ExternalResource[]> {
  const data = await fetchApi<{ success: boolean; resources: ExternalResource[] }>(`/sections/${sectionId}/resources`);
  return data.resources || [];
}

export async function getResourceById(resourceId: string): Promise<ExternalResource | null> {
  try {
    const data = await fetchApi<{ success: boolean; resource: ExternalResource }>(`/resources/${resourceId}`);
    return data.resource;
  } catch {
    return null;
  }
}

// ==================== QUIZZES ====================

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
  const data = await fetchApi<{ success: boolean; score: number; total: number; percentage: number; results: any[] }>(
    `/quiz/${quizId}/submit`,
    {
      method: 'POST',
      body: JSON.stringify({ answers }),
    }
  );
  return data;
}

export async function restartQuiz(quizId: string): Promise<boolean> {
  try {
    await fetchApi(`/quiz/${quizId}/restart`, { method: 'POST' });
    return true;
  } catch {
    return false;
  }
}

// ==================== QUESTIONS ====================

export async function getQuestionById(questionId: string): Promise<ExternalQuestion | null> {
  try {
    const data = await fetchApi<{ success: boolean; question: ExternalQuestion }>(`/questions/${questionId}`);
    return data.question;
  } catch {
    return null;
  }
}

// ==================== ADMIN: USERS ====================

export async function getAllUsers(): Promise<ExternalUser[]> {
  const data = await fetchApi<{ success: boolean; users: ExternalUser[] }>('/users');
  return data.users || [];
}

export async function getUserById(id: string): Promise<ExternalUser | null> {
  try {
    const data = await fetchApi<{ success: boolean; user: ExternalUser }>(`/users/${id}`);
    return data.user;
  } catch {
    return null;
  }
}

export async function toggleUserRole(userId: string): Promise<ExternalUser | null> {
  try {
    const data = await fetchApi<{ success: boolean; user: ExternalUser }>(`/users/${userId}/role`, {
      method: 'PATCH',
    });
    return data.user;
  } catch {
    return null;
  }
}

export async function deleteUser(): Promise<boolean> {
  try {
    await fetchApi('/users', { method: 'DELETE' });
    return true;
  } catch {
    return false;
  }
}

export async function uploadProfileImage(file: File): Promise<string | null> {
  try {
    const url = `${API_BASE}/users/upload-image?key=${API_KEY}`;
    const formData = new FormData();
    formData.append('image', file);
    const token = localStorage.getItem('roadmap_auth_token');
    const headers: HeadersInit = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const response = await fetch(url, { method: 'POST', headers, body: formData });
    const data = await response.json();
    return data.imageUrl || data.url || null;
  } catch {
    return null;
  }
}

// ==================== ADMIN: ROADMAPS CRUD ====================

export async function createRoadmap(roadmap: { title: string; description: string }): Promise<ExternalRoadmap | null> {
  try {
    const data = await fetchApi<{ success: boolean; roadmap: ExternalRoadmap }>('/roadmap', {
      method: 'POST',
      body: JSON.stringify(roadmap),
    });
    return data.roadmap;
  } catch {
    return null;
  }
}

export async function updateRoadmap(id: string, updates: Partial<ExternalRoadmap>): Promise<ExternalRoadmap | null> {
  try {
    const data = await fetchApi<{ success: boolean; roadmap: ExternalRoadmap }>(`/roadmap/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    return data.roadmap;
  } catch {
    return null;
  }
}

export async function deleteRoadmap(id: string): Promise<boolean> {
  try {
    await fetchApi(`/roadmap/${id}`, { method: 'DELETE' });
    return true;
  } catch {
    return false;
  }
}

// ==================== ADMIN: SECTIONS CRUD ====================

export async function createSection(roadmapId: string, section: { title: string; description: string; difficulty?: string }): Promise<ExternalSection | null> {
  try {
    const data = await fetchApi<{ success: boolean; section: ExternalSection }>(`/roadmap/${roadmapId}/sections`, {
      method: 'POST',
      body: JSON.stringify(section),
    });
    return data.section;
  } catch {
    return null;
  }
}

export async function updateSection(sectionId: string, updates: Partial<ExternalSection>): Promise<ExternalSection | null> {
  try {
    const data = await fetchApi<{ success: boolean; section: ExternalSection }>(`/sections/${sectionId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    return data.section;
  } catch {
    return null;
  }
}

export async function deleteSection(sectionId: string): Promise<boolean> {
  try {
    await fetchApi(`/sections/${sectionId}`, { method: 'DELETE' });
    return true;
  } catch {
    return false;
  }
}

// ==================== ADMIN: RESOURCES CRUD ====================

export async function createResource(sectionId: string, resource: { title: string; url: string; type: string }): Promise<ExternalResource | null> {
  try {
    const data = await fetchApi<{ success: boolean; resource: ExternalResource }>(`/sections/${sectionId}/resources`, {
      method: 'POST',
      body: JSON.stringify(resource),
    });
    return data.resource;
  } catch {
    return null;
  }
}

export async function updateResource(resourceId: string, updates: Partial<ExternalResource>): Promise<ExternalResource | null> {
  try {
    const data = await fetchApi<{ success: boolean; resource: ExternalResource }>(`/resources/${resourceId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    return data.resource;
  } catch {
    return null;
  }
}

export async function deleteResource(resourceId: string): Promise<boolean> {
  try {
    await fetchApi(`/resources/${resourceId}`, { method: 'DELETE' });
    return true;
  } catch {
    return false;
  }
}

// ==================== ADMIN: QUIZZES CRUD ====================

export async function createQuiz(quiz: { title: string; description: string }): Promise<ExternalQuiz | null> {
  try {
    const data = await fetchApi<{ success: boolean; quiz: ExternalQuiz }>('/quiz', {
      method: 'POST',
      body: JSON.stringify(quiz),
    });
    return data.quiz;
  } catch {
    return null;
  }
}

export async function updateQuiz(id: string, updates: Partial<ExternalQuiz>): Promise<ExternalQuiz | null> {
  try {
    const data = await fetchApi<{ success: boolean; quiz: ExternalQuiz }>(`/quiz/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    return data.quiz;
  } catch {
    return null;
  }
}

export async function deleteQuiz(id: string): Promise<boolean> {
  try {
    await fetchApi(`/quiz/${id}`, { method: 'DELETE' });
    return true;
  } catch {
    return false;
  }
}

// ==================== ADMIN: QUESTIONS CRUD ====================

export async function createQuestion(quizId: string, question: { question: string; answer: string; options: string[] }): Promise<ExternalQuestion | null> {
  try {
    const data = await fetchApi<{ success: boolean; question: ExternalQuestion }>(`/quiz/${quizId}/questions`, {
      method: 'POST',
      body: JSON.stringify(question),
    });
    return data.question;
  } catch {
    return null;
  }
}

export async function updateQuestion(questionId: string, updates: Partial<ExternalQuestion>): Promise<ExternalQuestion | null> {
  try {
    const data = await fetchApi<{ success: boolean; question: ExternalQuestion }>(`/questions/${questionId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    return data.question;
  } catch {
    return null;
  }
}

export async function deleteQuestion(questionId: string): Promise<boolean> {
  try {
    await fetchApi(`/questions/${questionId}`, { method: 'DELETE' });
    return true;
  } catch {
    return false;
  }
}

// ==================== AUTH STATE ====================

export function isAuthenticated(): boolean {
  return !!localStorage.getItem('roadmap_auth_token');
}

export function getAuthToken(): string | null {
  return localStorage.getItem('roadmap_auth_token');
}
