import { useQuery } from '@tanstack/react-query';
import {
  getAllRoadmaps,
  getRoadmapById,
  getRoadmapSections,
  getAllQuizzes,
  getQuizById,
  ExternalRoadmap,
  ExternalSection,
  ExternalQuiz,
} from '@/lib/externalApi';

// Roadmaps
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

export function useRoadmapSections(roadmapId: string | undefined) {
  return useQuery<ExternalSection[]>({
    queryKey: ['roadmap-sections', roadmapId],
    queryFn: () => (roadmapId ? getRoadmapSections(roadmapId) : Promise.resolve([])),
    enabled: !!roadmapId,
    staleTime: 5 * 60 * 1000,
  });
}

// Quizzes
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
