// Additional Learning Topics for Velosify

export const ADDITIONAL_LEARNING_TOPICS = [
    {
        id: 'html-css-fundamentals',
        title: 'HTML & CSS Fundamentals',
        description: 'Master the building blocks of web development',
        category: 'technical',
        difficulty: 'beginner',
        estimatedHours: 30,
        icon: 'layout',
        modules: [
            {
                id: 'html-basics',
                title: 'HTML Basics',
                description: 'Learn HTML structure, tags, and semantic markup',
                content: `# HTML Fundamentals

## What is HTML?
HTML (HyperText Markup Language) is the standard markup language for creating web pages.

## Basic Structure
\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Page</title>
</head>
<body>
    <h1>Hello World</h1>
    <p>This is a paragraph.</p>
</body>
</html>
\`\`\`

## Common HTML Tags
- **Headings**: \`<h1>\` to \`<h6>\`
- **Paragraph**: \`<p>\`
- **Links**: \`<a href="url">Link</a>\`
- **Images**: \`<img src="image.jpg" alt="Description">\`
- **Lists**: \`<ul>\`, \`<ol>\`, \`<li>\`
- **Div**: \`<div>\` (container)
- **Span**: \`<span>\` (inline container)

## Semantic HTML
\`\`\`html
<header>Site Header</header>
<nav>Navigation</nav>
<main>
    <article>
        <h2>Article Title</h2>
        <p>Content...</p>
    </article>
    <aside>Sidebar</aside>
</main>
<footer>Site Footer</footer>
\`\`\`

## Forms
\`\`\`html
<form action="/submit" method="POST">
    <label for="name">Name:</label>
    <input type="text" id="name" name="name" required>
    
    <label for="email">Email:</label>
    <input type="email" id="email" name="email" required>
    
    <button type="submit">Submit</button>
</form>
\`\`\`
`,
                videoUrl: 'https://www.youtube.com/watch?v=UB1O30fR-EE',
                estimatedMinutes: 90,
                questions: [
                    {
                        question: 'What does HTML stand for?',
                        type: 'multiple-choice',
                        options: ['Hyper Text Markup Language', 'High Tech Modern Language', 'Home Tool Markup Language', 'Hyperlinks and Text Markup Language'],
                        correctAnswer: 'Hyper Text Markup Language',
                        difficulty: 'easy'
                    },
                    {
                        question: 'Which tag is used for the largest heading?',
                        type: 'multiple-choice',
                        options: ['<h6>', '<h1>', '<heading>', '<head>'],
                        correctAnswer: '<h1>',
                        difficulty: 'easy'
                    }
                ]
            },
            {
                id: 'css-basics',
                title: 'CSS Basics',
                description: 'Style your web pages with CSS',
                content: `# CSS Fundamentals

## What is CSS?
CSS (Cascading Style Sheets) is used to style and layout web pages.

## CSS Syntax
\`\`\`css
selector {
    property: value;
}
\`\`\`

## Adding CSS to HTML
### Inline CSS
\`\`\`html
<p style="color: blue;">Blue text</p>
\`\`\`

### Internal CSS
\`\`\`html
<head>
    <style>
        p { color: blue; }
    </style>
</head>
\`\`\`

### External CSS
\`\`\`html
<head>
    <link rel="stylesheet" href="styles.css">
</head>
\`\`\`

## Selectors
\`\`\`css
/* Element selector */
p { color: blue; }

/* Class selector */
.highlight { background: yellow; }

/* ID selector */
#header { font-size: 24px; }

/* Descendant selector */
div p { margin: 10px; }

/* Multiple selectors */
h1, h2, h3 { font-family: Arial; }
\`\`\`

## Common Properties
\`\`\`css
/* Text */
color: #333;
font-size: 16px;
font-weight: bold;
text-align: center;

/* Box Model */
width: 300px;
height: 200px;
padding: 20px;
margin: 10px;
border: 1px solid #ccc;

/* Background */
background-color: #f0f0f0;
background-image: url('image.jpg');

/* Display */
display: block;
display: inline;
display: flex;
display: grid;
\`\`\`

## Flexbox
\`\`\`css
.container {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
}
\`\`\`

## Grid
\`\`\`css
.grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
}
\`\`\`

## Responsive Design
\`\`\`css
/* Mobile first */
.container {
    width: 100%;
}

/* Tablet */
@media (min-width: 768px) {
    .container {
        width: 750px;
    }
}

/* Desktop */
@media (min-width: 1024px) {
    .container {
        width: 1000px;
    }
}
\`\`\`
`,
                videoUrl: 'https://www.youtube.com/watch?v=1Rs2ND1ryYc',
                estimatedMinutes: 120,
                questions: [
                    {
                        question: 'Which property is used to change text color?',
                        type: 'multiple-choice',
                        options: ['text-color', 'color', 'font-color', 'text-style'],
                        correctAnswer: 'color',
                        difficulty: 'easy'
                    },
                    {
                        question: 'What does CSS stand for?',
                        type: 'multiple-choice',
                        options: ['Cascading Style Sheets', 'Computer Style Sheets', 'Creative Style Sheets', 'Colorful Style Sheets'],
                        correctAnswer: 'Cascading Style Sheets',
                        difficulty: 'easy'
                    }
                ]
            }
        ]
    },
    {
        id: 'react-basics',
        title: 'React Basics',
        description: 'Build modern user interfaces with React',
        category: 'technical',
        difficulty: 'intermediate',
        estimatedHours: 35,
        icon: 'zap',
        modules: [
            {
                id: 'react-intro',
                title: 'Introduction to React',
                description: 'Understanding React and component-based architecture',
                content: `# Introduction to React

## What is React?
React is a JavaScript library for building user interfaces, particularly single-page applications.

## Key Concepts
- **Components**: Reusable UI pieces
- **JSX**: JavaScript XML syntax
- **Virtual DOM**: Efficient rendering
- **One-way data flow**: Predictable state management

## Creating a Component
\`\`\`jsx
function Welcome(props) {
    return <h1>Hello, {props.name}!</h1>;
}

// Usage
<Welcome name="Alice" />
\`\`\`

## JSX Syntax
\`\`\`jsx
const element = (
    <div className="container">
        <h1>Hello World</h1>
        <p>This is JSX</p>
    </div>
);
\`\`\`

## Props
\`\`\`jsx
function UserCard({name, age, email}) {
    return (
        <div className="card">
            <h2>{name}</h2>
            <p>Age: {age}</p>
            <p>Email: {email}</p>
        </div>
    );
}
\`\`\`

## State with useState
\`\`\`jsx
import { useState } from 'react';

function Counter() {
    const [count, setCount] = useState(0);
    
    return (
        <div>
            <p>Count: {count}</p>
            <button onClick={() => setCount(count + 1)}>
                Increment
            </button>
        </div>
    );
}
\`\`\`

## Event Handling
\`\`\`jsx
function Button() {
    const handleClick = () => {
        alert('Button clicked!');
    };
    
    return <button onClick={handleClick}>Click Me</button>;
}
\`\`\`

## Conditional Rendering
\`\`\`jsx
function Greeting({isLoggedIn}) {
    return (
        <div>
            {isLoggedIn ? (
                <h1>Welcome back!</h1>
            ) : (
                <h1>Please sign in</h1>
            )}
        </div>
    );
}
\`\`\`

## Lists and Keys
\`\`\`jsx
function TodoList({todos}) {
    return (
        <ul>
            {todos.map(todo => (
                <li key={todo.id}>{todo.text}</li>
            ))}
        </ul>
    );
}
\`\`\`
`,
                videoUrl: 'https://www.youtube.com/watch?v=SqcY0GlETPk',
                estimatedMinutes: 90,
                questions: [
                    {
                        question: 'What is JSX?',
                        type: 'multiple-choice',
                        options: ['A JavaScript library', 'JavaScript XML syntax extension', 'A CSS framework', 'A database'],
                        correctAnswer: 'JavaScript XML syntax extension',
                        difficulty: 'easy'
                    },
                    {
                        question: 'Which hook is used for state management?',
                        type: 'multiple-choice',
                        options: ['useEffect', 'useState', 'useContext', 'useReducer'],
                        correctAnswer: 'useState',
                        difficulty: 'easy'
                    }
                ]
            }
        ]
    },
    {
        id: 'nodejs-basics',
        title: 'Node.js Basics',
        description: 'Server-side JavaScript with Node.js',
        category: 'technical',
        difficulty: 'intermediate',
        estimatedHours: 30,
        icon: 'server',
        modules: [
            {
                id: 'nodejs-intro',
                title: 'Introduction to Node.js',
                description: 'Understanding Node.js and its ecosystem',
                content: `# Node.js Fundamentals

## What is Node.js?
Node.js is a JavaScript runtime built on Chrome's V8 engine that allows you to run JavaScript on the server.

## Creating a Simple Server
\`\`\`javascript
const http = require('http');

const server = http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello World!');
});

server.listen(3000, () => {
    console.log('Server running on port 3000');
});
\`\`\`

## Modules
\`\`\`javascript
// math.js
exports.add = (a, b) => a + b;
exports.subtract = (a, b) => a - b;

// app.js
const math = require('./math');
console.log(math.add(5, 3)); // 8
\`\`\`

## NPM (Node Package Manager)
\`\`\`bash
# Initialize project
npm init -y

# Install package
npm install express

# Install dev dependency
npm install --save-dev nodemon
\`\`\`

## Express.js Basics
\`\`\`javascript
const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/api/users', (req, res) => {
    res.json([
        {id: 1, name: 'John'},
        {id: 2, name: 'Jane'}
    ]);
});

app.listen(3000, () => {
    console.log('Server started on port 3000');
});
\`\`\`

## Middleware
\`\`\`javascript
// Logging middleware
app.use((req, res, next) => {
    console.log(\`\${req.method} \${req.url}\`);
    next();
});

// JSON body parser
app.use(express.json());

// Route-specific middleware
const auth = (req, res, next) => {
    if (req.headers.authorization) {
        next();
    } else {
        res.status(401).send('Unauthorized');
    }
};

app.get('/protected', auth, (req, res) => {
    res.send('Protected data');
});
\`\`\`

## File System
\`\`\`javascript
const fs = require('fs');

// Read file
fs.readFile('file.txt', 'utf8', (err, data) => {
    if (err) throw err;
    console.log(data);
});

// Write file
fs.writeFile('output.txt', 'Hello!', (err) => {
    if (err) throw err;
    console.log('File written');
});

// Async/await version
const fs = require('fs').promises;

async function readFile() {
    try {
        const data = await fs.readFile('file.txt', 'utf8');
        console.log(data);
    } catch (error) {
        console.error(error);
    }
}
\`\`\`
`,
                videoUrl: 'https://www.youtube.com/watch?v=TlB_eWDSMt4',
                estimatedMinutes: 100,
                questions: [
                    {
                        question: 'What is Node.js?',
                        type: 'multiple-choice',
                        options: ['A JavaScript framework', 'A JavaScript runtime', 'A database', 'A web browser'],
                        correctAnswer: 'A JavaScript runtime',
                        difficulty: 'easy'
                    },
                    {
                        question: 'Which command initializes a new Node.js project?',
                        type: 'multiple-choice',
                        options: ['npm start', 'npm init', 'node init', 'npm create'],
                        correctAnswer: 'npm init',
                        difficulty: 'easy'
                    }
                ]
            }
        ]
    },
    {
        id: 'git-github',
        title: 'Git & GitHub',
        description: 'Version control and collaboration',
        category: 'technical',
        difficulty: 'beginner',
        estimatedHours: 20,
        icon: 'git-branch',
        modules: [
            {
                id: 'git-basics',
                title: 'Git Basics',
                description: 'Learn version control with Git',
                content: `# Git Fundamentals

## What is Git?
Git is a distributed version control system for tracking changes in source code.

## Basic Commands
\`\`\`bash
# Initialize repository
git init

# Check status
git status

# Add files
git add file.txt
git add .  # Add all files

# Commit changes
git commit -m "Commit message"

# View history
git log
git log --oneline

# View changes
git diff
\`\`\`

## Branching
\`\`\`bash
# Create branch
git branch feature-branch

# Switch branch
git checkout feature-branch
# Or create and switch
git checkout -b feature-branch

# List branches
git branch

# Merge branch
git checkout main
git merge feature-branch

# Delete branch
git branch -d feature-branch
\`\`\`

## Remote Repositories
\`\`\`bash
# Add remote
git remote add origin https://github.com/user/repo.git

# Push to remote
git push origin main

# Pull from remote
git pull origin main

# Clone repository
git clone https://github.com/user/repo.git
\`\`\`

## GitHub Workflow
1. Fork repository
2. Clone your fork
3. Create feature branch
4. Make changes and commit
5. Push to your fork
6. Create Pull Request

## Best Practices
- Write clear commit messages
- Commit often
- Use branches for features
- Pull before pushing
- Review changes before committing
`,
                videoUrl: 'https://www.youtube.com/watch?v=RGOj5yH7evk',
                estimatedMinutes: 90,
                questions: [
                    {
                        question: 'Which command stages all changes?',
                        type: 'multiple-choice',
                        options: ['git commit .', 'git add .', 'git stage .', 'git push .'],
                        correctAnswer: 'git add .',
                        difficulty: 'easy'
                    },
                    {
                        question: 'What does git clone do?',
                        type: 'multiple-choice',
                        options: [
                            'Creates a new repository',
                            'Copies a remote repository to local machine',
                            'Deletes a repository',
                            'Merges branches'
                        ],
                        correctAnswer: 'Copies a remote repository to local machine',
                        difficulty: 'easy'
                    }
                ]
            }
        ]
    },
    {
        id: 'sql-basics',
        title: 'Basic SQL',
        description: 'Database querying with SQL',
        category: 'technical',
        difficulty: 'beginner',
        estimatedHours: 25,
        icon: 'database',
        modules: [
            {
                id: 'sql-intro',
                title: 'SQL Introduction',
                description: 'Learn to query databases with SQL',
                content: `# SQL Fundamentals

## What is SQL?
SQL (Structured Query Language) is used to communicate with databases.

## Basic Queries

### SELECT
\`\`\`sql
-- Select all columns
SELECT * FROM users;

-- Select specific columns
SELECT name, email FROM users;

-- With condition
SELECT * FROM users WHERE age > 18;

-- Sorting
SELECT * FROM users ORDER BY name ASC;

-- Limit results
SELECT * FROM users LIMIT 10;
\`\`\`

### INSERT
\`\`\`sql
INSERT INTO users (name, email, age)
VALUES ('John Doe', 'john@example.com', 30);
\`\`\`

### UPDATE
\`\`\`sql
UPDATE users
SET age = 31
WHERE id = 1;
\`\`\`

### DELETE
\`\`\`sql
DELETE FROM users
WHERE id = 1;
\`\`\`

## Filtering

### WHERE Clause
\`\`\`sql
-- Comparison
SELECT * FROM products WHERE price > 100;

-- Multiple conditions
SELECT * FROM users
WHERE age >= 18 AND city = 'New York';

-- OR condition
SELECT * FROM users
WHERE city = 'NYC' OR city = 'LA';

-- IN operator
SELECT * FROM users
WHERE city IN ('NYC', 'LA', 'Chicago');

-- LIKE operator (pattern matching)
SELECT * FROM users
WHERE name LIKE 'John%';  -- Starts with John
\`\`\`

## Joins
\`\`\`sql
-- INNER JOIN
SELECT users.name, orders.total
FROM users
INNER JOIN orders ON users.id = orders.user_id;

-- LEFT JOIN
SELECT users.name, orders.total
FROM users
LEFT JOIN orders ON users.id = orders.user_id;
\`\`\`

## Aggregate Functions
\`\`\`sql
-- COUNT
SELECT COUNT(*) FROM users;

-- SUM
SELECT SUM(total) FROM orders;

-- AVG
SELECT AVG(price) FROM products;

-- MAX, MIN
SELECT MAX(price), MIN(price) FROM products;

-- GROUP BY
SELECT city, COUNT(*) as user_count
FROM users
GROUP BY city;

-- HAVING (filter groups)
SELECT city, COUNT(*) as user_count
FROM users
GROUP BY city
HAVING COUNT(*) > 10;
\`\`\`

## Creating Tables
\`\`\`sql
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    age INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`
`,
                videoUrl: 'https://www.youtube.com/watch?v=HXV3zeQKqGY',
                estimatedMinutes: 100,
                questions: [
                    {
                        question: 'Which SQL statement is used to retrieve data?',
                        type: 'multiple-choice',
                        options: ['GET', 'SELECT', 'RETRIEVE', 'FETCH'],
                        correctAnswer: 'SELECT',
                        difficulty: 'easy'
                    },
                    {
                        question: 'What does JOIN do?',
                        type: 'multiple-choice',
                        options: [
                            'Deletes rows',
                            'Combines rows from two or more tables',
                            'Updates data',
                            'Creates a new table'
                        ],
                        correctAnswer: 'Combines rows from two or more tables',
                        difficulty: 'medium'
                    }
                ]
            }
        ]
    },
    {
        id: 'communication-skills',
        title: 'Communication Skills',
        description: 'Effective communication in the workplace',
        category: 'soft-skills',
        difficulty: 'beginner',
        estimatedHours: 15,
        icon: 'message-circle',
        modules: [
            {
                id: 'effective-communication',
                title: 'Effective Communication',
                description: 'Master workplace communication',
                content: `# Effective Communication

## Key Principles

### 1. Active Listening
- Pay full attention
- Don't interrupt
- Ask clarifying questions
- Summarize to confirm understanding

### 2. Clear and Concise
- Get to the point
- Use simple language
- Avoid jargon (unless appropriate)
- Structure your message

### 3. Non-Verbal Communication
- Maintain eye contact
- Use appropriate body language
- Be aware of tone
- Facial expressions matter

## Email Communication

### Professional Email Structure
\`\`\`
Subject: Clear, specific subject line

Hi [Name],

[Opening - context or greeting]

[Main message - clear and organized]

[Action items or next steps]

[Closing]

Best regards,
[Your Name]
\`\`\`

### Best Practices
- Use clear subject lines
- Keep it concise
- Proofread before sending
- Respond promptly
- Use appropriate tone

## Meeting Communication

### Before the Meeting
- Review agenda
- Prepare questions
- Gather necessary materials

### During the Meeting
- Arrive on time
- Take notes
- Participate actively
- Stay on topic

### After the Meeting
- Follow up on action items
- Share notes if needed
- Complete assigned tasks

## Giving Feedback

### Constructive Feedback
- Be specific
- Focus on behavior, not person
- Provide examples
- Suggest improvements
- End positively

### Example
❌ "Your code is bad"
✅ "The function could be more efficient. Consider using a hash map instead of nested loops. This would reduce time complexity from O(n²) to O(n)."

## Conflict Resolution

### Steps
1. Stay calm
2. Listen to all perspectives
3. Identify the real issue
4. Brainstorm solutions
5. Agree on action plan
6. Follow up

## Presentation Skills

### Structure
1. Introduction - grab attention
2. Main points - 3-5 key messages
3. Supporting details
4. Conclusion - call to action

### Tips
- Know your audience
- Practice beforehand
- Use visual aids effectively
- Maintain eye contact
- Speak clearly and confidently
- Handle questions gracefully
`,
                videoUrl: 'https://www.youtube.com/watch?v=HAnw168huqA',
                estimatedMinutes: 60,
                questions: [
                    {
                        question: 'What is active listening?',
                        type: 'multiple-choice',
                        options: [
                            'Listening to music while working',
                            'Fully concentrating and understanding the speaker',
                            'Listening while multitasking',
                            'Listening to respond'
                        ],
                        correctAnswer: 'Fully concentrating and understanding the speaker',
                        difficulty: 'easy'
                    },
                    {
                        question: 'When giving feedback, you should:',
                        type: 'multiple-choice',
                        options: [
                            'Focus on the person',
                            'Be vague',
                            'Focus on specific behaviors',
                            'Only point out negatives'
                        ],
                        correctAnswer: 'Focus on specific behaviors',
                        difficulty: 'medium'
                    }
                ]
            }
        ]
    },
    {
        id: 'company-sop',
        title: 'Company SOP & Processes',
        description: 'Understanding company procedures and workflows',
        category: 'company-sop',
        difficulty: 'beginner',
        estimatedHours: 10,
        icon: 'book-open',
        modules: [
            {
                id: 'onboarding-process',
                title: 'Onboarding Process',
                description: 'New employee onboarding procedures',
                content: `# Employee Onboarding

## Week 1: Getting Started

### Day 1
- Complete HR paperwork
- Receive company equipment
- Set up email and accounts
- Meet your team
- Review company handbook

### Day 2-3
- IT system training
- Security and compliance training
- Introduction to company tools
- Shadow team members

### Day 4-5
- Review role expectations
- Set initial goals
- Begin assigned tasks
- Schedule check-ins

## First Month Goals
- Understand company culture
- Learn key processes
- Build relationships
- Complete training modules
- Deliver first project

## Resources
- Employee handbook
- IT support: it@company.com
- HR contact: hr@company.com
- Manager: [Your manager's name]

## Important Policies
- Work hours: 9 AM - 6 PM
- Remote work policy
- Time-off requests
- Expense reporting
- Code of conduct
`,
                videoUrl: 'https://www.youtube.com/watch?v=example',
                estimatedMinutes: 45,
                questions: [
                    {
                        question: 'What should you complete on Day 1?',
                        type: 'multiple-choice',
                        options: [
                            'First project delivery',
                            'HR paperwork and equipment setup',
                            'Performance review',
                            'Team presentation'
                        ],
                        correctAnswer: 'HR paperwork and equipment setup',
                        difficulty: 'easy'
                    }
                ]
            }
        ]
    },
    {
        id: 'role-onboarding',
        title: 'Role-Specific Onboarding',
        description: 'Onboarding content specific to your role',
        category: 'company-sop',
        difficulty: 'beginner',
        estimatedHours: 12,
        icon: 'briefcase',
        modules: [
            {
                id: 'developer-onboarding',
                title: 'Developer Onboarding',
                description: 'Getting started as a developer',
                content: `# Developer Onboarding

## Development Environment Setup

### Required Tools
- IDE: VS Code / IntelliJ
- Version Control: Git
- Node.js (v18+)
- Docker
- Postman

### Repository Access
1. Request GitHub access from IT
2. Clone main repositories
3. Set up SSH keys
4. Configure Git

### Local Development
\`\`\`bash
# Clone repository
git clone git@github.com:company/project.git

# Install dependencies
npm install

# Run locally
npm run dev
\`\`\`

## Code Standards
- Follow ESLint rules
- Write unit tests
- Document complex logic
- Use meaningful commit messages
- Create feature branches

## Development Workflow
1. Pick task from Jira
2. Create feature branch
3. Develop and test locally
4. Create pull request
5. Address review comments
6. Merge after approval

## Deployment Process
- Dev environment: Auto-deploy on merge to dev
- Staging: Manual deployment
- Production: Requires approval

## Key Contacts
- Tech Lead: [Name]
- DevOps: devops@company.com
- Code Review: #code-review Slack channel
`,
                videoUrl: 'https://www.youtube.com/watch?v=example',
                estimatedMinutes: 90,
                questions: [
                    {
                        question: 'What is the first step in the development workflow?',
                        type: 'multiple-choice',
                        options: [
                            'Create pull request',
                            'Pick task from Jira',
                            'Deploy to production',
                            'Write documentation'
                        ],
                        correctAnswer: 'Pick task from Jira',
                        difficulty: 'easy'
                    }
                ]
            }
        ]
    }
];

export default ADDITIONAL_LEARNING_TOPICS;
