# Role-Based Learning & SOP Hub - API Documentation

## Base URL
```
/api/v1/hr-learning
```

---

## Authentication
All endpoints require authentication via Supabase JWT token in the `Authorization` header:
```
Authorization: Bearer <jwt_token>
```

---

## API Endpoints

### 1. Learning Paths

#### GET `/learning-paths`
Get all learning paths for the current user based on their role(s).

**Query Parameters:**
- `status` (optional): Filter by status (`assigned`, `in_progress`, `completed`)
- `mandatory` (optional): Filter mandatory paths (`true`/`false`)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Sales Onboarding Bootcamp",
      "description": "Complete onboarding program...",
      "estimated_hours": 40,
      "is_mandatory": true,
      "role": {
        "id": "uuid",
        "name": "Sales Executive"
      },
      "progress": {
        "total_modules": 12,
        "completed_modules": 5,
        "completion_percentage": 41.67,
        "last_accessed": "2026-02-06T10:30:00Z"
      },
      "assignment": {
        "due_date": "2026-03-01",
        "priority": "high",
        "assigned_at": "2026-02-01T09:00:00Z"
      }
    }
  ]
}
```

---

#### GET `/learning-paths/:pathId`
Get detailed information about a specific learning path including all modules.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Sales Onboarding Bootcamp",
    "description": "...",
    "estimated_hours": 40,
    "modules": [
      {
        "id": "uuid",
        "title": "Introduction to CRM",
        "description": "Learn the basics of our CRM system",
        "module_type": "video",
        "estimated_minutes": 30,
        "sequence_order": 1,
        "is_required": true,
        "is_locked": false,
        "user_progress": {
          "status": "completed",
          "progress_percentage": 100,
          "completed_at": "2026-02-03T14:20:00Z",
          "time_spent_minutes": 35
        }
      },
      {
        "id": "uuid",
        "title": "Sales Process Overview",
        "description": "Understand our 5-step sales process",
        "module_type": "text",
        "estimated_minutes": 45,
        "sequence_order": 2,
        "is_required": true,
        "is_locked": false,
        "user_progress": {
          "status": "in_progress",
          "progress_percentage": 60,
          "started_at": "2026-02-04T09:00:00Z"
        }
      },
      {
        "id": "uuid",
        "title": "Product Knowledge Quiz",
        "description": "Test your product knowledge",
        "module_type": "quiz",
        "estimated_minutes": 20,
        "sequence_order": 3,
        "is_required": true,
        "is_locked": true,
        "unlock_after": {
          "module_id": "uuid",
          "module_title": "Sales Process Overview"
        }
      }
    ]
  }
}
```

---

#### POST `/learning-paths` (Admin only)
Create a new learning path.

**Request Body:**
```json
{
  "role_id": "uuid",
  "title": "Customer Success Onboarding",
  "description": "Complete onboarding for CS team",
  "estimated_hours": 30,
  "is_mandatory": true,
  "modules": [
    {
      "module_id": "uuid",
      "sequence_order": 1,
      "is_required": true
    },
    {
      "module_id": "uuid",
      "sequence_order": 2,
      "is_required": true,
      "unlock_after_module_id": "uuid"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Customer Success Onboarding",
    "created_at": "2026-02-06T15:30:00Z"
  }
}
```

---

#### POST `/learning-paths/ai-generate` (Admin only)
Generate a learning path using AI based on role requirements.

**Request Body:**
```json
{
  "role_id": "uuid",
  "focus_areas": ["product_knowledge", "customer_communication", "tools_training"],
  "difficulty_level": "beginner",
  "estimated_hours": 40
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "AI-Generated: Customer Success Specialist Path",
    "description": "Comprehensive learning path generated based on role requirements",
    "is_ai_generated": true,
    "modules": [
      {
        "title": "Product Overview",
        "module_type": "video",
        "estimated_minutes": 30,
        "sequence_order": 1,
        "ai_rationale": "Essential foundation for customer interactions"
      }
    ]
  }
}
```

---

### 2. Modules

