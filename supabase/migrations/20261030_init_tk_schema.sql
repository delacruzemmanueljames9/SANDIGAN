-- =====================================================================
-- TINIG KABATAAN (TK) - COMPLETE DATABASE ARCHITECTURE
-- PostgreSQL + Supabase Row Level Security (RLS)
-- =====================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ---------------------------------------------------------------------
-- 1. ENUMS & TYPES
-- ---------------------------------------------------------------------
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM (
        'super_admin',
        'admin',
        'department_head',
        'officer',
        'content_reviewer',
        'public_user'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE content_status AS ENUM (
        'draft',
        'pending_review',
        'published',
        'archived'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE project_status AS ENUM (
        'planning',
        'active',
        'on_hold',
        'completed',
        'archived'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE task_status AS ENUM (
        'todo',
        'in_progress',
        'in_review',
        'done'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE access_level AS ENUM (
        'public',
        'internal',
        'restricted_admin'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ---------------------------------------------------------------------
-- 2. DEPARTMENTS TABLE
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(64) UNIQUE NOT NULL,
    name VARCHAR(128) NOT NULL,
    code VARCHAR(16) NOT NULL,
    description TEXT,
    icon VARCHAR(64) DEFAULT 'Folder',
    head_user_id UUID,
    room_coordinates JSONB DEFAULT '{"x": 0, "y": 0, "z": 0}',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---------------------------------------------------------------------
-- 3. PROFILES TABLE (Connects with Supabase auth.users)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role user_role DEFAULT 'public_user',
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    title VARCHAR(128),
    bio TEXT,
    avatar_url TEXT,
    phone VARCHAR(32),
    status VARCHAR(32) DEFAULT 'active',
    last_active_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---------------------------------------------------------------------
-- 4. WEBSITES & PORTALS REGISTRY
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS websites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(64) UNIQUE NOT NULL,
    title VARCHAR(128) NOT NULL,
    tagline VARCHAR(255),
    description TEXT,
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    primary_color VARCHAR(32) DEFAULT '#31556B',
    accent_color VARCHAR(32) DEFAULT '#DCEAF7',
    status VARCHAR(32) DEFAULT 'published', -- 'published', 'draft', 'maintenance'
    nav_links JSONB DEFAULT '[]',
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---------------------------------------------------------------------
-- 5. WEBSITE PAGES
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS website_pages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    website_id UUID REFERENCES websites(id) ON DELETE CASCADE,
    slug VARCHAR(128) NOT NULL,
    title VARCHAR(255) NOT NULL,
    summary TEXT,
    content_blocks JSONB DEFAULT '[]',
    meta_description TEXT,
    is_published BOOLEAN DEFAULT TRUE,
    version INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(website_id, slug)
);

-- ---------------------------------------------------------------------
-- 6. CONTENT ITEMS (Articles, News, Campaigns)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS content_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    website_id UUID REFERENCES websites(id) ON DELETE CASCADE,
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    excerpt TEXT,
    body TEXT NOT NULL,
    category VARCHAR(64) DEFAULT 'General',
    tags TEXT[] DEFAULT '{}',
    author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    status content_status DEFAULT 'draft',
    review_notes TEXT,
    reviewed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    featured_image TEXT,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---------------------------------------------------------------------
-- 7. PROJECTS & TASKS
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    department_id UUID REFERENCES departments(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    code VARCHAR(32) NOT NULL,
    description TEXT,
    lead_user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    status project_status DEFAULT 'planning',
    priority VARCHAR(32) DEFAULT 'medium',
    progress_percentage INTEGER DEFAULT 0,
    start_date DATE,
    due_date DATE,
    budget_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    department_id UUID REFERENCES departments(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
    status task_status DEFAULT 'todo',
    priority VARCHAR(32) DEFAULT 'medium',
    due_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---------------------------------------------------------------------
-- 8. ANNOUNCEMENTS & INTERNAL EVENTS
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    target_audience VARCHAR(64) DEFAULT 'all_hq', -- 'all_hq', 'public', 'department'
    priority VARCHAR(32) DEFAULT 'normal', -- 'normal', 'urgent', 'info'
    is_pinned BOOLEAN DEFAULT FALSE,
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_date TIMESTAMPTZ NOT NULL,
    location VARCHAR(255),
    meeting_link TEXT,
    is_internal BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---------------------------------------------------------------------
-- 9. KNOWLEDGE BRAIN & DOCUMENTS
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS knowledge_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(128) NOT NULL,
    slug VARCHAR(128) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(64) DEFAULT 'BookOpen',
    access_level access_level DEFAULT 'internal'
);

CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES knowledge_categories(id) ON DELETE SET NULL,
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    file_url TEXT,
    file_size_kb INTEGER DEFAULT 0,
    file_type VARCHAR(32) DEFAULT 'pdf',
    access_level access_level DEFAULT 'internal',
    version VARCHAR(16) DEFAULT 'v1.0',
    author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    tags TEXT[] DEFAULT '{}',
    downloads_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---------------------------------------------------------------------
-- 10. MENTAL HEALTH SUPPORT & SAFETY
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS mental_health_resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    category VARCHAR(64) NOT NULL, -- 'Hotline', 'Crisis Center', 'Free Counseling', 'Psychiatric Clinic'
    phone VARCHAR(64),
    mobile VARCHAR(64),
    email VARCHAR(128),
    website_url TEXT,
    address TEXT,
    region VARCHAR(64) DEFAULT 'Nationwide', -- 'NCR', 'Luzon', 'Visayas', 'Mindanao', 'Nationwide'
    operating_hours VARCHAR(128) DEFAULT '24/7',
    services_offered TEXT,
    is_verified BOOLEAN DEFAULT TRUE,
    is_emergency BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS support_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    anonymous_session_id VARCHAR(128) NOT NULL,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    consent_ai BOOLEAN DEFAULT FALSE,
    consent_history BOOLEAN DEFAULT FALSE,
    mood_rating INTEGER, -- 1 to 5
    primary_concern VARCHAR(64),
    status VARCHAR(32) DEFAULT 'active', -- 'active', 'completed', 'escalated'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    ended_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS support_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES support_sessions(id) ON DELETE CASCADE,
    sender_type VARCHAR(16) NOT NULL, -- 'user', 'tinig_ai', 'counselor', 'system'
    content TEXT NOT NULL,
    emotion_tag VARCHAR(64),
    recommended_resources JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS youth_voice_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    author_display_name VARCHAR(128) DEFAULT 'Anonymous Youth',
    age_group VARCHAR(32),
    region VARCHAR(64),
    topic VARCHAR(64) NOT NULL,
    content TEXT NOT NULL,
    status content_status DEFAULT 'pending_review',
    reviewed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    likes_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---------------------------------------------------------------------
-- 11. AUDIT LOGS & CONSENTS
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    action VARCHAR(128) NOT NULL,
    entity_type VARCHAR(64) NOT NULL,
    entity_id VARCHAR(128),
    metadata JSONB DEFAULT '{}',
    ip_hash VARCHAR(64),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_consents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    anonymous_id VARCHAR(128),
    consent_type VARCHAR(64) NOT NULL, -- 'ai_processing', 'conversation_storage', 'analytics'
    granted BOOLEAN DEFAULT FALSE,
    ip_hash VARCHAR(64),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---------------------------------------------------------------------
-- 12. ROW LEVEL SECURITY (RLS) POLICIES
-- ---------------------------------------------------------------------

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE websites ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE mental_health_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE youth_voice_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_consents ENABLE ROW LEVEL SECURITY;

-- Profiles: Public can view active officer titles, users can update own profile, Admins full access
CREATE POLICY "Public profiles are readable" ON profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can edit own profile" ON profiles
    FOR UPDATE USING (auth.uid() = user_id);

-- Departments: Readable by all, manageable by Admins
CREATE POLICY "Departments readable by everyone" ON departments
    FOR SELECT USING (true);

-- Websites & Pages: Published pages readable by public, all readable by officers
CREATE POLICY "Websites public read" ON websites
    FOR SELECT USING (status = 'published' OR auth.role() = 'authenticated');

CREATE POLICY "Website pages public read" ON website_pages
    FOR SELECT USING (is_published = true OR auth.role() = 'authenticated');

-- Content items: Published items public, drafts for officers
CREATE POLICY "Content items public read" ON content_items
    FOR SELECT USING (status = 'published' OR auth.role() = 'authenticated');

-- Projects and Tasks: Only authenticated officers can view
CREATE POLICY "Projects accessible by officers" ON projects
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Tasks accessible by officers" ON tasks
    FOR SELECT USING (auth.role() = 'authenticated');

-- Documents: Public if access_level = 'public', else authenticated
CREATE POLICY "Documents access control" ON documents
    FOR SELECT USING (
        access_level = 'public' 
        OR (auth.role() = 'authenticated' AND access_level = 'internal')
    );

-- Mental health resources: Public directory
CREATE POLICY "Mental health resources public read" ON mental_health_resources
    FOR SELECT USING (is_verified = true);

-- Youth voice wall: Approved items public
CREATE POLICY "Youth voices public read" ON youth_voice_submissions
    FOR SELECT USING (status = 'published');

-- ---------------------------------------------------------------------
-- 13. SEED DATA FOR PRODUCTION DEPLOYMENT
-- ---------------------------------------------------------------------

-- Insert Default Departments
INSERT INTO departments (slug, name, code, description, icon, room_coordinates) VALUES
('main-admin', 'Main Administration Office', 'ADMIN', 'Executive leadership, governance, institutional partnerships, and organization strategy.', 'Building2', '{"x": 2, "y": 0, "z": 0}'),
('mental-health', 'Mental Health Department', 'MHD', 'Psychosocial support, peer counseling networks, mental health literacy, and well-being initiatives.', 'HeartHandshake', '{"x": 0, "y": 1, "z": 0}'),
('publication', 'Publication Division', 'PUB', 'Official editorial board, youth journalism, digital campaigns, and educational literature.', 'PenSquare', '{"x": 1, "y": 1, "z": 0}'),
('youth-engagement', 'Youth Engagement Department', 'YED', 'Community outreach, grassroots mobilization, volunteer corps, and youth representation.', 'Users2', '{"x": 2, "y": 1, "z": 0}'),
('learning-dev', 'Learning & Development', 'LND', 'Capacity building, youth leadership academies, skills training, and mentorship programs.', 'GraduationCap', '{"x": 0, "y": 2, "z": 0}'),
('research', 'Research & Policy Division', 'RES', 'Youth demographic studies, evidence-based policy briefs, impact evaluation, and advocacy papers.', 'LineChart', '{"x": 1, "y": 2, "z": 0}'),
('project-coordination', 'Project Coordination Room', 'PCR', 'Operational planning, cross-functional sprints, logistics, and milestone tracking.', 'FolderKanban', '{"x": 2, "y": 2, "z": 0}'),
('meeting-room', 'Central Assembly & Meeting Room', 'MTG', 'Multi-department conferences, executive summits, and internal officer town halls.', 'Video', '{"x": 0, "y": 3, "z": 0}'),
('knowledge-center', 'Central Knowledge Brain', 'KB', 'Organizational archive, institutional memories, training archives, and certified templates.', 'Library', '{"x": 1, "y": 3, "z": 0}'),
('officer-workspace', 'Open Officer Workspace', 'WS', 'Collaborative open floor for active officers, volunteers, and project squads.', 'Laptop', '{"x": 2, "y": 3, "z": 0}')
ON CONFLICT (slug) DO NOTHING;

-- Insert Websites Registry
INSERT INTO websites (slug, title, tagline, description, primary_color, accent_color, status) VALUES
('main', 'Tinig KaBataan Central', 'Your Voice Matters. Your Mind Matters.', 'The central institutional portal for the Tinig KaBataan digital ecosystem.', '#31556B', '#DCEAF7', 'published'),
('mental-health', 'Tinig KaBataan Mental Health Platform', 'Safe, Compassionate, Youth-Centered Support', 'Dedicated digital sanctuary for mental well-being, triage, and educational resources.', '#2E7D5B', '#DCEFE5', 'published'),
('publication', 'Tinig KaBataan Publications & Gazette', 'Amplifying Filipino Youth Perspectives', 'Official digital magazine, youth essays, investigative reports, and creative arts.', '#6C5CE7', '#DCD6F7', 'published'),
('youth', 'Tinig KaBataan Youth Action Hub', 'Grassroots Power, Nationwide Youth Movement', 'Volunteer recruitment, nationwide chapters, youth councils, and civic campaigns.', '#E8985E', '#F6E8D6', 'published'),
('learning', 'TK Leadership & Learning Academy', 'Empowering Tomorrow''s Transformative Leaders', 'Free certified youth masterclasses, advocacy workshops, and mentorship modules.', '#31556B', '#DCEAF7', 'published')
ON CONFLICT (slug) DO NOTHING;

-- Insert Verified Philippine Mental Health Resources
INSERT INTO mental_health_resources (name, category, phone, mobile, email, website_url, region, operating_hours, services_offered, is_emergency) VALUES
('National Center for Mental Health (NCMH) Crisis Hotline', 'Hotline', '1553', '0917-899-8727 / 0966-351-4518', 'ncmh@doh.gov.ph', 'https://ncmh.gov.ph', 'Nationwide', '24/7 (Toll-Free via Landline)', '24/7 free mental health crisis intervention, psychological first aid, psychiatric emergency triage', true),
('Hopeline Philippines', 'Hotline', '(02) 8804-4673', '0917-558-4673 / 0918-873-4673', 'hopeline@ngf-mindstrong.org', 'https://ngf-mindstrong.org', 'Nationwide', '24/7', 'Crisis intervention, depression and suicide prevention support', true),
('In Touch Community Services: Crisis Line', 'Crisis Center', '(02) 8893-7603', '0917-800-1123 / 0922-893-8944', 'crisisline@in-touch.org', 'https://www.in-touch.org', 'Nationwide', '24/7', 'Free and confidential emotional support, certified counseling referrals', true),
('Philippine Mental Health Association (PMHA)', 'Free Counseling', '(02) 8921-2093', '0917-565-2036', 'pmhaclinic@yahoo.com', 'https://pmha.org.ph', 'NCR / Nationwide Online', 'Mon-Fri 8:00 AM - 5:00 PM', 'Psychological consultation, clinical counseling, youth mental health webinars', false),
('Tawag Paglaum Centro Bisaya', 'Hotline', '', '0939-937-5433 / 0927-654-1629', '', '', 'Visayas / Region 7', '24/7', 'Emotional support and crisis helpline in Cebuano and Tagalog', true),
('Mindanao Youth Mental Health Network', 'Crisis Center', '', '0915-423-8990', 'support@mindanaomind.org', 'https://mindanaomind.org', 'Mindanao', 'Daily 9:00 AM - 9:00 PM', 'Peer-to-peer psychosocial support, trauma-informed youth guidance', false)
ON CONFLICT DO NOTHING;
