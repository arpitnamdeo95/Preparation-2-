// Velosify Learning System - Backend API Endpoints
// Express.js + PostgreSQL implementation

const express = require('express');
const router = express.Router();

// ============================================
// LEARNING TOPICS ENDPOINTS
// ============================================

/**
 * GET /api/learning/topics
 * Get all learning topics with optional filtering
 */
router.get('/topics', async (req, res) => {
    try {
        const { category, difficulty } = req.query;

        let query = `
            SELECT t.*, 
                   COUNT(DISTINCT m.id) as module_count,
                   AVG(up.progress_percentage) as avg_progress
            FROM learning_topics t
            LEFT JOIN learning_modules m ON t.id = m.topic_id
            LEFT JOIN user_learning_progress up ON t.id = up.topic_id AND up.user_id = $1
            WHERE 1=1
        `;

        const params = [req.user.id];

        if (category) {
            query += ` AND t.category = $${params.length + 1}`;
            params.push(category);
        }

        if (difficulty) {
            query += ` AND t.difficulty = $${params.length + 1}`;
            params.push(difficulty);
        }

        query += ` GROUP BY t.id ORDER BY t.order_index`;

        const result = await db.query(query, params);

        res.json({
            success: true,
            data: result.rows
        });
    } catch (error) {
        console.error('Error fetching topics:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch learning topics'
        });
    }
});

/**
 * GET /api/learning/topics/:topicId
 * Get single topic with all modules
 */
router.get('/topics/:topicId', async (req, res) => {
    try {
        const { topicId } = req.params;
        const userId = req.user.id;

        // Get topic details
        const topicQuery = `
            SELECT * FROM learning_topics WHERE id = $1
        `;
        const topicResult = await db.query(topicQuery, [topicId]);

        if (topicResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Topic not found'
            });
        }

        // Get modules with progress
        const modulesQuery = `
            SELECT m.*,
                   up.status,
                   up.progress_percentage,
                   up.time_spent_minutes,
                   up.last_accessed,
                   up.completed_at,
                   COUNT(pq.id) as question_count
            FROM learning_modules m
            LEFT JOIN user_learning_progress up ON m.id = up.module_id AND up.user_id = $1
            LEFT JOIN practice_questions pq ON m.id = pq.module_id
            WHERE m.topic_id = $2
            GROUP BY m.id, up.status, up.progress_percentage, up.time_spent_minutes, up.last_accessed, up.completed_at
            ORDER BY m.order_index
        `;
        const modulesResult = await db.query(modulesQuery, [userId, topicId]);

        res.json({
            success: true,
            data: {
                topic: topicResult.rows[0],
                modules: modulesResult.rows
            }
        });
    } catch (error) {
        console.error('Error fetching topic:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch topic details'
        });
    }
});

// ============================================
// LEARNING MODULES ENDPOINTS
// ============================================

/**
 * GET /api/learning/modules/:moduleId
 * Get module content and questions
 */
router.get('/modules/:moduleId', async (req, res) => {
    try {
        const { moduleId } = req.params;
        const userId = req.user.id;

        // Get module content
        const moduleQuery = `
            SELECT m.*,
                   t.title as topic_title,
                   up.status,
                   up.progress_percentage,
                   up.time_spent_minutes
            FROM learning_modules m
            JOIN learning_topics t ON m.topic_id = t.id
            LEFT JOIN user_learning_progress up ON m.id = up.module_id AND up.user_id = $1
            WHERE m.id = $2
        `;
        const moduleResult = await db.query(moduleQuery, [userId, moduleId]);

        if (moduleResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Module not found'
            });
        }

        // Get practice questions
        const questionsQuery = `
            SELECT pq.*,
                   uqa.is_correct,
                   uqa.attempted_at
            FROM practice_questions pq
            LEFT JOIN user_question_attempts uqa ON pq.id = uqa.question_id AND uqa.user_id = $1
            WHERE pq.module_id = $2
            ORDER BY pq.difficulty, pq.id
        `;
        const questionsResult = await db.query(questionsQuery, [userId, moduleId]);

        // Update last accessed time
        await db.query(`
            INSERT INTO user_learning_progress (user_id, topic_id, module_id, last_accessed)
            VALUES ($1, (SELECT topic_id FROM learning_modules WHERE id = $2), $2, NOW())
            ON CONFLICT (user_id, module_id)
            DO UPDATE SET last_accessed = NOW()
        `, [userId, moduleId]);

        res.json({
            success: true,
            data: {
                module: moduleResult.rows[0],
                questions: questionsResult.rows
            }
        });
    } catch (error) {
        console.error('Error fetching module:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch module details'
        });
    }
});