#### GET `/modules/:moduleId`
Get detailed module content.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Introduction to CRM",
    "description": "Learn the basics...",
    "module_type": "video",
    "content": {
      "url": "https://storage.example.com/videos/crm-intro.mp4",
      "duration_seconds": 1800,
      "thumbnail": "https://storage.example.com/thumbnails/crm.jpg",
      "provider": "custom"
    },
    "estimated_minutes": 30,
    "difficulty_level": "beginner",
    "tags": ["crm", "sales", "tools"],
    "user_progress": {
      "status": "in_progress",
      "progress_percentage": 45,
      "time_spent_minutes": 15,
      "notes": "Important: Remember to update contact fields"
    }
  }
}
```

---

#### POST `/modules` (Admin only)
Create a new learning module.

**Request Body:**
```json
{
  "title": "Email Etiquette Best Practices",
  "description": "Learn professional email communication",
  "module_type": "text",
  "content": {
    "body": "# Email Etiquette\n\n## Key Points\n...",
    "attachments": ["https://example.com/template.pdf"]
  },
  "estimated_minutes": 20,
  "difficulty_level": "beginner",
  "tags": ["communication", "soft_skills"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Email Etiquette Best Practices",
    "created_at": "2026-02-06T16:00:00Z"
  }
}
```

---

#### PUT `/modules/:moduleId` (Admin only)
Update an existing module.

**Request Body:** (Same as POST, all fields optional)

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "updated_at": "2026-02-06T16:15:00Z",
    "version": 2
  }
}
```

---

### 3. User Progress

#### POST `/progress/:moduleId/start`
Mark a module as started.

**Response:**
```json
{
  "success": true,
  "data": {
    "module_id": "uuid",
    "status": "in_progress",
    "started_at": "2026-02-06T16:30:00Z"
  }
}
```

---

#### PUT `/progress/:moduleId/update`
Update progress for a module.

**Request Body:**
```json
{
  "progress_percentage": 75,
  "time_spent_minutes": 22,
  "notes": "Completed sections 1-3"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "module_id": "uuid",
    "status": "in_progress",
    "progress_percentage": 75,
    "time_spent_minutes": 22
  }
}
```

---

#### POST `/progress/:moduleId/complete`
Mark a module as completed.

**Request Body:**
```json
{
  "time_spent_minutes": 30,
  "quiz_score": 85  // Optional, for quiz modules
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "module_id": "uuid",
    "status": "completed",
    "completed_at": "2026-02-06T17:00:00Z",
    "quiz_score": 85,
    "next_module": {
      "id": "uuid",
      "title": "Next Module Title",
      "is_unlocked": true
    }
  }
}
```

---

#### POST `/progress/quiz/:moduleId/submit`
Submit quiz answers.

**Request Body:**
```json
{
  "answers": [
    {
      "question_id": "q1",
      "answer": "B"
    },
    {
      "question_id": "q2",
      "answer": "True"
    }
  ],
  "time_spent_minutes": 15
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "score": 85,
    "passing_score": 80,
    "passed": true,
    "total_questions": 10,
    "correct_answers": 8,
    "incorrect_answers": 2,
    "attempt_number": 1,
    "can_retry": true,
    "feedback": [
      {
        "question_id": "q1",
        "is_correct": true,
        "explanation": "Correct! Because..."
      },
      {
        "question_id": "q3",
        "is_correct": false,
        "correct_answer": "C",
        "explanation": "The correct answer is C because..."
      }
    ]
  }
}
```

---

### 4. SOPs (Standard Operating Procedures)

#### GET `/sops`
Get all SOPs applicable to the current user's role(s).

**Query Parameters:**
- `category` (optional): Filter by category
- `search` (optional): Search in title and description
- `status` (optional): Filter by status (default: `active`)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Employee Onboarding Process",
      "sop_code": "SOP-HR-001",
      "category": "HR",
      "description": "Standard process for onboarding new employees",
      "version": "2.1",
      "status": "active",
      "effective_date": "2026-01-01",
      "review_date": "2026-07-01",
      "last_viewed_at": "2026-02-05T10:00:00Z"
    }
  ]
}
```

---

#### GET `/sops/:sopId`
Get detailed SOP content.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Employee Onboarding Process",
    "sop_code": "SOP-HR-001",
    "category": "HR",
    "description": "...",
    "content": {
      "sections": [
        {
          "title": "Purpose",
          "content": "This SOP defines the standard process...",
          "order": 1
        },
        {
          "title": "Procedure",
          "steps": [
            {
              "step_number": 1,
              "description": "Prepare workstation and access credentials",
              "responsible_role": "IT Admin",
              "tools_required": ["Active Directory", "Email System"]
            }
          ],
          "order": 3
        }
      ],
      "attachments": [
        {
          "name": "Onboarding Checklist",
          "url": "https://storage.example.com/checklist.pdf",
          "type": "pdf"
        }
      ],
      "flowchart_url": "https://storage.example.com/flowchart.png",
      "related_sops": ["SOP-HR-002", "SOP-IT-005"]
    },
    "version": "2.1",
    "approved_by": {
      "name": "John Doe",
      "role": "HR Director",
      "approved_at": "2025-12-15T14:00:00Z"
    }
  }
}
```

