# Role-Based Learning & SOP Hub - Database Schema

## Overview
This schema supports a comprehensive learning management system integrated into Velosify's HR Protocol section.

---

## Tables

### 1. `roles`
Defines organizational roles that employees can be assigned to.

```sql
CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  department VARCHAR(100),
  level VARCHAR(50), -- 'intern', 'junior', 'mid', 'senior', 'manager', 'executive'
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**Indexes:**
- `idx_roles_name` on `name`
- `idx_roles_department` on `department`

---

### 2. `learning_paths`
Structured learning journeys for specific roles.

```sql
CREATE TABLE learning_paths (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  estimated_hours INTEGER, -- Total estimated completion time
  is_mandatory BOOLEAN DEFAULT false,
  is_ai_generated BOOLEAN DEFAULT false,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  version INTEGER DEFAULT 1
);
```

**Indexes:**
- `idx_learning_paths_role` on `role_id`
- `idx_learning_paths_mandatory` on `is_mandatory`

---

### 3. `modules`
Individual learning units that can be reused across paths.

```sql
CREATE TABLE modules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(200) NOT NULL,
  description TEXT,
  module_type VARCHAR(50) NOT NULL, -- 'text', 'pdf', 'video', 'diagram', 'quiz', 'external_link'
  content JSONB, -- Flexible content storage
  estimated_minutes INTEGER,
  difficulty_level VARCHAR(20), -- 'beginner', 'intermediate', 'advanced'
  tags TEXT[], -- For searchability
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true
);
```

**Content JSONB Structure by Type:**

**Text Lesson:**
```json
{
  "body": "Markdown or HTML content",
  "attachments": ["url1", "url2"]
}
```

**PDF:**
```json
{
  "url": "storage_url",
  "filename": "document.pdf",
  "size_bytes": 1024000
}
```

**Video:**
```json
{
  "url": "video_url",
  "duration_seconds": 300,
  "thumbnail": "thumbnail_url",
  "provider": "youtube|vimeo|custom"
}
```

**Flow Diagram:**
```json
{
  "diagram_url": "image_url",
  "interactive_data": {...}, -- For interactive diagrams
  "description": "Diagram explanation"
}
```

**Quiz:**
```json
{
  "questions": [
    {
      "id": "q1",
      "question": "What is...?",
      "type": "multiple_choice|true_false|short_answer",
      "options": ["A", "B", "C", "D"],
      "correct_answer": "B",
      "explanation": "Because..."
    }
  ],
  "passing_score": 80,
  "allow_retries": true,
  "max_attempts": 3
}
```

**External Link:**
```json
{
  "url": "https://example.com",
  "description": "External resource description",
  "estimated_read_time": 10
}
```

**Indexes:**
- `idx_modules_type` on `module_type`
- `idx_modules_tags` on `tags` (GIN index)
- `idx_modules_active` on `is_active`

---

### 4. `path_modules`
Junction table linking modules to learning paths with ordering.

```sql
CREATE TABLE path_modules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  path_id UUID REFERENCES learning_paths(id) ON DELETE CASCADE,
  module_id UUID REFERENCES modules(id) ON DELETE CASCADE,
  sequence_order INTEGER NOT NULL,
  is_required BOOLEAN DEFAULT true,
  unlock_after_module_id UUID REFERENCES modules(id), -- Sequential locking
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(path_id, sequence_order),
  UNIQUE(path_id, module_id)
);
```

**Indexes:**
- `idx_path_modules_path` on `path_id`
- `idx_path_modules_sequence` on `(path_id, sequence_order)`

---

### 5. `sops` (Standard Operating Procedures)
Company SOPs and process documentation.

```sql
CREATE TABLE sops (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(200) NOT NULL,
  sop_code VARCHAR(50) UNIQUE, -- e.g., "SOP-HR-001"
  category VARCHAR(100), -- 'HR', 'Sales', 'Operations', etc.
  description TEXT,
  content JSONB, -- Structured SOP content
  version VARCHAR(20) DEFAULT '1.0',
  status VARCHAR(20) DEFAULT 'draft', -- 'draft', 'active', 'archived'
  applicable_roles UUID[], -- Array of role IDs
  created_by UUID REFERENCES auth.users(id),
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  effective_date DATE,
  review_date DATE
);
```

**Content JSONB Structure:**
```json
{
  "sections": [
    {
      "title": "Purpose",
      "content": "...",
      "order": 1
    },
    {
      "title": "Scope",
      "content": "...",
      "order": 2
    },
    {
      "title": "Procedure",
      "steps": [
        {
          "step_number": 1,
          "description": "...",
          "responsible_role": "role_name",
          "tools_required": ["tool1", "tool2"]
        }
      ],
      "order": 3
    }
  ],
  "attachments": [
    {
      "name": "Form Template",
      "url": "storage_url",
      "type": "pdf"
    }
  ],
  "flowchart_url": "diagram_url",
  "related_sops": ["SOP-HR-002", "SOP-HR-003"]
}
```

**Indexes:**
- `idx_sops_code` on `sop_code`
- `idx_sops_category` on `category`
- `idx_sops_status` on `status`
- `idx_sops_roles` on `applicable_roles` (GIN index)

---

### 6. `user_progress`
Tracks individual user progress through learning paths and modules.

```sql
CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  path_id UUID REFERENCES learning_paths(id) ON DELETE CASCADE,
  module_id UUID REFERENCES modules(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'not_started', -- 'not_started', 'in_progress', 'completed'
  progress_percentage INTEGER DEFAULT 0,
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  time_spent_minutes INTEGER DEFAULT 0,
  quiz_attempts INTEGER DEFAULT 0,
  quiz_best_score INTEGER,
  last_accessed_at TIMESTAMP DEFAULT NOW(),
  notes TEXT, -- User's personal notes
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, path_id, module_id)
);
```

**Indexes:**
- `idx_user_progress_user` on `user_id`
- `idx_user_progress_path` on `path_id`
- `idx_user_progress_status` on `status`
- `idx_user_progress_composite` on `(user_id, path_id, status)`

---

### 7. `learning_assignments`
Assigns learning paths to users (role-based or individual).

```sql
CREATE TABLE learning_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  path_id UUID REFERENCES learning_paths(id) ON DELETE CASCADE,
  assigned_to_user_id UUID REFERENCES auth.users(id), -- NULL if role-based
  assigned_to_role_id UUID REFERENCES roles(id), -- NULL if individual
  assigned_by UUID REFERENCES auth.users(id),
  due_date DATE,
  priority VARCHAR(20) DEFAULT 'medium', -- 'low', 'medium', 'high', 'urgent'
  is_mandatory BOOLEAN DEFAULT false,
  assigned_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  status VARCHAR(20) DEFAULT 'assigned', -- 'assigned', 'in_progress', 'completed', 'overdue'
  CHECK (
    (assigned_to_user_id IS NOT NULL AND assigned_to_role_id IS NULL) OR
    (assigned_to_user_id IS NULL AND assigned_to_role_id IS NOT NULL)
  )
);
```

**Indexes:**
- `idx_assignments_user` on `assigned_to_user_id`
- `idx_assignments_role` on `assigned_to_role_id`
- `idx_assignments_status` on `status`
- `idx_assignments_due` on `due_date`

---

### 8. `sop_interactions`
Tracks user interactions with SOPs for analytics.

```sql
CREATE TABLE sop_interactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  sop_id UUID REFERENCES sops(id) ON DELETE CASCADE,
  interaction_type VARCHAR(50), -- 'viewed', 'downloaded', 'ai_question_asked'
  interaction_data JSONB, -- Additional context
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Indexes:**
- `idx_sop_interactions_user` on `user_id`
- `idx_sop_interactions_sop` on `sop_id`
- `idx_sop_interactions_type` on `interaction_type`

