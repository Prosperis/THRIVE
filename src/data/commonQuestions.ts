import type { CommonQuestion } from '@/types/interviewPrep';

export const COMMON_INTERVIEW_QUESTIONS: CommonQuestion[] = [
  // Behavioral Questions
  {
    question: 'Tell me about yourself.',
    category: 'behavioral',
    difficulty: 'easy',
    tips: "Use the present-past-future framework. Start with your current role, briefly mention how you got there, and finish with why you're excited about this opportunity.",
    tags: ['introduction', 'overview'],
  },
  {
    question: 'What is your greatest strength?',
    category: 'behavioral',
    difficulty: 'easy',
    tips: 'Choose a strength relevant to the role and back it up with specific examples.',
    tags: ['strengths', 'self-assessment'],
  },
  {
    question: 'What is your greatest weakness?',
    category: 'behavioral',
    difficulty: 'medium',
    tips: "Be honest but strategic. Mention a real weakness and explain how you're working to improve it.",
    tags: ['weaknesses', 'self-awareness'],
  },
  {
    question:
      'Tell me about a time when you faced a conflict with a coworker and how you resolved it.',
    category: 'behavioral',
    difficulty: 'medium',
    tips: 'Use the STAR method (Situation, Task, Action, Result). Focus on your conflict resolution skills and positive outcome.',
    tags: ['conflict-resolution', 'teamwork', 'STAR'],
  },
  {
    question: 'Describe a situation where you had to work under pressure or meet a tight deadline.',
    category: 'behavioral',
    difficulty: 'medium',
    tips: 'Highlight your time management, prioritization, and stress management skills.',
    tags: ['pressure', 'deadlines', 'time-management', 'STAR'],
  },
  {
    question: 'Tell me about a time you failed. What did you learn?',
    category: 'behavioral',
    difficulty: 'medium',
    tips: 'Be honest about a real failure, but emphasize the lessons learned and how you grew from it.',
    tags: ['failure', 'learning', 'growth', 'STAR'],
  },
  {
    question: 'Describe a situation where you had to lead a team or take initiative.',
    category: 'leadership',
    difficulty: 'medium',
    tips: 'Focus on your leadership style, how you motivated others, and the results achieved.',
    tags: ['leadership', 'initiative', 'team-management', 'STAR'],
  },
  {
    question: 'Why do you want to work here?',
    category: 'company-specific',
    difficulty: 'easy',
    tips: 'Research the company thoroughly. Mention specific aspects of their mission, culture, or products that resonate with you.',
    tags: ['motivation', 'company-research'],
  },
  {
    question: 'Where do you see yourself in 5 years?',
    category: 'behavioral',
    difficulty: 'medium',
    tips: 'Show ambition but also commitment. Align your goals with potential growth at the company.',
    tags: ['career-goals', 'future'],
  },
  {
    question: 'Why are you leaving your current job?',
    category: 'behavioral',
    difficulty: 'medium',
    tips: "Stay positive. Focus on what you're looking for (growth, new challenges) rather than what you're running from.",
    tags: ['job-change', 'motivation'],
  },

  // Technical Questions (General)
  {
    question: 'Explain the difference between var, let, and const in JavaScript.',
    category: 'technical',
    difficulty: 'easy',
    tips: 'Discuss scope (function vs block), hoisting, and mutability.',
    tags: ['javascript', 'fundamentals', 'variables'],
  },
  {
    question: 'What is the difference between == and === in JavaScript?',
    category: 'technical',
    difficulty: 'easy',
    tips: 'Explain type coercion and strict equality.',
    tags: ['javascript', 'comparison', 'operators'],
  },
  {
    question: 'Explain what a closure is in JavaScript.',
    category: 'technical',
    difficulty: 'medium',
    tips: 'Define closure as a function with access to its outer scope, provide practical examples.',
    tags: ['javascript', 'closures', 'scope'],
  },
  {
    question: 'What is the difference between synchronous and asynchronous code?',
    category: 'technical',
    difficulty: 'medium',
    tips: 'Explain blocking vs non-blocking, event loop, and practical use cases.',
    tags: ['javascript', 'async', 'promises'],
  },
  {
    question: 'Explain the concept of RESTful APIs.',
    category: 'technical',
    difficulty: 'medium',
    tips: 'Discuss HTTP methods (GET, POST, PUT, DELETE), statelessness, and resource-based URLs.',
    tags: ['api', 'rest', 'http'],
  },
  {
    question: 'What is the difference between SQL and NoSQL databases?',
    category: 'technical',
    difficulty: 'medium',
    tips: 'Compare structure (relational vs document-based), scalability, and use cases.',
    tags: ['databases', 'sql', 'nosql'],
  },
  {
    question: 'Explain the concept of Object-Oriented Programming.',
    category: 'technical',
    difficulty: 'medium',
    tips: 'Discuss the four pillars: encapsulation, abstraction, inheritance, and polymorphism.',
    tags: ['oop', 'programming-paradigms'],
  },
  {
    question: 'What is Git and how do you use it?',
    category: 'technical',
    difficulty: 'easy',
    tips: 'Explain version control, common commands (commit, push, pull, branch, merge), and workflows.',
    tags: ['git', 'version-control', 'tools'],
  },

  // System Design
  {
    question: 'How would you design a URL shortener like bit.ly?',
    category: 'system-design',
    difficulty: 'medium',
    tips: 'Discuss URL generation (hashing), database schema, caching, and scalability.',
    tags: ['system-design', 'scalability', 'databases'],
  },
  {
    question: 'Design a notification system for a social media platform.',
    category: 'system-design',
    difficulty: 'hard',
    tips: 'Cover push notifications, message queues, fan-out approaches, and handling high volume.',
    tags: ['system-design', 'notifications', 'scalability'],
  },
  {
    question: 'How would you design a rate limiter?',
    category: 'system-design',
    difficulty: 'medium',
    tips: 'Discuss algorithms (token bucket, leaky bucket), distributed systems considerations.',
    tags: ['system-design', 'rate-limiting', 'algorithms'],
  },

  // Coding/Problem Solving
  {
    question: 'Reverse a string in JavaScript.',
    category: 'coding',
    difficulty: 'easy',
    tips: 'Multiple approaches: split/reverse/join, loop, recursion. Discuss time/space complexity.',
    tags: ['javascript', 'strings', 'algorithms'],
  },
  {
    question: 'Find the first non-repeating character in a string.',
    category: 'coding',
    difficulty: 'medium',
    tips: 'Use a hash map to count occurrences, then iterate to find the first with count 1.',
    tags: ['javascript', 'strings', 'hash-maps'],
  },
  {
    question: 'Implement a function to check if a string is a palindrome.',
    category: 'coding',
    difficulty: 'easy',
    tips: 'Compare characters from both ends, moving inward. Consider case sensitivity and spaces.',
    tags: ['javascript', 'strings', 'algorithms'],
  },
  {
    question: 'Write a function to flatten a nested array.',
    category: 'coding',
    difficulty: 'medium',
    tips: 'Use recursion or iterative approach with a stack. Consider using Array.flat() for modern JS.',
    tags: ['javascript', 'arrays', 'recursion'],
  },

  // Problem Solving
  {
    question: "How do you approach debugging a problem you've never seen before?",
    category: 'problem-solving',
    difficulty: 'medium',
    tips: 'Discuss systematic approaches: reproducing the issue, isolating variables, using debugging tools, researching.',
    tags: ['debugging', 'methodology'],
  },
  {
    question: 'Describe your process for learning a new technology or framework.',
    category: 'problem-solving',
    difficulty: 'medium',
    tips: 'Mention official docs, tutorials, building projects, community resources, and consistent practice.',
    tags: ['learning', 'growth', 'technology'],
  },
  {
    question: 'How do you prioritize tasks when working on multiple projects?',
    category: 'problem-solving',
    difficulty: 'medium',
    tips: 'Discuss prioritization frameworks (Eisenhower Matrix), communication with stakeholders, and time management.',
    tags: ['prioritization', 'project-management', 'time-management'],
  },
];

export const QUESTION_CATEGORIES = [
  { value: 'behavioral', label: 'Behavioral', icon: '💬' },
  { value: 'technical', label: 'Technical', icon: '💻' },
  { value: 'system-design', label: 'System Design', icon: '🏗️' },
  { value: 'coding', label: 'Coding', icon: '⚡' },
  { value: 'company-specific', label: 'Company Specific', icon: '🏢' },
  { value: 'leadership', label: 'Leadership', icon: '👥' },
  { value: 'problem-solving', label: 'Problem Solving', icon: '🧩' },
] as const;

export const DIFFICULTY_LEVELS = [
  { value: 'easy', label: 'Easy', color: 'text-green-600' },
  { value: 'medium', label: 'Medium', color: 'text-yellow-600' },
  { value: 'hard', label: 'Hard', color: 'text-red-600' },
] as const;
