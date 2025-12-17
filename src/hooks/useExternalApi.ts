import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAllRoadmaps,
  getRoadmapById,
  getRoadmapSections,
  getRoadmapProgress,
  getAllQuizzes,
  getQuizById,
  getSectionById,
  getSectionResources,
  toggleSectionCompletion,
  submitQuizAnswers,
  restartQuiz,
  getUserProfile,
  updateUserProfile,
  login,
  signup,
  logout,
  ExternalRoadmap,
  ExternalSection,
  ExternalQuiz,
  ExternalResource,
  ExternalUser,
  RoadmapProgress,
} from '@/lib/externalApi';

// ==================== ROADMAPS ====================

export function useExternalRoadmaps() {
  return useQuery<ExternalRoadmap[]>({
    queryKey: ['external-roadmaps'],
    queryFn: getAllRoadmaps,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}

export function useExternalRoadmap(id: string | undefined) {
  return useQuery<ExternalRoadmap | null>({
    queryKey: ['external-roadmap', id],
    queryFn: () => (id ? getRoadmapById(id) : Promise.resolve(null)),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useRoadmapProgress(roadmapId: string | undefined) {
  return useQuery<RoadmapProgress | null>({
    queryKey: ['roadmap-progress', roadmapId],
    queryFn: () => (roadmapId ? getRoadmapProgress(roadmapId) : Promise.resolve(null)),
    enabled: !!roadmapId,
    staleTime: 2 * 60 * 1000,
  });
}

// ==================== SECTIONS ====================

export function useRoadmapSections(roadmapId: string | undefined) {
  return useQuery<ExternalSection[]>({
    queryKey: ['roadmap-sections', roadmapId],
    queryFn: () => (roadmapId ? getRoadmapSections(roadmapId) : Promise.resolve([])),
    enabled: !!roadmapId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useSection(sectionId: string | undefined) {
  return useQuery<ExternalSection | null>({
    queryKey: ['section', sectionId],
    queryFn: () => (sectionId ? getSectionById(sectionId) : Promise.resolve(null)),
    enabled: !!sectionId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useSectionResources(sectionId: string | undefined) {
  return useQuery<ExternalResource[]>({
    queryKey: ['section-resources', sectionId],
    queryFn: () => (sectionId ? getSectionResources(sectionId) : Promise.resolve([])),
    enabled: !!sectionId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useToggleSectionCompletion() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: toggleSectionCompletion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roadmap-progress'] });
      queryClient.invalidateQueries({ queryKey: ['roadmap-sections'] });
    },
  });
}

// ==================== QUIZZES ====================

export function useExternalQuizzes() {
  return useQuery<ExternalQuiz[]>({
    queryKey: ['external-quizzes'],
    queryFn: getAllQuizzes,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}

export function useExternalQuiz(id: string | undefined) {
  return useQuery<{ quiz: ExternalQuiz; totalQuestions: number } | null>({
    queryKey: ['external-quiz', id],
    queryFn: () => (id ? getQuizById(id) : Promise.resolve(null)),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useSubmitQuiz() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ quizId, answers }: { quizId: string; answers: { questionId: string; selectedOption: string }[] }) =>
      submitQuizAnswers(quizId, answers),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['external-quizzes'] });
    },
  });
}

export function useRestartQuiz() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: restartQuiz,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['external-quizzes'] });
    },
  });
}

// ==================== USER & AUTH ====================

export function useUserProfile() {
  return useQuery<ExternalUser | null>({
    queryKey: ['user-profile'],
    queryFn: getUserProfile,
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpdateUserProfile() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateUserProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
    },
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      login(email, password),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
    },
  });
}

export function useSignup() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ username, email, password }: { username: string; email: string; password: string }) =>
      signup(username, email, password),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.clear();
    },
  });
}