---

#### POST `/sops/:sopId/ask-ai`
Ask AI a question about a specific SOP.

**Request Body:**
```json
{
  "question": "What are the key steps I must follow in the onboarding process?"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "question": "What are the key steps I must follow in the onboarding process?",
    "answer": "Based on SOP-HR-001, the key steps are:\n\n1. **Day 1**: Prepare workstation and credentials (IT Admin)\n2. **Week 1**: Complete orientation and compliance training\n3. **Week 2**: Shadow team members and learn tools\n4. **Week 3**: Begin supervised tasks\n5. **Week 4**: First performance check-in\n\nEach step has specific deliverables outlined in the full SOP.",
    "context_used": {
      "sections": ["Procedure", "Timeline"],
      "confidence": "high"
    },
    "related_questions": [
      "Who is responsible for each step?",
      "What tools do I need access to?",
      "What are common mistakes to avoid?"
    ]
  }
}
```

---

#### POST `/sops/:sopId/interaction`
Track SOP interaction (view, download, etc.).

**Request Body:**
```json
{
  "interaction_type": "viewed",
  "interaction_data": {
    "section_viewed": "Procedure",
    "time_spent_seconds": 180
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Interaction recorded"
}
```

---

### 5. Assignments

#### GET `/assignments`
Get all learning assignments for the current user.

**Query Parameters:**
- `status` (optional): Filter by status
- `priority` (optional): Filter by priority

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "learning_path": {
        "id": "uuid",
        "title": "Sales Onboarding Bootcamp"
      },
      "assigned_by": {
        "name": "Jane Smith",
        "role": "HR Manager"
      },
      "due_date": "2026-03-01",
      "priority": "high",
      "is_mandatory": true,
      "assigned_at": "2026-02-01T09:00:00Z",
      "status": "in_progress",
      "progress": {
        "completion_percentage": 41.67,
        "estimated_time_remaining_hours": 23
      }
    }
  ]
}
```

---

#### POST `/assignments` (Admin/Manager only)
Assign a learning path to user(s) or role(s).

**Request Body:**
```json
{
  "path_id": "uuid",
  "assign_to": {
    "type": "role",  // or "user"
    "id": "uuid"     // role_id or user_id
  },
  "due_date": "2026-03-15",
  "priority": "high",
  "is_mandatory": true,
  "notification": {
    "send_email": true,
    "custom_message": "Please complete this training by the due date."
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "assignment_id": "uuid",
    "assigned_to_count": 15,  // Number of users affected
    "created_at": "2026-02-06T18:00:00Z"
  }
}
```

---

### 6. Analytics & Reporting

#### GET `/analytics/user-dashboard`
Get personalized learning analytics for the current user.

**Response:**
```json
{
  "success": true,
  "data": {
    "overview": {
      "total_paths_assigned": 3,
      "paths_in_progress": 2,
      "paths_completed": 1,
      "total_modules_completed": 25,
      "total_learning_hours": 42,
      "current_streak_days": 7
    },
    "recent_activity": [
      {
        "type": "module_completed",
        "module_title": "CRM Advanced Features",
        "path_title": "Sales Onboarding Bootcamp",
        "completed_at": "2026-02-06T14:30:00Z"
      }
    ],
    "upcoming_deadlines": [
      {
        "path_title": "Sales Onboarding Bootcamp",
        "due_date": "2026-03-01",
        "days_remaining": 23,
        "completion_percentage": 41.67
      }
    ],
    "recommended_next": {
      "module_id": "uuid",
      "title": "Sales Objection Handling",
      "estimated_minutes": 45,
      "path_title": "Sales Onboarding Bootcamp"
    }
  }
}
```

---

#### GET `/analytics/admin-overview` (Admin only)
Get organization-wide learning analytics.

**Query Parameters:**
- `role_id` (optional): Filter by role
- `date_from` (optional): Start date for analytics
- `date_to` (optional): End date for analytics

**Response:**
```json
{
  "success": true,
  "data": {
    "overview": {
      "total_active_learners": 150,
      "total_paths_assigned": 12,
      "total_modules_created": 85,
      "average_completion_rate": 67.5,
      "total_learning_hours": 3240
    },
    "by_role": [
      {
        "role_name": "Sales Executive",
        "total_users": 25,
        "average_completion": 72.3,
        "at_risk_count": 3
      }
    ],
    "completion_trends": [
      {
        "date": "2026-02-01",
        "completions": 45
      }
    ],
    "top_performers": [
      {
        "user_name": "Alice Johnson",
        "role": "Sales Executive",
        "completion_rate": 95,
        "modules_completed": 18
      }
    ],
    "at_risk_learners": [
      {
        "user_name": "Bob Smith",
        "role": "Customer Success",
        "completion_rate": 15,
        "overdue_assignments": 2
      }
    ]
  }
}
```

---

## Error Responses

All endpoints return errors in the following format:

```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "You do not have permission to access this resource",
    "details": {}
  }
}
```

**Common Error Codes:**
- `UNAUTHORIZED` (401): Authentication required or invalid token
- `FORBIDDEN` (403): Insufficient permissions
- `NOT_FOUND` (404): Resource not found
- `VALIDATION_ERROR` (400): Invalid request data
- `CONFLICT` (409): Resource conflict (e.g., duplicate entry)
- `INTERNAL_ERROR` (500): Server error

---

## Rate Limiting

- **Standard endpoints**: 100 requests per minute per user
- **AI endpoints**: 20 requests per minute per user
- **Admin endpoints**: 200 requests per minute per user

Rate limit headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1675789200
```