// ============================================
// PROGRESS TRACKING ENDPOINTS
// ============================================

/**
 * POST /api/learning/progress
 * Update user progress for a module
 */
router.post('/progress', async (req, res) => {
    try {
        const { moduleId, status, progressPercentage, timeSpentMinutes } = req.body;
        const userId = req.user.id;

        const query = `
            INSERT INTO user_learning_progress 
            (user_id, topic_id, module_id, status, progress_percentage, time_spent_minutes, last_accessed)
            VALUES (
                $1,
                (SELECT topic_id FROM learning_modules WHERE id = $2),
                $2,
                $3,
                $4,
                $5,
                NOW()
            )
            ON CONFLICT (user_id, module_id)
            DO UPDATE SET
                status = $3,
                progress_percentage = $4,
                time_spent_minutes = user_learning_progress.time_spent_minutes + $5,
                last_accessed = NOW(),
                completed_at = CASE WHEN $3 = 'completed' THEN NOW() ELSE user_learning_progress.completed_at END,
                updated_at = NOW()
            RETURNING *
        `;

        const result = await db.query(query, [
            userId,
            moduleId,
            status,
            progressPercentage,
            timeSpentMinutes
        ]);

        res.json({
            success: true,
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Error updating progress:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update progress'
        });
    }
});

/**
 * GET /api/learning/progress/summary
 * Get user's overall learning progress
 */
router.get('/progress/summary', async (req, res) => {
    try {
        const userId = req.user.id;

        const query = `
            SELECT 
                COUNT(DISTINCT topic_id) as topics_started,
                COUNT(DISTINCT CASE WHEN status = 'completed' THEN topic_id END) as topics_completed,
                COUNT(DISTINCT module_id) as modules_started,
                COUNT(DISTINCT CASE WHEN status = 'completed' THEN module_id END) as modules_completed,
                SUM(time_spent_minutes) as total_time_minutes,
                AVG(progress_percentage) as avg_progress
            FROM user_learning_progress
            WHERE user_id = $1
        `;

        const result = await db.query(query, [userId]);

        // Get recent activity
        const recentQuery = `
            SELECT 
                up.*,
                t.title as topic_title,
                m.title as module_title
            FROM user_learning_progress up
            JOIN learning_topics t ON up.topic_id = t.id
            JOIN learning_modules m ON up.module_id = m.id
            WHERE up.user_id = $1
            ORDER BY up.last_accessed DESC
            LIMIT 5
        `;

        const recentResult = await db.query(recentQuery, [userId]);

        res.json({
            success: true,
            data: {
                summary: result.rows[0],
                recentActivity: recentResult.rows
            }
        });
    } catch (error) {
        console.error('Error fetching progress summary:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch progress summary'
        });
    }
});

// ============================================
// PRACTICE QUESTIONS ENDPOINTS
// ============================================

/**
 * POST /api/learning/questions/:questionId/attempt
 * Submit answer to practice question
 */
router.post('/questions/:questionId/attempt', async (req, res) => {
    try {
        const { questionId } = req.params;
        const { userAnswer } = req.body;
        const userId = req.user.id;

        // Get question details
        const questionQuery = `
            SELECT * FROM practice_questions WHERE id = $1
        `;
        const questionResult = await db.query(questionQuery, [questionId]);

        if (questionResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Question not found'
            });
        }

        const question = questionResult.rows[0];

        // Check if answer is correct
        const isCorrect = userAnswer.trim().toLowerCase() === question.correct_answer.trim().toLowerCase();
        const pointsEarned = isCorrect ? question.points : 0;

        // Record attempt
        const attemptQuery = `
            INSERT INTO user_question_attempts 
            (user_id, question_id, user_answer, is_correct, points_earned)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `;

        const attemptResult = await db.query(attemptQuery, [
            userId,
            questionId,
            userAnswer,
            isCorrect,
            pointsEarned
        ]);

        res.json({
            success: true,
            data: {
                attempt: attemptResult.rows[0],
                isCorrect,
                pointsEarned,
                correctAnswer: question.correct_answer,
                explanation: question.explanation
            }
        });
    } catch (error) {
        console.error('Error submitting answer:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to submit answer'
        });
    }
});

/**
 * GET /api/learning/questions/stats
 * Get user's question attempt statistics
 */
