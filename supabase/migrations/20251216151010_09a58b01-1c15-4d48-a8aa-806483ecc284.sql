-- Add section_id to quizzes table for section-level quizzes
ALTER TABLE public.quizzes 
ADD COLUMN section_id UUID REFERENCES public.sections(id) ON DELETE CASCADE;

-- Create index for faster lookups
CREATE INDEX idx_quizzes_section_id ON public.quizzes(section_id);

-- Insert sample questions for Database Architecture quiz (we'll add questions for all quizzes)
-- First, let's get a quiz ID and add questions

-- Insert sample MCQ questions for React Mastery quiz
INSERT INTO public.questions (quiz_id, prompt, difficulty, order_index, points, hint, explanation) VALUES
('68f2748e-496e-4e7c-baa9-997add65bfb6', 'What hook is used for managing component state in React?', 'easy', 1, 10, 'Think about the most basic state management', 'useState is the fundamental hook for managing local state in functional components'),
('68f2748e-496e-4e7c-baa9-997add65bfb6', 'Which hook is used for side effects in React?', 'easy', 2, 10, 'Think about data fetching and subscriptions', 'useEffect handles side effects like data fetching, subscriptions, and DOM manipulation'),
('68f2748e-496e-4e7c-baa9-997add65bfb6', 'What is the correct way to update state based on previous state?', 'medium', 3, 15, 'Think about functional updates', 'Using a callback function ensures you always have the latest state value'),
('68f2748e-496e-4e7c-baa9-997add65bfb6', 'What is JSX?', 'easy', 4, 10, 'It looks like HTML but is not', 'JSX is a syntax extension that allows writing HTML-like code in JavaScript'),
('68f2748e-496e-4e7c-baa9-997add65bfb6', 'What does useContext provide?', 'medium', 5, 15, 'Think about prop drilling', 'useContext allows consuming context values without wrapping in Consumer'),
('68f2748e-496e-4e7c-baa9-997add65bfb6', 'What is the virtual DOM?', 'medium', 6, 15, 'Its a copy of something', 'Virtual DOM is a lightweight copy of the actual DOM for efficient updates'),
('68f2748e-496e-4e7c-baa9-997add65bfb6', 'What is React.memo used for?', 'medium', 7, 15, 'Think about performance', 'React.memo prevents unnecessary re-renders by memoizing component output'),
('68f2748e-496e-4e7c-baa9-997add65bfb6', 'What is the purpose of keys in React lists?', 'easy', 8, 10, 'Think about identity', 'Keys help React identify which items have changed, been added, or removed'),
('68f2748e-496e-4e7c-baa9-997add65bfb6', 'What is a controlled component?', 'medium', 9, 15, 'Think about form elements', 'A controlled component has its state controlled by React via props'),
('68f2748e-496e-4e7c-baa9-997add65bfb6', 'What is useReducer best suited for?', 'hard', 10, 20, 'Complex state logic', 'useReducer is ideal for complex state logic with multiple sub-values'),
('68f2748e-496e-4e7c-baa9-997add65bfb6', 'What is the difference between useMemo and useCallback?', 'hard', 11, 20, 'One memoizes values, one memoizes functions', 'useMemo memoizes computed values, useCallback memoizes function references'),
('68f2748e-496e-4e7c-baa9-997add65bfb6', 'What is React Suspense used for?', 'hard', 12, 20, 'Loading states', 'Suspense lets you specify loading UI while components are waiting for data'),
('68f2748e-496e-4e7c-baa9-997add65bfb6', 'How do you prevent useEffect from running on initial render?', 'hard', 13, 20, 'Use a ref', 'Use useRef to track if its the first render and skip effect logic'),
('68f2748e-496e-4e7c-baa9-997add65bfb6', 'What is the purpose of React.StrictMode?', 'medium', 14, 15, 'Development helper', 'StrictMode highlights potential problems by running extra checks in development'),
('68f2748e-496e-4e7c-baa9-997add65bfb6', 'What is server-side rendering in React?', 'hard', 15, 20, 'Where code runs', 'SSR renders React components on the server, sending HTML to the client');

-- Insert choices for each question
-- Question 1: useState
INSERT INTO public.question_choices (question_id, choice_text, is_correct, order_index)
SELECT id, 'useState', true, 1 FROM public.questions WHERE prompt LIKE '%managing component state%';
INSERT INTO public.question_choices (question_id, choice_text, is_correct, order_index)
SELECT id, 'useEffect', false, 2 FROM public.questions WHERE prompt LIKE '%managing component state%';
INSERT INTO public.question_choices (question_id, choice_text, is_correct, order_index)
SELECT id, 'useContext', false, 3 FROM public.questions WHERE prompt LIKE '%managing component state%';
INSERT INTO public.question_choices (question_id, choice_text, is_correct, order_index)
SELECT id, 'useReducer', false, 4 FROM public.questions WHERE prompt LIKE '%managing component state%';

-- Question 2: useEffect
INSERT INTO public.question_choices (question_id, choice_text, is_correct, order_index)
SELECT id, 'useEffect', true, 1 FROM public.questions WHERE prompt LIKE '%side effects%';
INSERT INTO public.question_choices (question_id, choice_text, is_correct, order_index)
SELECT id, 'useState', false, 2 FROM public.questions WHERE prompt LIKE '%side effects%';
INSERT INTO public.question_choices (question_id, choice_text, is_correct, order_index)
SELECT id, 'useMemo', false, 3 FROM public.questions WHERE prompt LIKE '%side effects%';
INSERT INTO public.question_choices (question_id, choice_text, is_correct, order_index)
SELECT id, 'useRef', false, 4 FROM public.questions WHERE prompt LIKE '%side effects%';

-- Question 3: State update
INSERT INTO public.question_choices (question_id, choice_text, is_correct, order_index)
SELECT id, 'setState(prev => prev + 1)', true, 1 FROM public.questions WHERE prompt LIKE '%update state based on previous%';
INSERT INTO public.question_choices (question_id, choice_text, is_correct, order_index)
SELECT id, 'setState(state + 1)', false, 2 FROM public.questions WHERE prompt LIKE '%update state based on previous%';
INSERT INTO public.question_choices (question_id, choice_text, is_correct, order_index)
SELECT id, 'this.state = newValue', false, 3 FROM public.questions WHERE prompt LIKE '%update state based on previous%';
INSERT INTO public.question_choices (question_id, choice_text, is_correct, order_index)
SELECT id, 'setState = newValue', false, 4 FROM public.questions WHERE prompt LIKE '%update state based on previous%';

-- Question 4: JSX
INSERT INTO public.question_choices (question_id, choice_text, is_correct, order_index)
SELECT id, 'JavaScript XML - a syntax extension for React', true, 1 FROM public.questions WHERE prompt = 'What is JSX?';
INSERT INTO public.question_choices (question_id, choice_text, is_correct, order_index)
SELECT id, 'A separate templating language', false, 2 FROM public.questions WHERE prompt = 'What is JSX?';
INSERT INTO public.question_choices (question_id, choice_text, is_correct, order_index)
SELECT id, 'A React component type', false, 3 FROM public.questions WHERE prompt = 'What is JSX?';
INSERT INTO public.question_choices (question_id, choice_text, is_correct, order_index)
SELECT id, 'HTML inside JavaScript files', false, 4 FROM public.questions WHERE prompt = 'What is JSX?';

-- Question 5: useContext
INSERT INTO public.question_choices (question_id, choice_text, is_correct, order_index)
SELECT id, 'A way to consume context values without prop drilling', true, 1 FROM public.questions WHERE prompt LIKE '%useContext provide%';
INSERT INTO public.question_choices (question_id, choice_text, is_correct, order_index)
SELECT id, 'A state management solution', false, 2 FROM public.questions WHERE prompt LIKE '%useContext provide%';
INSERT INTO public.question_choices (question_id, choice_text, is_correct, order_index)
SELECT id, 'A way to create global variables', false, 3 FROM public.questions WHERE prompt LIKE '%useContext provide%';
INSERT INTO public.question_choices (question_id, choice_text, is_correct, order_index)
SELECT id, 'A routing mechanism', false, 4 FROM public.questions WHERE prompt LIKE '%useContext provide%';

-- Question 6: Virtual DOM
INSERT INTO public.question_choices (question_id, choice_text, is_correct, order_index)
SELECT id, 'A lightweight JavaScript representation of the actual DOM', true, 1 FROM public.questions WHERE prompt = 'What is the virtual DOM?';
INSERT INTO public.question_choices (question_id, choice_text, is_correct, order_index)
SELECT id, 'A browser API for manipulating HTML', false, 2 FROM public.questions WHERE prompt = 'What is the virtual DOM?';
INSERT INTO public.question_choices (question_id, choice_text, is_correct, order_index)
SELECT id, 'A React-specific HTML element', false, 3 FROM public.questions WHERE prompt = 'What is the virtual DOM?';
INSERT INTO public.question_choices (question_id, choice_text, is_correct, order_index)
SELECT id, 'The browser document object', false, 4 FROM public.questions WHERE prompt = 'What is the virtual DOM?';

-- Question 7: React.memo
INSERT INTO public.question_choices (question_id, choice_text, is_correct, order_index)
SELECT id, 'To memoize a component and prevent unnecessary re-renders', true, 1 FROM public.questions WHERE prompt LIKE '%React.memo%';
INSERT INTO public.question_choices (question_id, choice_text, is_correct, order_index)
SELECT id, 'To create a memory reference', false, 2 FROM public.questions WHERE prompt LIKE '%React.memo%';
INSERT INTO public.question_choices (question_id, choice_text, is_correct, order_index)
SELECT id, 'To store component notes', false, 3 FROM public.questions WHERE prompt LIKE '%React.memo%';
INSERT INTO public.question_choices (question_id, choice_text, is_correct, order_index)
SELECT id, 'To cache API responses', false, 4 FROM public.questions WHERE prompt LIKE '%React.memo%';

-- Question 8: Keys
INSERT INTO public.question_choices (question_id, choice_text, is_correct, order_index)
SELECT id, 'To help React identify which items changed, added, or removed', true, 1 FROM public.questions WHERE prompt LIKE '%keys in React lists%';
INSERT INTO public.question_choices (question_id, choice_text, is_correct, order_index)
SELECT id, 'For styling purposes', false, 2 FROM public.questions WHERE prompt LIKE '%keys in React lists%';
INSERT INTO public.question_choices (question_id, choice_text, is_correct, order_index)
SELECT id, 'To encrypt list data', false, 3 FROM public.questions WHERE prompt LIKE '%keys in React lists%';
INSERT INTO public.question_choices (question_id, choice_text, is_correct, order_index)
SELECT id, 'To sort list items', false, 4 FROM public.questions WHERE prompt LIKE '%keys in React lists%';

-- Question 9: Controlled component
INSERT INTO public.question_choices (question_id, choice_text, is_correct, order_index)
SELECT id, 'A component whose form data is handled by React state', true, 1 FROM public.questions WHERE prompt = 'What is a controlled component?';
INSERT INTO public.question_choices (question_id, choice_text, is_correct, order_index)
SELECT id, 'A component with restricted access', false, 2 FROM public.questions WHERE prompt = 'What is a controlled component?';
INSERT INTO public.question_choices (question_id, choice_text, is_correct, order_index)
SELECT id, 'A component wrapped in a controller', false, 3 FROM public.questions WHERE prompt = 'What is a controlled component?';
INSERT INTO public.question_choices (question_id, choice_text, is_correct, order_index)
SELECT id, 'A component with no state', false, 4 FROM public.questions WHERE prompt = 'What is a controlled component?';

-- Question 10: useReducer
INSERT INTO public.question_choices (question_id, choice_text, is_correct, order_index)
SELECT id, 'Complex state logic with multiple sub-values', true, 1 FROM public.questions WHERE prompt LIKE '%useReducer best suited%';
INSERT INTO public.question_choices (question_id, choice_text, is_correct, order_index)
SELECT id, 'Simple boolean toggles', false, 2 FROM public.questions WHERE prompt LIKE '%useReducer best suited%';
INSERT INTO public.question_choices (question_id, choice_text, is_correct, order_index)
SELECT id, 'Styling components', false, 3 FROM public.questions WHERE prompt LIKE '%useReducer best suited%';
INSERT INTO public.question_choices (question_id, choice_text, is_correct, order_index)
SELECT id, 'Data fetching', false, 4 FROM public.questions WHERE prompt LIKE '%useReducer best suited%';

-- Question 11: useMemo vs useCallback
INSERT INTO public.question_choices (question_id, choice_text, is_correct, order_index)
SELECT id, 'useMemo memoizes values, useCallback memoizes functions', true, 1 FROM public.questions WHERE prompt LIKE '%useMemo and useCallback%';
INSERT INTO public.question_choices (question_id, choice_text, is_correct, order_index)
SELECT id, 'They are identical', false, 2 FROM public.questions WHERE prompt LIKE '%useMemo and useCallback%';
INSERT INTO public.question_choices (question_id, choice_text, is_correct, order_index)
SELECT id, 'useMemo is for async, useCallback is for sync', false, 3 FROM public.questions WHERE prompt LIKE '%useMemo and useCallback%';
INSERT INTO public.question_choices (question_id, choice_text, is_correct, order_index)
SELECT id, 'useCallback is newer and replaces useMemo', false, 4 FROM public.questions WHERE prompt LIKE '%useMemo and useCallback%';

-- Question 12: Suspense
INSERT INTO public.question_choices (question_id, choice_text, is_correct, order_index)
SELECT id, 'To display loading UI while waiting for lazy-loaded components or data', true, 1 FROM public.questions WHERE prompt LIKE '%React Suspense%';
INSERT INTO public.question_choices (question_id, choice_text, is_correct, order_index)
SELECT id, 'To pause component execution', false, 2 FROM public.questions WHERE prompt LIKE '%React Suspense%';
INSERT INTO public.question_choices (question_id, choice_text, is_correct, order_index)
SELECT id, 'To create animation effects', false, 3 FROM public.questions WHERE prompt LIKE '%React Suspense%';
INSERT INTO public.question_choices (question_id, choice_text, is_correct, order_index)
SELECT id, 'To handle errors', false, 4 FROM public.questions WHERE prompt LIKE '%React Suspense%';

-- Question 13: Prevent useEffect on initial render
INSERT INTO public.question_choices (question_id, choice_text, is_correct, order_index)
SELECT id, 'Use useRef to track first render and conditionally run logic', true, 1 FROM public.questions WHERE prompt LIKE '%prevent useEffect from running on initial%';
INSERT INTO public.question_choices (question_id, choice_text, is_correct, order_index)
SELECT id, 'Pass an empty dependency array', false, 2 FROM public.questions WHERE prompt LIKE '%prevent useEffect from running on initial%';
INSERT INTO public.question_choices (question_id, choice_text, is_correct, order_index)
SELECT id, 'Use useLayoutEffect instead', false, 3 FROM public.questions WHERE prompt LIKE '%prevent useEffect from running on initial%';
INSERT INTO public.question_choices (question_id, choice_text, is_correct, order_index)
SELECT id, 'Set a timeout', false, 4 FROM public.questions WHERE prompt LIKE '%prevent useEffect from running on initial%';

-- Question 14: StrictMode
INSERT INTO public.question_choices (question_id, choice_text, is_correct, order_index)
SELECT id, 'To highlight potential problems by running extra checks in development', true, 1 FROM public.questions WHERE prompt LIKE '%React.StrictMode%';
INSERT INTO public.question_choices (question_id, choice_text, is_correct, order_index)
SELECT id, 'To enable TypeScript strict mode', false, 2 FROM public.questions WHERE prompt LIKE '%React.StrictMode%';
INSERT INTO public.question_choices (question_id, choice_text, is_correct, order_index)
SELECT id, 'To improve production performance', false, 3 FROM public.questions WHERE prompt LIKE '%React.StrictMode%';
INSERT INTO public.question_choices (question_id, choice_text, is_correct, order_index)
SELECT id, 'To enforce coding standards', false, 4 FROM public.questions WHERE prompt LIKE '%React.StrictMode%';

-- Question 15: SSR
INSERT INTO public.question_choices (question_id, choice_text, is_correct, order_index)
SELECT id, 'Rendering React components on the server and sending HTML to the client', true, 1 FROM public.questions WHERE prompt LIKE '%server-side rendering%';
INSERT INTO public.question_choices (question_id, choice_text, is_correct, order_index)
SELECT id, 'Running React in a server environment only', false, 2 FROM public.questions WHERE prompt LIKE '%server-side rendering%';
INSERT INTO public.question_choices (question_id, choice_text, is_correct, order_index)
SELECT id, 'A way to serve static files', false, 3 FROM public.questions WHERE prompt LIKE '%server-side rendering%';
INSERT INTO public.question_choices (question_id, choice_text, is_correct, order_index)
SELECT id, 'Server-to-server React communication', false, 4 FROM public.questions WHERE prompt LIKE '%server-side rendering%';