export type UserRole =
  | 'super_admin'
  | 'admin'
  | 'department_head'
  | 'officer'
  | 'content_reviewer'
  | 'public_user';

export type ContentStatus = 'draft' | 'pending_review' | 'published' | 'archived';
export type ProjectStatus = 'planning' | 'active' | 'on_hold' | 'completed' | 'archived';
export type TaskStatus = 'todo' | 'in_progress' | 'in_review' | 'done';
export type AccessLevel = 'public' | 'internal' | 'restricted_admin';

export interface UserProfile {
  id: string;
  user_id?: string;
  email: string;
  full_name: string;
  role: UserRole;
  department_id?: string;
  department_name?: string;
  title?: string;
  bio?: string;
  avatar_url?: string;
  phone?: string;
  status: 'active' | 'inactive' | 'on_leave';
  created_at: string;
}

export interface Department {
  id: string;
  slug: string;
  name: string;
  code: string;
  description: string;
  icon: string;
  head_user_id?: string;
  head_name?: string;
  head_title?: string;
  officers_count: number;
  active_projects_count: number;
  pending_tasks_count: number;
  room_id: string;
  is_active: boolean;
  color: string;
}

export interface Website {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  department_id?: string;
  department_name?: string;
  primary_color: string;
  accent_color: string;
  status: 'published' | 'draft' | 'maintenance';
  url_path: string;
  nav_links: { label: string; href: string }[];
  pages_count: number;
  created_at: string;
}

export interface WebsitePage {
  id: string;
  website_id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  meta_description?: string;
  is_published: boolean;
  version: number;
  updated_at: string;
}

export interface ContentItem {
  id: string;
  website_id: string;
  department_id?: string;
  department_name?: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  category: string;
  tags: string[];
  author_id: string;
  author_name: string;
  status: ContentStatus;
  review_notes?: string;
  reviewed_by?: string;
  featured_image?: string;
  published_at?: string;
  created_at: string;
}

export interface Project {
  id: string;
  department_id: string;
  department_name?: string;
  title: string;
  code: string;
  description: string;
  lead_id: string;
  lead_name: string;
  status: ProjectStatus;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  progress: number; // 0 - 100
  start_date: string;
  due_date: string;
  budget_notes?: string;
  tasks_count: number;
  completed_tasks_count: number;
  created_at: string;
}

export interface Task {
  id: string;
  project_id: string;
  project_title?: string;
  department_id: string;
  title: string;
  description: string;
  assigned_to?: string;
  assignee_name?: string;
  status: TaskStatus;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  due_date: string;
  created_at: string;
}

export interface Announcement {
  id: string;
  department_id?: string;
  department_name?: string;
  title: string;
  content: string;
  target_audience: 'all_hq' | 'public' | 'department';
  priority: 'normal' | 'urgent' | 'info';
  is_pinned: boolean;
  created_by_name: string;
  created_at: string;
}

export interface EventItem {
  id: string;
  department_id?: string;
  department_name?: string;
  title: string;
  description: string;
  event_date: string;
  location: string;
  meeting_link?: string;
  is_internal: boolean;
}

export interface DocumentItem {
  id: string;
  category_id: string;
  category_name: string;
  department_id?: string;
  department_name?: string;
  title: string;
  description: string;
  file_url: string;
  file_size_kb: number;
  file_type: 'pdf' | 'docx' | 'xlsx' | 'pptx' | 'zip' | 'md';
  access_level: AccessLevel;
  version: string;
  author_name: string;
  tags: string[];
  downloads_count: number;
  created_at: string;
  updated_at: string;
}

export interface KnowledgeCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  access_level: AccessLevel;
  documents_count: number;
}

export interface MentalHealthResource {
  id: string;
  name: string;
  category: 'Hotline' | 'Crisis Center' | 'Free Counseling' | 'Psychiatric Clinic' | 'Community Center';
  phone?: string;
  mobile?: string;
  email?: string;
  website_url?: string;
  address?: string;
  region: 'NCR' | 'Luzon' | 'Visayas' | 'Mindanao' | 'Nationwide';
  operating_hours: string;
  services_offered: string;
  is_verified: boolean;
  is_emergency: boolean;
}

export interface SupportSession {
  id: string;
  anonymous_session_id: string;
  consent_ai: boolean;
  consent_history: boolean;
  mood_rating?: number;
  primary_concern?: string;
  status: 'active' | 'completed' | 'escalated';
  created_at: string;
}

export interface SupportMessage {
  id: string;
  session_id: string;
  sender_type: 'user' | 'tinig_ai' | 'counselor' | 'system';
  content: string;
  emotion_tag?: string;
  recommended_resources?: MentalHealthResource[];
  created_at: string;
}

export interface YouthVoiceSubmission {
  id: string;
  author_display_name: string;
  age_group: string;
  region: string;
  topic: string;
  content: string;
  status: ContentStatus;
  likes_count: number;
  created_at: string;
}

export interface AuditLog {
  id: string;
  user_name: string;
  user_role: UserRole;
  action: string;
  entity_type: string;
  entity_id?: string;
  details: string;
  created_at: string;
}

export interface IsometricRoom {
  id: string;
  name: string;
  code: string;
  category: string;
  description: string;
  head_name: string;
  officers_count: number;
  active_tasks: number;
  color: string;
  accent: string;
  slug: string;
  position: { x: number; y: number; width: number; height: number };
  status: 'active' | 'busy' | 'in_session';
}
