export type SkillCategory = 'language' | 'framework' | 'tool' | 'soft';

export interface Skill {
  id: string;
  label: string;
  aliases: string[];
  category: SkillCategory;
}

export interface RoleSkillRequirement {
  skillId: string;
  importance: 1 | 2 | 3; // 3 = highest
}

export interface RoleDefinition {
  id: string;
  name: string;
  description: string;
  responsibilities: string[];
  requiredSkills: RoleSkillRequirement[];
}

export type ResourceType = 'video' | 'interactive' | 'docs';

export interface LearningResource {
  id: string;
  skillId: string;
  title: string;
  url: string;
  platform: string;
  type: ResourceType;
}

export interface GapAnalysisResult {
  roleId: string;
  normalizedUserSkills: string[];
  matchedSkills: string[];
  missingSkills: string[];
  readinessPercent: number;
  missingSkillsByCategory: Record<SkillCategory, string[]>;
}

export interface UserProfile {
  name?: string;
  isStudent?: boolean;
  school?: string;
  graduationYear?: string;
  experienceLevel?: 'student' | 'recent-grad' | 'career-switcher' | 'other';
  dreamRole?: string;
  skills: string[];
}

export interface RecommendedResource {
  title: string;
  url: string;
  type: 'roadmap' | 'web-search';
  description?: string;
}

export interface TimelineEvent {
  id: string;
  skillId: string;
  skillName: string;
  month: number;
  description: string;
  completed: boolean;
}

export interface JobStatistics {
  medianPay: string;
  numberOfJobs: string;
  jobOutlook: string;
  employmentChange: string;
  lastUpdated?: string;
}

export interface ProjectSuggestion {
  name: string;
  description: string;
  skills: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

