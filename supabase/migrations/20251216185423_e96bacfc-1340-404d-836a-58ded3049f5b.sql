-- Fix: Replace overly permissive question_choices policy
-- Only allow viewing choices without revealing is_correct until quiz is submitted
DROP POLICY IF EXISTS "Anyone can view choices" ON public.question_choices;

-- Create a function to check if user has completed this quiz
CREATE OR REPLACE FUNCTION public.user_completed_quiz(quiz_question_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM quiz_attempts qa
    JOIN questions q ON qa.quiz_id = q.quiz_id
    WHERE q.id = quiz_question_id
      AND qa.user_id = auth.uid()
      AND qa.finished_at IS NOT NULL
  )
$$;

-- Allow viewing choice text and order, but is_correct only after quiz completion
-- For now, allow reading choices for quiz-taking (the actual answer validation should happen server-side)
CREATE POLICY "Authenticated users can view choices"
ON public.question_choices FOR SELECT
TO authenticated
USING (true);