---

### 9. `ai_sop_qa_history`
Stores AI Q&A interactions for SOPs.

```sql
CREATE TABLE ai_sop_qa_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  sop_id UUID REFERENCES sops(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  context_used JSONB, -- Which SOP sections were referenced
  was_helpful BOOLEAN,
  feedback TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Indexes:**
- `idx_ai_qa_user` on `user_id`
- `idx_ai_qa_sop` on `sop_id`
- `idx_ai_qa_created` on `created_at`

---

### 10. `user_roles`
Maps users to their organizational roles.

```sql
CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
  assigned_at TIMESTAMP DEFAULT NOW(),
  assigned_by UUID REFERENCES auth.users(id),
  is_primary BOOLEAN DEFAULT false,
  UNIQUE(user_id, role_id)
);
```

**Indexes:**
- `idx_user_roles_user` on `user_id`
- `idx_user_roles_role` on `role_id`
- `idx_user_roles_primary` on `(user_id, is_primary)`

---

## Row Level Security (RLS) Policies

### For `user_progress`:
```sql
-- Users can view their own progress
CREATE POLICY "Users can view own progress"
  ON user_progress FOR SELECT
  USING (auth.uid() = user_id);

-- Users can update their own progress
CREATE POLICY "Users can update own progress"
  ON user_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- Admins can view all progress
CREATE POLICY "Admins can view all progress"
  ON user_progress FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid()
      AND r.name IN ('Admin', 'HR Manager')
    )
  );