router.get('/questions/stats', async (req, res) => {
    try {
        const userId = req.user.id;

        const query = `
            SELECT 
                COUNT(*) as total_attempts,
                COUNT(CASE WHEN is_correct THEN 1 END) as correct_answers,
                SUM(points_earned) as total_points,
                ROUND(AVG(CASE WHEN is_correct THEN 100 ELSE 0 END), 2) as accuracy_percentage
            FROM user_question_attempts
            WHERE user_id = $1
        `;

        const result = await db.query(query, [userId]);

        res.json({
            success: true,
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Error fetching question stats:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch question statistics'
        });
    }
});

// ============================================
// SOP ENDPOINTS
// ============================================

/**
 * GET /api/sop/documents
 * Get all SOP documents
 */
router.get('/sop/documents', async (req, res) => {
    try {
        const { category, status = 'active' } = req.query;

        let query = `
            SELECT * FROM sop_documents
            WHERE status = $1
        `;

        const params = [status];

        if (category) {
            query += ` AND category = $${params.length + 1}`;
            params.push(category);
        }

        query += ` ORDER BY title`;

        const result = await db.query(query, params);

        res.json({
            success: true,
            data: result.rows
        });
    } catch (error) {
        console.error('Error fetching SOPs:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch SOP documents'
        });
    }
});

/**
 * GET /api/sop/documents/:sopId
 * Get single SOP document
 */
router.get('/sop/documents/:sopId', async (req, res) => {
    try {
        const { sopId } = req.params;
        const userId = req.user.id;

        const query = `
            SELECT * FROM sop_documents WHERE id = $1
        `;

        const result = await db.query(query, [sopId]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'SOP not found'
            });
        }

        // Log access
        await db.query(`
            INSERT INTO sop_access_log (user_id, sop_id)
            VALUES ($1, $2)
        `, [userId, sopId]);

        res.json({
            success: true,
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Error fetching SOP:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch SOP document'
        });
    }
});

/**
 * POST /api/sop/ai-query
 * Ask AI question about SOP
 */
router.post('/sop/ai-query', async (req, res) => {
    try {
        const { sopId, question } = req.body;

        // Get SOP content
        const sopQuery = `
            SELECT content FROM sop_documents WHERE id = $1
        `;
        const sopResult = await db.query(sopQuery, [sopId]);

        if (sopResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'SOP not found'
            });
        }

        const sopContent = sopResult.rows[0].content;

        // TODO: Integrate with AI service (OpenAI, etc.)
        // For now, return a placeholder response
        const aiResponse = `Based on the SOP content, here's the answer to your question: "${question}"...`;

        res.json({
            success: true,
            data: {
                question,
                answer: aiResponse
            }
        });
    } catch (error) {
        console.error('Error processing AI query:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to process AI query'
        });
    }
});

// ============================================
// DATA VAULT ENDPOINTS
// ============================================

/**
 * GET /api/vault/resources
 * Get user's vault resources with learning content
 */
router.get('/vault/resources', async (req, res) => {
    try {
        const userId = req.user.id;
        const { category, search } = req.query;

        let query = `
            SELECT vr.*,
                   lt.title as learning_topic_title,
                   lt.description as learning_topic_description
            FROM vault_resources vr
            LEFT JOIN learning_topics lt ON vr.learning_topic_id = lt.id
            WHERE vr.user_id = $1 OR vr.is_public = true
        `;

        const params = [userId];

        if (category) {
            query += ` AND vr.category = $${params.length + 1}`;
            params.push(category);
        }

        if (search) {
            query += ` AND (vr.title ILIKE $${params.length + 1} OR vr.description ILIKE $${params.length + 1})`;
            params.push(`%${search}%`);
        }

        query += ` ORDER BY vr.created_at DESC`;

        const result = await db.query(query, params);

        res.json({
            success: true,
            data: result.rows
        });
    } catch (error) {
        console.error('Error fetching vault resources:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch vault resources'
        });
    }
});

/**
 * POST /api/vault/resources
 * Add resource to vault
 */
router.post('/vault/resources', async (req, res) => {
    try {
        const userId = req.user.id;
        const { title, description, url, resourceType, category, tags, learningTopicId } = req.body;

        const query = `
            INSERT INTO vault_resources
            (user_id, title, description, url, resource_type, category, tags, learning_topic_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *
        `;

        const result = await db.query(query, [
            userId,
            title,
            description,
            url,
            resourceType,
            category,
            tags,
            learningTopicId
        ]);

        res.json({
            success: true,
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Error adding vault resource:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to add vault resource'
        });
    }
});

module.exports = router;
