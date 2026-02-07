-- Velosify Learning System Database Schema

-- Learning Topics Table
CREATE TABLE learning_topics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100), -- 'technical', 'soft-skills', 'company-sop'
    difficulty VARCHAR(50), -- 'beginner', 'intermediate', 'advanced'
    estimated_hours INTEGER,
    icon VARCHAR(100),
    order_index INTEGER,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Learning Modules Table (sub-sections of topics)
CREATE TABLE learning_modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    topic_id UUID REFERENCES learning_topics(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    content TEXT, -- Markdown content
    video_url VARCHAR(500),
    order_index INTEGER,
    estimated_minutes INTEGER,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Practice Questions Table
CREATE TABLE practice_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id UUID REFERENCES learning_modules(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    question_type VARCHAR(50), -- 'multiple-choice', 'code', 'text'
    options JSONB, -- For multiple choice
    correct_answer TEXT,
    explanation TEXT,
    difficulty VARCHAR(50), -- 'easy', 'medium', 'hard'
    points INTEGER DEFAULT 10,
    created_at TIMESTAMP DEFAULT NOW()
);

-- User Learning Progress Table
CREATE TABLE user_learning_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    topic_id UUID REFERENCES learning_topics(id) ON DELETE CASCADE,
    module_id UUID REFERENCES learning_modules(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'not-started', -- 'not-started', 'in-progress', 'completed'
    progress_percentage INTEGER DEFAULT 0,
    time_spent_minutes INTEGER DEFAULT 0,
    last_accessed TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, module_id)
);

-- User Question Attempts Table
CREATE TABLE user_question_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    question_id UUID REFERENCES practice_questions(id) ON DELETE CASCADE,
    user_answer TEXT,
    is_correct BOOLEAN,
    points_earned INTEGER DEFAULT 0,
    attempted_at TIMESTAMP DEFAULT NOW()
);

-- SOP Documents Table
CREATE TABLE sop_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    description TEXT,
    content TEXT, -- Markdown content
    video_url VARCHAR(500),
    flow_diagram_url VARCHAR(500),
    version VARCHAR(50),
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'archived', 'draft'
    created_by UUID,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- SOP User Access Log
CREATE TABLE sop_access_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    sop_id UUID REFERENCES sop_documents(id) ON DELETE CASCADE,
    accessed_at TIMESTAMP DEFAULT NOW(),
    time_spent_minutes INTEGER DEFAULT 0
);

-- Data Vault Resources Table (Enhanced)
CREATE TABLE vault_resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    url VARCHAR(500),
    resource_type VARCHAR(50), -- 'pdf', 'video', 'link', 'learning-module'
    category VARCHAR(100), -- 'programming', 'interview', 'career', 'study', 'tools', 'learning'
    tags TEXT[],
    file_size VARCHAR(50),
    duration VARCHAR(50),
    is_public BOOLEAN DEFAULT false,
    learning_topic_id UUID REFERENCES learning_topics(id), -- Link to learning system
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_learning_progress_user ON user_learning_progress(user_id);
CREATE INDEX idx_learning_progress_topic ON user_learning_progress(topic_id);
CREATE INDEX idx_learning_modules_topic ON learning_modules(topic_id);
CREATE INDEX idx_practice_questions_module ON practice_questions(module_id);
CREATE INDEX idx_vault_resources_user ON vault_resources(user_id);
CREATE INDEX idx_vault_resources_category ON vault_resources(category);
CREATE INDEX idx_sop_category ON sop_documents(category);
