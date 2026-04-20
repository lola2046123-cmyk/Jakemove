export type ThemeMode = 'light' | 'dark';

export type ToolType = 'Cursor' | 'Claude Code' | 'o1' | 'Windsurf' | 'Copilot' | 'Other';
export type ModelType = 'Sonnet 3.5' | 'Sonnet 4.6' | 'o1' | 'GPT-4o' | 'Haiku 3.5' | 'Opus 4' | 'Other';

export interface ChopEntry {
  id: string;
  author: string;
  avatar?: string;
  content: string;
  createdAt: Date;
  likes: number;
}

export interface Skill {
  id: string;
  name: string;
  tool: ToolType;
  targetModel: ModelType;
  description: string;
  manifesto: string;
  previewImage?: string;
  author: string;
  authorAvatar?: string;
  createdAt: Date;
  copies: number;
  chops: ChopEntry[];
  tags: string[];
}

export interface Member {
  id: string;
  name: string;
  avatar?: string;
  contributions: number;
  rank: number;
}

export interface UploadFormData {
  name: string;
  tool: ToolType;
  targetModel: ModelType;
  description: string;
  manifesto: string;
  previewImage?: string;
  tags: string;
}

/** Metadata collected in step-1 modal, passed to step-2 Editor. */
export interface EditorDraft {
  name: string;
  tool: ToolType;
  targetModel: ModelType;
  description: string;
  tags: string;
}
