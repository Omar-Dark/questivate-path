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
  getAllUsers,
  toggleUserRole,
  createRoadmap,
  updateRoadmap,
  deleteRoadmap,
  createSection,
  updateSection,
  deleteSection,
  createResource,
  updateResource,
  deleteResource,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  ExternalRoadmap,
  ExternalSection,
  ExternalQuiz,
  ExternalQuestion,
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

// ==================== ADMIN ====================

export function useAllUsers() {
  return useQuery<ExternalUser[]>({
    queryKey: ['all-users'],
    queryFn: getAllUsers,
    staleTime: 2 * 60 * 1000,
  });
}

export function useToggleUserRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: toggleUserRole,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['all-users'] }); },
  });
}

export function useCreateRoadmap() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { title: string; description: string }) => createRoadmap(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['external-roadmaps'] }); },
  });
}

export function useUpdateRoadmap() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<ExternalRoadmap> }) => updateRoadmap(id, updates),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['external-roadmaps'] }); },
  });
}

export function useDeleteRoadmap() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteRoadmap,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['external-roadmaps'] }); },
  });
}

export function useCreateSection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ roadmapId, data }: { roadmapId: string; data: { title: string; description: string; difficulty?: string } }) =>
      createSection(roadmapId, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['roadmap-sections'] }); },
  });
}

export function useUpdateSection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ sectionId, updates }: { sectionId: string; updates: Partial<ExternalSection> }) =>
      updateSection(sectionId, updates),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['roadmap-sections'] }); },
  });
}

export function useDeleteSection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteSection,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['roadmap-sections'] }); },
  });
}

export function useCreateResource() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ sectionId, data }: { sectionId: string; data: { title: string; url: string; type: string } }) =>
      createResource(sectionId, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['section-resources'] }); },
  });
}

export function useUpdateResource() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ resourceId, updates }: { resourceId: string; updates: Partial<ExternalResource> }) =>
      updateResource(resourceId, updates),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['section-resources'] }); },
  });
}

export function useDeleteResource() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteResource,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['section-resources'] }); },
  });
}

export function useCreateQuiz() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { title: string; description: string }) => createQuiz(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['external-quizzes'] }); },
  });
}

export function useUpdateQuiz() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<ExternalQuiz> }) => updateQuiz(id, updates),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['external-quizzes'] }); },
  });
}

export function useDeleteQuiz() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteQuiz,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['external-quizzes'] }); },
  });
}

export function useCreateQuestion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ quizId, data }: { quizId: string; data: { question: string; answer: string; options: string[] } }) =>
      createQuestion(quizId, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['external-quiz'] }); },
  });
}

export function useUpdateQuestion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ questionId, updates }: { questionId: string; updates: Partial<ExternalQuestion> }) =>
      updateQuestion(questionId, updates),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['external-quiz'] }); },
  });
}

export function useDeleteQuestion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteQuestion,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['external-quiz'] }); },
  });
}
