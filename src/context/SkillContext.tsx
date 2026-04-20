import React, { createContext, useContext, useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useT } from '../i18n';
import type { Skill, Member, ChopEntry, ToolType, ModelType } from '../types';

const MOCK_MEMBERS: Member[] = [
  { id: '1', name: 'Alex Chen', contributions: 42, rank: 1 },
  { id: '2', name: 'Mia Torres', contributions: 37, rank: 2 },
  { id: '3', name: 'Sam Park', contributions: 29, rank: 3 },
  { id: '4', name: 'Jordan Liu', contributions: 24, rank: 4 },
  { id: '5', name: 'Riley Kim', contributions: 18, rank: 5 },
];

const MOCK_SKILLS: Skill[] = [
  {
    id: uuidv4(),
    name: 'Deep Code Review',
    tool: 'Cursor',
    targetModel: 'Sonnet 4.6',
    description: 'A structured prompt for comprehensive code review, covering security, performance, and maintainability.',
    manifesto: `# Deep Code Review\n\nYou are an expert software engineer performing a thorough code review.\n\n## Focus Areas\n- Security vulnerabilities\n- Performance bottlenecks\n- Code maintainability\n- Test coverage\n\n\`\`\`yaml\nreview:\n  depth: thorough\n  style: constructive\n  output: inline-comments\n\`\`\``,
    author: 'Alex Chen',
    createdAt: new Date('2025-03-10'),
    copies: 128,
    tags: ['code-review', 'quality', 'security'],
    chops: [
      {
        id: uuidv4(),
        author: 'Mia Torres',
        content: `Found that adding **"prioritize blocking issues first"** dramatically improves output quality.\n\n\`\`\`\nPrioritize: [critical, high, medium, low]\n\`\`\`\n\nSonnet 4.6 gives much more structured feedback than 3.5 on complex codebases.`,
        createdAt: new Date('2025-03-15'),
        likes: 14,
      },
    ],
  },
  {
    id: uuidv4(),
    name: 'Spec Writer Pro',
    tool: 'Claude Code',
    targetModel: 'Opus 4',
    description: 'Transform vague feature requests into precise technical specifications with edge cases.',
    manifesto: `# Spec Writer Pro\n\nConvert feature requests into detailed technical specifications.\n\n## Output Format\n- User stories\n- Acceptance criteria\n- Edge cases\n- API contracts`,
    author: 'Sam Park',
    createdAt: new Date('2025-03-18'),
    copies: 95,
    tags: ['spec', 'planning', 'product'],
    chops: [],
  },
  {
    id: uuidv4(),
    name: 'SQL Query Optimizer',
    tool: 'Cursor',
    targetModel: 'Sonnet 3.5',
    description: 'Analyze and optimize slow SQL queries with execution plan insights.',
    manifesto: `# SQL Query Optimizer\n\nAnalyze the provided SQL query and suggest optimizations.\n\n## Analysis Steps\n1. Parse query structure\n2. Identify N+1 patterns\n3. Suggest indexes\n4. Rewrite with CTEs where applicable`,
    author: 'Jordan Liu',
    createdAt: new Date('2025-03-20'),
    copies: 71,
    tags: ['sql', 'performance', 'database'],
    chops: [],
  },
  {
    id: uuidv4(),
    name: 'React Component Architect',
    tool: 'Cursor',
    targetModel: 'Sonnet 4.6',
    description: 'Design and scaffold React components with proper TypeScript types, hooks, and test stubs.',
    manifesto: `# React Component Architect\n\nScaffold production-ready React components.\n\n## Deliverables\n- TypeScript interface definitions\n- Component with proper hooks\n- Storybook story stub\n- Jest test skeleton`,
    author: 'Riley Kim',
    createdAt: new Date('2025-03-22'),
    copies: 103,
    tags: ['react', 'typescript', 'frontend'],
    chops: [
      {
        id: uuidv4(),
        author: 'Alex Chen',
        content: 'Works best when you paste in an existing similar component first. The model infers your patterns automatically.',
        createdAt: new Date('2025-03-24'),
        likes: 9,
      },
    ],
  },
  {
    id: uuidv4(),
    name: 'Error Explainer',
    tool: 'Claude Code',
    targetModel: 'Haiku 3.5',
    description: 'Paste any error message and get a plain-language explanation with actionable fix steps.',
    manifesto: `# Error Explainer\n\nExplain the error in plain language and provide fix steps.\n\n## Response Format\n1. **What happened**: One sentence\n2. **Why it happened**: Root cause\n3. **Fix steps**: Numbered list\n4. **Prevention**: Best practice`,
    author: 'Mia Torres',
    createdAt: new Date('2025-03-25'),
    copies: 156,
    tags: ['debugging', 'dx', 'beginner-friendly'],
    chops: [],
  },
  {
    id: uuidv4(),
    name: 'API Schema Designer',
    tool: 'o1',
    targetModel: 'o1',
    description: 'Design RESTful or GraphQL schemas from natural language descriptions with OpenAPI output.',
    manifesto: `# API Schema Designer\n\nDesign a complete API schema from the description below.\n\n## Output\n- OpenAPI 3.0 YAML\n- Example request/response pairs\n- Authentication strategy`,
    author: 'Jordan Liu',
    createdAt: new Date('2025-03-28'),
    copies: 84,
    tags: ['api', 'design', 'openapi'],
    chops: [],
  },
];