---

## Webhooks (Future Enhancement)

Webhook events for external integrations:
- `learning_path.assigned`
- `module.completed`
- `quiz.passed`
- `quiz.failed`
- `path.completed`
- `assignment.overdue`

---

## AI Prompt Templates

### SOP Explanation Prompt:
```
You are an AI assistant helping employees understand company SOPs.

Context:
- SOP Title: {sop_title}
- SOP Code: {sop_code}
- User Role: {user_role}
- SOP Content: {sop_content}

User Question: {user_question}

Instructions:
1. Answer ONLY based on the provided SOP content
2. If information is missing, clearly state: "This information is not covered in this SOP"
3. Use simple, role-appropriate language
4. Highlight key action items
5. Mention responsible roles when relevant
6. Keep explanations concise (max 200 words)

Answer:
```

### Learning Path Generation Prompt:
```
You are an AI learning path designer for corporate training.

Task: Create a comprehensive learning path for the role: {role_name}

Role Details:
- Department: {department}
- Level: {level}
- Key Responsibilities: {responsibilities}

Requirements:
- Focus Areas: {focus_areas}
- Difficulty Level: {difficulty_level}
- Target Duration: {estimated_hours} hours
- Must include: {required_topics}

Generate a structured learning path with:
1. Path title and description
2. 8-12 modules in logical sequence
3. Mix of content types (text, video, quiz)
4. Estimated time for each module
5. Clear learning objectives
6. Prerequisites and dependencies

Output Format: JSON
```

---

## Implementation Notes

1. **Caching Strategy**:
   - Cache SOP content for 1 hour
   - Cache user progress for 5 minutes
   - Invalidate on updates

2. **Pagination**:
   - Default page size: 20
   - Max page size: 100
   - Use cursor-based pagination for large datasets

3. **File Uploads**:
   - Max file size: 50MB
   - Supported formats: PDF, MP4, PNG, JPG, SVG
   - Use Supabase Storage with signed URLs

4. **Real-time Updates**:
   - Use Supabase Realtime for progress updates
   - Subscribe to `user_progress` changes
   - Broadcast completion events

5. **Search**:
   - Implement full-text search on modules and SOPs
   - Use PostgreSQL `tsvector` for performance
   - Support fuzzy matching for typos
