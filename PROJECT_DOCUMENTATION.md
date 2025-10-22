# StudySmart - AI-Powered Learning Platform

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Problem Statement](#problem-statement)
3. [Objectives](#objectives)
4. [Key Features](#key-features)
5. [System Architecture](#system-architecture)
6. [Working Process](#working-process)
7. [Technology Stack](#technology-stack)
8. [AI/ML Components](#aiml-components)
9. [Required Skills](#required-skills)
10. [Installation & Setup](#installation--setup)
11. [Database Schema](#database-schema)
12. [API Documentation](#api-documentation)
13. [Future Enhancements](#future-enhancements)
14. [Contributing](#contributing)

---

## 🎯 Project Overview

**StudySmart** is an intelligent, AI-powered learning platform designed to revolutionize the way students study and learn. The application combines modern web technologies with advanced artificial intelligence to provide personalized tutoring, problem-solving, resource management, and progress tracking capabilities.

### Project Type
Full-stack web application with AI integration

### Target Audience
- Students (K-12, College, Self-learners)
- Educators looking for supplementary teaching tools
- Anyone seeking personalized learning assistance

### Project Status
Active Development

---

## 🔍 Problem Statement

### Current Educational Challenges

1. **Limited Access to Personalized Tutoring**
   - Traditional tutoring is expensive and not accessible to all students
   - One-size-fits-all teaching approaches don't cater to individual learning styles
   - Students struggle to get immediate help outside classroom hours

2. **Lack of Organized Study Resources**
   - Students have difficulty organizing and managing study materials across multiple subjects
   - No centralized platform for tracking learning resources
   - Difficulty in maintaining consistent study schedules

3. **Insufficient Problem-Solving Support**
   - Students get stuck on homework problems with no immediate assistance
   - Limited understanding of step-by-step problem-solving processes
   - Lack of visual problem recognition for mathematical and scientific problems

4. **Poor Progress Tracking**
   - Students lack visibility into their learning progress
   - No data-driven insights into study patterns and performance
   - Difficulty setting and tracking achievable learning goals

5. **Motivation and Engagement Issues**
   - Traditional study methods can be monotonous
   - Lack of interactive and engaging learning experiences
   - No gamification or reward systems to maintain motivation

### Gap in Market
While there are various learning platforms and AI tools available, few integrate comprehensive features including AI tutoring, problem-solving with image recognition, resource management, progress tracking, and goal setting in a single, cohesive platform.

---

## 🎯 Objectives

### Primary Objectives

1. **Democratize Access to Quality Education**
   - Provide 24/7 AI-powered tutoring assistance to students regardless of location or economic background
   - Break down barriers to personalized learning support

2. **Enhance Learning Efficiency**
   - Enable students to learn at their own pace with adaptive AI guidance
   - Reduce time spent searching for solutions and increase time spent understanding concepts

3. **Provide Comprehensive Learning Management**
   - Create a unified platform for organizing study resources, schedules, and goals
   - Simplify the learning management process for students

4. **Leverage AI for Personalized Education**
   - Use artificial intelligence to provide contextual, subject-specific tutoring
   - Implement visual problem recognition for solving mathematical and scientific problems

5. **Track and Improve Learning Outcomes**
   - Provide detailed analytics on study patterns and progress
   - Enable data-driven decision making for study optimization

### Secondary Objectives

1. **Create an Intuitive User Experience**
   - Design a clean, modern interface that's easy to navigate
   - Ensure accessibility across devices (responsive design)

2. **Build a Scalable Architecture**
   - Implement cloud-based infrastructure that can grow with user demand
   - Use serverless functions for efficient resource utilization

3. **Ensure Data Security and Privacy**
   - Implement robust authentication and authorization
   - Protect user data and learning history

4. **Foster Continuous Learning**
   - Encourage consistent study habits through scheduling and reminders
   - Provide motivational feedback and progress celebrations

---

## ✨ Key Features

### 1. AI Chat Tutor
- **Real-time conversational AI** powered by Google Gemini 2.5 Flash
- **Multi-subject support**: Mathematics, Science, History, Literature, and more
- **Context-aware responses** that adapt to the student's level
- **Session history** for reviewing past conversations
- **Socratic teaching method** - guides students to discover answers rather than just providing them

### 2. AI Problem Solver
- **Text-based problem input** with subject classification
- **Image recognition** for handwritten or printed problems
- **Step-by-step solutions** with detailed explanations
- **Difficulty assessment** for each problem
- **Solution history** for reviewing past problems
- **Multi-subject coverage** including Math, Physics, Chemistry, Biology, and more

### 3. Study Resources Management
- **Create and organize study materials** by subject and topic
- **File attachments** and document storage
- **Resource categorization** (Notes, Videos, Documents, Links)
- **Quick search and filtering** capabilities
- **Resource viewer** with integrated document display
- **Edit and update** resources as needed

### 4. Study Goals Tracking
- **Set SMART goals** (Specific, Measurable, Achievable, Relevant, Time-bound)
- **Subject-specific goals** with target dates
- **Progress tracking** with completion status
- **Goal prioritization** and organization
- **Motivational reminders** and milestone celebrations

### 5. Study Schedule Management
- **Weekly study planner** with time slots
- **Subject-based scheduling** for organized learning
- **Visual calendar interface** for easy planning
- **Recurring schedule support** for regular study sessions
- **Schedule optimization** suggestions based on goals

### 6. Progress Analytics
- **Study time tracking** across subjects
- **Visual charts and graphs** for progress visualization
- **Performance metrics** and insights
- **Learning streak tracking** to maintain consistency
- **Comparative analysis** over time periods

### 7. Profile Management
- **User profile customization** with avatars
- **Display name and bio** settings
- **Preference management** for personalized experience
- **Account security settings**

### 8. Authentication & Security
- **Secure user authentication** via Supabase Auth
- **Email/password login** with password recovery
- **Session management** with automatic timeout
- **Row-level security (RLS)** for data protection
- **Encrypted data storage**

---

## 🏗️ System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend Layer                       │
│  (React + TypeScript + Tailwind CSS + Vite)                 │
│                                                              │
│  Components:                                                 │
│  - Chat Interface        - Problem Solver                   │
│  - Resource Manager      - Goal Tracker                     │
│  - Schedule Planner      - Progress Dashboard               │
│  - Profile Settings      - Authentication                   │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  │ HTTP/HTTPS Requests
                  │
┌─────────────────┴───────────────────────────────────────────┐
│                     API Gateway Layer                        │
│                  (Supabase Client)                          │
│                                                              │
│  - Authentication API                                        │
│  - Database API (PostgREST)                                 │
│  - Edge Functions API                                       │
│  - Storage API                                              │
└─────────────────┬───────────────────────────────────────────┘
                  │
        ┌─────────┴──────────┐
        │                    │
┌───────▼──────┐    ┌───────▼──────────────────────────────┐
│   Database   │    │      Edge Functions                  │
│  (PostgreSQL)│    │      (Deno Runtime)                  │
│              │    │                                       │
│  Tables:     │    │  Functions:                          │
│  - profiles  │    │  - ai-tutor                         │
│  - resources │    │  - solve-problem                    │
│  - goals     │    │                                       │
│  - schedules │    │  ┌────────────────────────┐         │
│  - sessions  │    │  │  Lovable AI Gateway    │         │
│  - etc.      │    │  │  (Google Gemini)       │         │
└──────────────┘    │  └────────────────────────┘         │
                    └────────────────────────────────────────┘
```

### Component Architecture

```
src/
├── components/           # Reusable UI components
│   ├── ChatInterface.tsx          # AI Chat tutor UI
│   ├── ProblemSolver.tsx          # Problem solving interface
│   ├── StudyResources.tsx         # Resource management
│   ├── StudyGoals.tsx             # Goal tracking
│   ├── StudySchedule.tsx          # Schedule planner
│   ├── ProgressTracking.tsx       # Analytics dashboard
│   ├── ProfileSettings.tsx        # User settings
│   └── ui/                        # Shadcn UI components
├── pages/                # Route pages
│   ├── Index.tsx                  # Landing page
│   ├── Dashboard.tsx              # Main dashboard
│   ├── Auth.tsx                   # Authentication page
│   └── NotFound.tsx               # 404 page
├── integrations/         # External service integrations
│   └── supabase/
│       ├── client.ts              # Supabase client setup
│       └── types.ts               # Database type definitions
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
└── assets/               # Static assets
```

### Data Flow

1. **User Interaction** → Frontend Component
2. **Component** → Supabase Client (API call)
3. **Supabase Client** → Edge Function or Database
4. **Edge Function** → Lovable AI Gateway (for AI features)
5. **AI Gateway** → Google Gemini API
6. **Response flows back** through the chain
7. **UI updates** with new data

---

## ⚙️ Working Process

### User Workflow

#### 1. User Registration & Authentication
```
User visits app → Clicks "Get Started"
→ Enters email/password → Supabase Auth validates
→ Creates user account → Redirects to Dashboard
```

#### 2. AI Chat Tutoring Session
```
User clicks "AI Chat" tab → Types question
→ Message sent to ai-tutor Edge Function
→ Function calls Lovable AI Gateway (Gemini)
→ AI processes with context and system prompt
→ Response streamed back to user
→ Message saved to database for history
```

#### 3. Problem Solving Workflow
```
User clicks "AI Solver" tab → Enters problem text OR uploads image
→ Selects subject → Clicks "Solve Problem"
→ Request sent to solve-problem Edge Function
→ Function analyzes input (text/image processing)
→ AI generates step-by-step solution
→ Solution displayed with steps, answer, and difficulty
→ Session saved to database for future reference
```

#### 4. Resource Management
```
User clicks "Resources" tab → Creates new resource
→ Fills in title, subject, type, content
→ Optionally uploads files → Saves to database
→ Resources displayed in organized list
→ User can view, edit, or delete resources
```

#### 5. Goal Setting & Tracking
```
User clicks "Goals" tab → Creates new goal
→ Defines goal details (title, subject, target date)
→ Saves to database → Goals displayed in list
→ User marks progress → Status updates automatically
→ Completed goals celebrated with notifications
```

#### 6. Schedule Planning
```
User clicks "Schedule" tab → Views weekly calendar
→ Adds study session (subject, day, time)
→ Schedule saved to database
→ Visual calendar updates → Reminders triggered
```

#### 7. Progress Monitoring
```
User clicks "Progress" tab → System fetches analytics data
→ Calculates study time, completion rates, streaks
→ Generates charts and visualizations
→ Displays insights and recommendations
```

### Technical Process Flow

#### Authentication Flow
```typescript
1. User submits credentials
2. Supabase Auth validates
3. JWT token generated
4. Token stored in browser (localStorage/cookie)
5. Token included in all API requests
6. Row-level security policies enforce access control
```

#### AI Request Flow
```typescript
1. User input captured in frontend
2. Request payload constructed with user data
3. Supabase function invoked via HTTP POST
4. Edge function validates request
5. System prompt prepared with context
6. Request forwarded to Lovable AI Gateway
7. AI model (Gemini) processes request
8. Response parsed and formatted
9. Data returned to client
10. UI updated with response
11. Interaction logged to database
```

#### Database Interaction Flow
```typescript
1. Component triggers data operation
2. Supabase client method called (select/insert/update/delete)
3. Request authenticated with JWT
4. RLS policies evaluated
5. PostgreSQL executes query
6. Results returned to client
7. Component state updated
8. UI re-renders with new data
```

---

## 🛠️ Technology Stack

### Frontend Technologies

#### Core Framework
- **React 18.3.1** - Modern UI library with hooks and concurrent features
- **TypeScript** - Type-safe JavaScript for better development experience
- **Vite** - Fast build tool and development server

#### UI & Styling
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality React components built on Radix UI
- **Lucide React** - Beautiful icon library
- **Radix UI** - Unstyled, accessible component primitives

#### State Management & Data Fetching
- **React Hooks** - Built-in state management (useState, useEffect, etc.)
- **TanStack Query** - Server state management and caching
- **React Hook Form** - Form state management and validation

#### Routing
- **React Router DOM 6.30** - Client-side routing

#### Additional Libraries
- **date-fns** - Modern date utility library
- **recharts** - Composable charting library
- **sonner** - Toast notification system
- **zod** - TypeScript-first schema validation

### Backend Technologies

#### Backend as a Service
- **Supabase** - Complete backend platform
  - **PostgreSQL Database** - Reliable relational database
  - **Supabase Auth** - User authentication & authorization
  - **Row Level Security (RLS)** - Database-level security policies
  - **Supabase Storage** - File storage with CDN
  - **Edge Functions** - Serverless Deno functions

#### Runtime
- **Deno** - Modern TypeScript/JavaScript runtime for Edge Functions

### AI/ML Technologies

#### AI Platform
- **Lovable AI Gateway** - Managed AI API gateway
  - Pre-configured API access
  - Usage-based pricing
  - Rate limiting and monitoring

#### AI Models
- **Google Gemini 2.5 Flash** - Fast, efficient AI model for chat
- **Google Gemini 2.5 Pro** - Advanced model for image analysis
- **Vision API** - Image recognition and analysis

#### AI Capabilities
- **Natural Language Processing (NLP)** - Understanding user queries
- **Computer Vision** - Processing uploaded problem images
- **Conversational AI** - Context-aware dialogue
- **Structured Output Generation** - JSON-formatted responses

### Development Tools

#### Version Control
- **Git** - Source code management
- **GitHub** - Code hosting and collaboration

#### Code Quality
- **ESLint** - JavaScript/TypeScript linting
- **TypeScript Compiler** - Type checking

#### Build & Deployment
- **Vite Build** - Production optimization
- **Lovable Platform** - One-click deployment

---

## 🤖 AI/ML Components

### 1. AI Chat Tutor (ai-tutor Edge Function)

#### Purpose
Provides conversational AI tutoring assistance across multiple subjects.

#### Model Used
- **Google Gemini 2.5 Flash** - Optimized for fast, efficient responses

#### Key Features
- Context-aware responses
- Subject-specific expertise
- Socratic teaching method
- Session continuity
- Multi-turn conversations

#### System Prompt Strategy
```typescript
const systemPrompt = `You are an expert AI tutor specializing in ${subject}.
Your teaching style:
- Ask guiding questions rather than giving direct answers
- Break down complex concepts into simple steps
- Provide examples and analogies
- Encourage critical thinking
- Adapt to the student's level of understanding

Remember: Help students learn and understand, not just provide answers.`;
```

#### Technical Implementation
- **Input**: User message, subject, session ID
- **Processing**: Context preparation, prompt engineering, API call
- **Output**: AI-generated tutoring response
- **Error Handling**: Rate limiting (429), credit exhaustion (402)

### 2. Problem Solver (solve-problem Edge Function)

#### Purpose
Analyzes and solves academic problems with step-by-step explanations.

#### Models Used
- **Google Gemini 2.5 Pro** - For image-based problems (visual recognition)
- **Google Gemini 2.5 Flash** - For text-only problems (faster processing)

#### Key Features
- Text and image input support
- Multi-subject coverage
- Step-by-step solutions
- Difficulty assessment
- Final answer extraction
- Structured JSON output

#### System Prompt Strategy
```typescript
const systemPrompt = `You are an expert problem solver for ${subject}.

Analyze the problem and provide:
1. Step-by-step solution with clear explanations
2. Final answer
3. Difficulty level (easy/medium/hard)

Format as JSON:
{
  "steps": [{"stepNumber": 1, "explanation": "...", "result": "..."}],
  "finalAnswer": "...",
  "difficulty": "medium",
  "hints": ["..."]
}`;
```

#### Image Processing
- Base64 encoding of uploaded images
- Vision API integration
- OCR for handwritten problems
- Mathematical notation recognition

#### Technical Implementation
- **Input**: Problem text and/or image, subject
- **Processing**: Image encoding, model selection, structured output
- **Output**: JSON object with solution details
- **Error Handling**: Invalid input, API errors, malformed JSON

### 3. Future AI Enhancements

#### Planned Features
1. **AI Flashcard Generator** - Auto-generate flashcards from notes
2. **AI Quiz Generator** - Create practice quizzes from study materials
3. **AI Note Summarizer** - Condense long notes into key points
4. **AI Study Planner** - Optimize study schedules using ML
5. **Voice Tutor** - Speech-to-text and text-to-speech integration
6. **Document Analyzer** - Extract key information from PDFs

---

## 💼 Required Skills

### Technical Skills Required

#### Frontend Development (Essential)
- **React.js** - Component architecture, hooks, lifecycle
- **TypeScript** - Type systems, interfaces, generics
- **HTML5 & CSS3** - Semantic markup, responsive design
- **Tailwind CSS** - Utility-first styling, customization
- **JavaScript ES6+** - Async/await, promises, arrow functions
- **Responsive Design** - Mobile-first approach, media queries
- **Component Libraries** - Working with UI component systems

#### Backend Development (Essential)
- **RESTful APIs** - HTTP methods, status codes, API design
- **Serverless Functions** - Edge computing concepts
- **Deno/Node.js** - JavaScript runtime environments
- **Database Management** - SQL queries, data modeling
- **PostgreSQL** - Relational database operations
- **Authentication** - JWT tokens, session management
- **API Integration** - Third-party service integration

#### AI/ML Integration (Important)
- **AI API Usage** - Working with AI gateways and APIs
- **Prompt Engineering** - Crafting effective AI prompts
- **Natural Language Processing** - Understanding NLP concepts
- **Computer Vision** - Basic image processing knowledge
- **JSON Parsing** - Structured data handling
- **Error Handling** - Managing AI API failures

#### Tools & Platforms (Essential)
- **Git & GitHub** - Version control, branching, pull requests
- **Supabase** - Database, auth, storage, functions
- **Vite** - Build tools and development server
- **npm/yarn** - Package management
- **VS Code** - Code editor with extensions
- **Browser DevTools** - Debugging and performance analysis

#### Software Engineering (Important)
- **Clean Code Principles** - Readable, maintainable code
- **Component Design** - Reusable, modular components
- **State Management** - Application state handling
- **Error Handling** - Try-catch, error boundaries
- **Testing** - Unit testing concepts (future)
- **Performance Optimization** - Code splitting, lazy loading
- **Security Best Practices** - XSS prevention, CSRF protection

### Soft Skills Required

#### Problem Solving
- Analytical thinking
- Debugging skills
- Root cause analysis
- Creative solution finding

#### Communication
- Technical documentation writing
- Code commenting
- Team collaboration
- User requirement gathering

#### Learning & Adaptation
- Self-learning ability
- Staying updated with new technologies
- Quick adaptation to new frameworks
- Research skills

#### Project Management
- Task prioritization
- Time management
- Milestone planning
- Progress tracking

### Knowledge Domains

#### Computer Science Fundamentals
- Data structures (Arrays, Objects, Maps)
- Algorithms (Sorting, Searching, Filtering)
- Asynchronous programming
- Memory management basics

#### Web Development Concepts
- Client-server architecture
- HTTP/HTTPS protocols
- RESTful API design
- CORS and security headers
- Browser storage (localStorage, cookies)

#### Database Concepts
- Relational database design
- CRUD operations
- Queries and filtering
- Indexes and optimization
- Database security (RLS)

#### AI/ML Basics
- Machine learning concepts
- Natural language understanding
- Training vs. inference
- Model selection criteria
- Token usage and pricing

### Recommended Learning Path

#### Beginner Level (0-3 months)
1. HTML, CSS, JavaScript fundamentals
2. React basics and component concepts
3. TypeScript introduction
4. Git and version control
5. Basic API concepts

#### Intermediate Level (3-6 months)
1. Advanced React patterns
2. State management strategies
3. Tailwind CSS mastery
4. Backend integration with Supabase
5. Database design and SQL

#### Advanced Level (6-12 months)
1. AI API integration
2. Serverless function development
3. Performance optimization
4. Security best practices
5. Full-stack architecture design

---

## 📦 Installation & Setup

### Prerequisites

#### Required Software
- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Git** - [Download](https://git-scm.com/)
- **Code Editor** (VS Code recommended) - [Download](https://code.visualstudio.com/)

#### Accounts Needed
- **GitHub Account** - For code repository
- **Supabase Account** - For backend services
- **Lovable Account** - For deployment (optional)

### Local Development Setup

#### Step 1: Clone the Repository
```bash
git clone <YOUR_GIT_URL>
cd studysmart
```

#### Step 2: Install Dependencies
```bash
npm install
```

#### Step 3: Environment Variables
Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
```

**How to get these values:**
1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Select your project
3. Go to Settings → API
4. Copy "Project URL" and "anon/public key"

#### Step 4: Start Development Server
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Supabase Setup

#### Database Setup
The project uses Supabase migrations for database schema. Migrations are located in `supabase/migrations/`.

#### Edge Functions Setup
1. Install Supabase CLI:
```bash
npm install -g supabase
```

2. Link to your project:
```bash
supabase link --project-ref <your-project-ref>
```

3. Deploy Edge Functions:
```bash
supabase functions deploy ai-tutor
supabase functions deploy solve-problem
```

4. Set secrets:
```bash
supabase secrets set LOVABLE_API_KEY=your_lovable_api_key
```

### Deployment

#### Deploy to Lovable
1. Connect your project to Lovable
2. Click "Publish" in the Lovable dashboard
3. Your app will be live at `yourapp.lovable.app`

#### Deploy to Vercel
```bash
npm run build
vercel --prod
```

#### Deploy to Netlify
```bash
npm run build
# Connect your Git repository to Netlify
# Set build command: npm run build
# Set publish directory: dist
```

---

## 🗄️ Database Schema

### Tables Overview

#### 1. profiles
Stores user profile information.

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

**RLS Policies:**
- Users can view all profiles
- Users can update their own profile
- Users can insert their own profile

#### 2. study_resources
Manages study materials and resources.

```sql
CREATE TABLE study_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  subject TEXT NOT NULL,
  type TEXT NOT NULL,
  content TEXT,
  file_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

**RLS Policies:**
- Users can only access their own resources
- Full CRUD operations for own resources

#### 3. study_goals
Tracks user learning goals.

```sql
CREATE TABLE study_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  subject TEXT NOT NULL,
  description TEXT,
  target_date DATE,
  status TEXT DEFAULT 'in_progress',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

**RLS Policies:**
- Users can only access their own goals
- Full CRUD operations for own goals

#### 4. study_schedules
Manages weekly study plans.

```sql
CREATE TABLE study_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  subject TEXT NOT NULL,
  day_of_week INTEGER NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

**RLS Policies:**
- Users can only access their own schedules
- Full CRUD operations for own schedules

#### 5. chat_sessions
Stores AI tutoring conversation history.

```sql
CREATE TABLE chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  subject TEXT NOT NULL,
  messages JSONB[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

#### 6. problem_sessions
Stores solved problem history.

```sql
CREATE TABLE problem_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  problem_text TEXT,
  subject TEXT NOT NULL,
  image_data TEXT,
  solution JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

### Relationships

```
auth.users (1) ─── (many) profiles
auth.users (1) ─── (many) study_resources
auth.users (1) ─── (many) study_goals
auth.users (1) ─── (many) study_schedules
auth.users (1) ─── (many) chat_sessions
auth.users (1) ─── (many) problem_sessions
```

---

## 📚 API Documentation

### Edge Functions

#### 1. ai-tutor Function

**Endpoint:** `https://your-project.supabase.co/functions/v1/ai-tutor`

**Method:** POST

**Headers:**
```json
{
  "Authorization": "Bearer YOUR_SUPABASE_ANON_KEY",
  "Content-Type": "application/json"
}
```

**Request Body:**
```json
{
  "message": "Can you explain photosynthesis?",
  "sessionId": "uuid-string",
  "subject": "Biology"
}
```

**Response:**
```json
{
  "response": "AI tutor's response text..."
}
```

**Error Responses:**
- 429: Rate limit exceeded
- 402: AI credits exhausted
- 500: Internal server error

#### 2. solve-problem Function

**Endpoint:** `https://your-project.supabase.co/functions/v1/solve-problem`

**Method:** POST

**Headers:**
```json
{
  "Authorization": "Bearer YOUR_SUPABASE_ANON_KEY",
  "Content-Type": "application/json"
}
```

**Request Body (Text Problem):**
```json
{
  "problemText": "Solve: 2x + 5 = 15",
  "subject": "Mathematics",
  "imageData": null
}
```

**Request Body (Image Problem):**
```json
{
  "problemText": null,
  "subject": "Mathematics",
  "imageData": "data:image/png;base64,iVBORw0KGgoAAAANS..."
}
```

**Response:**
```json
{
  "steps": [
    {
      "stepNumber": 1,
      "explanation": "Subtract 5 from both sides",
      "result": "2x = 10"
    },
    {
      "stepNumber": 2,
      "explanation": "Divide both sides by 2",
      "result": "x = 5"
    }
  ],
  "finalAnswer": "x = 5",
  "difficulty": "easy",
  "hints": ["Start by isolating the variable term"]
}
```

### Database API (via Supabase Client)

#### Fetch Resources
```typescript
const { data, error } = await supabase
  .from('study_resources')
  .select('*')
  .eq('user_id', userId)
  .order('created_at', { ascending: false });
```

#### Create Resource
```typescript
const { data, error } = await supabase
  .from('study_resources')
  .insert({
    user_id: userId,
    title: 'Chapter 5 Notes',
    subject: 'Physics',
    type: 'notes',
    content: 'Newton\'s laws...'
  });
```

#### Update Resource
```typescript
const { data, error } = await supabase
  .from('study_resources')
  .update({ title: 'Updated Title' })
  .eq('id', resourceId);
```

#### Delete Resource
```typescript
const { data, error } = await supabase
  .from('study_resources')
  .delete()
  .eq('id', resourceId);
```

---

## 🚀 Future Enhancements

### Phase 1: Enhanced AI Features (Q1 2025)

1. **AI Flashcard Generator**
   - Generate flashcards from study notes
   - Spaced repetition algorithm
   - Progress tracking

2. **AI Quiz Generator**
   - Create practice quizzes from resources
   - Multiple question types
   - Instant grading and feedback

3. **AI Note Summarizer**
   - Condense long notes
   - Extract key concepts
   - Generate study guides

### Phase 2: Collaboration Features (Q2 2025)

1. **Study Groups**
   - Create and join study groups
   - Shared resources
   - Group chat functionality

2. **Peer Learning**
   - Connect with other students
   - Share problem solutions
   - Collaborative note-taking

3. **Teacher Dashboard**
   - Monitor student progress
   - Assign resources and tasks
   - Analytics and reporting

### Phase 3: Advanced Analytics (Q3 2025)

1. **Learning Analytics**
   - Detailed performance metrics
   - Learning style identification
   - Predictive insights

2. **Smart Recommendations**
   - AI-powered study suggestions
   - Optimal study time recommendations
   - Resource recommendations

3. **Gamification**
   - Achievement badges
   - Leaderboards
   - Reward system

### Phase 4: Mobile & Offline (Q4 2025)

1. **Mobile Apps**
   - React Native iOS app
   - React Native Android app
   - Push notifications

2. **Offline Mode**
   - Download resources for offline access
   - Sync when online
   - Offline problem solving

3. **Voice Integration**
   - Voice-to-text input
   - Text-to-speech output
   - Voice commands

### Phase 5: Enterprise Features (2026)

1. **School/University Integration**
   - LMS integration
   - Bulk user management
   - Custom branding

2. **Advanced Security**
   - SSO integration
   - Audit logs
   - Compliance certifications

3. **API Platform**
   - Public API for third-party integrations
   - Webhook support
   - Developer documentation

---

## 🤝 Contributing

### How to Contribute

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Commit your changes**
   ```bash
   git commit -m "Add amazing feature"
   ```
5. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Open a Pull Request**

### Coding Standards

- Use TypeScript for all new code
- Follow existing code style
- Add comments for complex logic
- Write descriptive commit messages
- Test your changes before submitting

### Bug Reports

When reporting bugs, include:
- Clear description of the issue
- Steps to reproduce
- Expected vs. actual behavior
- Screenshots if applicable
- Browser/device information

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 📞 Contact & Support

- **Project URL:** https://lovable.dev/projects/fa82d010-c844-467f-957c-25331a9faf66
- **Documentation:** https://docs.lovable.dev/
- **Discord Community:** https://discord.com/channels/1119885301872070706
- **Email Support:** support@lovable.dev

---

## 🙏 Acknowledgments

- **Lovable Platform** - For providing the development environment and AI gateway
- **Supabase** - For the comprehensive backend infrastructure
- **Google AI** - For Gemini models powering the AI features
- **shadcn/ui** - For beautiful, accessible UI components
- **Open Source Community** - For all the amazing libraries and tools

---

## 📊 Project Statistics

- **Total Components:** 40+
- **Lines of Code:** 5000+
- **Edge Functions:** 2
- **Database Tables:** 6+
- **AI Models Used:** 2 (Gemini 2.5 Flash, Gemini 2.5 Pro)
- **Supported Subjects:** 10+
- **Development Time:** Active development
- **Contributors:** Growing community

---

**Version:** 1.0.0  
**Last Updated:** 2025  
**Status:** ✅ Active Development

---

*This documentation is maintained by the StudySmart development team. For questions or suggestions, please open an issue on GitHub.*