interface SkillContextValue {
  skills: Skill[];
  members: Member[];
  addSkill: (data: {
    name: string;
    tool: ToolType;
    targetModel: ModelType;
    description: string;
    manifesto: string;
    previewImage?: string;
    tags: string;
  }) => string;
  copySkill: (id: string) => void;
  addChop: (skillId: string, content: string, author: string) => void;
  likeChop: (skillId: string, chopId: string) => void;
  getSkill: (id: string) => Skill | undefined;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  filterTool: ToolType | 'All';
  setFilterTool: (t: ToolType | 'All') => void;
}

const SkillContext = createContext<SkillContextValue>({} as SkillContextValue);

export const SkillProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { t } = useT();
  const [skills, setSkills] = useState<Skill[]>(MOCK_SKILLS);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTool, setFilterTool] = useState<ToolType | 'All'>('All');

  const addSkill = useCallback((data: Parameters<SkillContextValue['addSkill']>[0]) => {
    const id = uuidv4();
    const newSkill: Skill = {
      id,
      name: data.name,
      tool: data.tool,
      targetModel: data.targetModel,
      description: data.description,
      manifesto: data.manifesto,
      previewImage: data.previewImage,
      author: t('skill.authorYou'),
      createdAt: new Date(),
      copies: 0,
      tags: data.tags.split(',').map(x => x.trim()).filter(Boolean),
      chops: [],
    };
    setSkills(prev => [newSkill, ...prev]);
    return id;
  }, [t]);

  const copySkill = useCallback((id: string) => {
    setSkills(prev =>
      prev.map(s => s.id === id ? { ...s, copies: s.copies + 1 } : s)
    );
  }, []);

  const addChop = useCallback((skillId: string, content: string, author: string) => {
    const chop: ChopEntry = {
      id: uuidv4(),
      author,
      content,
      createdAt: new Date(),
      likes: 0,
    };
    setSkills(prev =>
      prev.map(s => s.id === skillId ? { ...s, chops: [...s.chops, chop] } : s)
    );
  }, []);

  const likeChop = useCallback((skillId: string, chopId: string) => {
    setSkills(prev =>
      prev.map(s =>
        s.id === skillId
          ? {
              ...s,
              chops: s.chops.map(c =>
                c.id === chopId ? { ...c, likes: c.likes + 1 } : c
              ),
            }
          : s
      )
    );
  }, []);

  const getSkill = useCallback((id: string) => skills.find(s => s.id === id), [skills]);

  return (
    <SkillContext.Provider
      value={{
        skills,
        members: MOCK_MEMBERS,
        addSkill,
        copySkill,
        addChop,
        likeChop,
        getSkill,
        searchQuery,
        setSearchQuery,
        filterTool,
        setFilterTool,
      }}
    >
      {children}
    </SkillContext.Provider>
  );
};

export const useSkills = () => useContext(SkillContext);