```

### For `sops`:
```sql
-- Users can view SOPs applicable to their role
CREATE POLICY "Users can view role-applicable SOPs"
  ON sops FOR SELECT
  USING (
    status = 'active' AND (
      applicable_roles IS NULL OR
      EXISTS (
        SELECT 1 FROM user_roles ur
        WHERE ur.user_id = auth.uid()
        AND ur.role_id = ANY(applicable_roles)
      )
    )
  );

-- Admins can manage all SOPs
CREATE POLICY "Admins can manage SOPs"
  ON sops FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid()
      AND r.name IN ('Admin', 'HR Manager')
    )
  );
```

---

## Views for Common Queries

### User Learning Dashboard View:
```sql
CREATE VIEW v_user_learning_dashboard AS
SELECT 
  u.id as user_id,
  u.email,
  lp.id as path_id,
  lp.title as path_title,
  lp.estimated_hours,
  COUNT(DISTINCT pm.module_id) as total_modules,
  COUNT(DISTINCT CASE WHEN up.status = 'completed' THEN up.module_id END) as completed_modules,
  ROUND(
    (COUNT(DISTINCT CASE WHEN up.status = 'completed' THEN up.module_id END)::DECIMAL / 
    NULLIF(COUNT(DISTINCT pm.module_id), 0)) * 100, 
    2
  ) as completion_percentage,
  MAX(up.last_accessed_at) as last_accessed,
  la.due_date,
  la.priority,
  la.is_mandatory
FROM auth.users u
JOIN learning_assignments la ON (
  la.assigned_to_user_id = u.id OR 
  la.assigned_to_role_id IN (SELECT role_id FROM user_roles WHERE user_id = u.id)
)
JOIN learning_paths lp ON la.path_id = lp.id
JOIN path_modules pm ON pm.path_id = lp.id
LEFT JOIN user_progress up ON up.user_id = u.id AND up.module_id = pm.module_id
GROUP BY u.id, u.email, lp.id, lp.title, lp.estimated_hours, la.due_date, la.priority, la.is_mandatory;
```

---

## Triggers

### Auto-update `updated_at` timestamp:
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all relevant tables
CREATE TRIGGER update_roles_updated_at BEFORE UPDATE ON roles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_learning_paths_updated_at BEFORE UPDATE ON learning_paths
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ... (apply to other tables)
```

### Auto-calculate path completion:
```sql
CREATE OR REPLACE FUNCTION update_path_completion()
RETURNS TRIGGER AS $$
BEGIN
  -- Update overall path progress when module progress changes
  UPDATE user_progress
  SET progress_percentage = (
    SELECT ROUND(
      (COUNT(CASE WHEN status = 'completed' THEN 1 END)::DECIMAL / 
      COUNT(*)::DECIMAL) * 100
    )
    FROM user_progress
    WHERE user_id = NEW.user_id AND path_id = NEW.path_id
  )
  WHERE user_id = NEW.user_id AND path_id = NEW.path_id AND module_id IS NULL;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_path_completion_trigger
AFTER INSERT OR UPDATE ON user_progress
FOR EACH ROW EXECUTE FUNCTION update_path_completion();
```

---

## Sample Data

### Roles:
```sql
INSERT INTO roles (name, description, department, level) VALUES
('Sales Executive', 'Responsible for client acquisition and revenue generation', 'Sales', 'mid'),
('HR Intern', 'Supports HR operations and recruitment', 'Human Resources', 'intern'),
('Engineering Manager', 'Leads engineering team and technical strategy', 'Engineering', 'manager'),
('Customer Success Specialist', 'Ensures customer satisfaction and retention', 'Customer Success', 'junior');
```

### Sample Learning Path:
```sql
-- Create a learning path for Sales Executive
INSERT INTO learning_paths (role_id, title, description, estimated_hours, is_mandatory)
VALUES (
  (SELECT id FROM roles WHERE name = 'Sales Executive'),
  'Sales Onboarding Bootcamp',
  'Complete onboarding program for new sales executives covering CRM, sales process, and product knowledge',
  40,
  true
);
```

---

## Migration Strategy

1. **Phase 1**: Create core tables (roles, learning_paths, modules, path_modules)
2. **Phase 2**: Add user tracking (user_progress, learning_assignments, user_roles)
3. **Phase 3**: Implement SOP system (sops, sop_interactions, ai_sop_qa_history)
4. **Phase 4**: Add RLS policies and views
5. **Phase 5**: Create triggers and functions
6. **Phase 6**: Seed initial data

---

## Performance Considerations

- Use materialized views for complex analytics queries
- Implement pagination for large result sets
- Cache frequently accessed SOPs
- Index foreign keys and commonly queried columns
- Consider partitioning `user_progress` by date for large datasets

---

## Future Enhancements

- Learning path versioning and migration
- Skill taxonomy and competency mapping
- Peer learning and mentorship tracking
- Certification and badge system
- Integration with performance reviews
- Mobile app sync support
