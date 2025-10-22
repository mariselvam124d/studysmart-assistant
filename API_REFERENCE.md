# StudySmart API Reference

Complete API documentation for StudySmart backend services.

---

## Table of Contents

1. [Authentication](#authentication)
2. [Edge Functions](#edge-functions)
3. [Database API](#database-api)
4. [Error Handling](#error-handling)
5. [Rate Limits](#rate-limits)

---

## Authentication

All API requests require authentication using Supabase Auth.

### Authentication Methods

#### Email/Password Login

```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123',
});
```

#### Sign Up

```typescript
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123',
});
```

#### Sign Out

```typescript
const { error } = await supabase.auth.signOut();
```

#### Get Session

```typescript
const { data: { session } } = await supabase.auth.getSession();
```

---

## Edge Functions

### 1. AI Tutor Function

Provides conversational AI tutoring assistance.

**Endpoint:** `/functions/v1/ai-tutor`

**Method:** `POST`

**Authentication:** Required

#### Request

```typescript
{
  message: string;      // User's question or message
  subject: string;      // Subject area (e.g., "Mathematics")
  sessionId: string;    // Unique session identifier
}
```

**Example:**

```typescript
const { data, error } = await supabase.functions.invoke('ai-tutor', {
  body: {
    message: 'Can you explain the Pythagorean theorem?',
    subject: 'Mathematics',
    sessionId: '550e8400-e29b-41d4-a716-446655440000',
  },
});
```

#### Response

```typescript
{
  response: string;     // AI tutor's response
}
```

**Success Response (200):**

```json
{
  "response": "The Pythagorean theorem states that in a right triangle, the square of the hypotenuse (c) equals the sum of squares of the other two sides (a and b). In formula form: a² + b² = c²..."
}
```

#### Error Responses

**400 Bad Request:**
```json
{
  "error": "Missing required fields: message, subject, or sessionId"
}
```

**429 Rate Limit Exceeded:**
```json
{
  "error": "Rate limit exceeded. Please try again in a moment."
}
```

**402 Payment Required:**
```json
{
  "error": "AI credits exhausted. Please add credits to your workspace."
}
```

**500 Internal Server Error:**
```json
{
  "error": "Failed to process request"
}
```

---

### 2. Solve Problem Function

Analyzes and solves academic problems with step-by-step solutions.

**Endpoint:** `/functions/v1/solve-problem`

**Method:** `POST`

**Authentication:** Required

#### Request

```typescript
{
  problemText?: string;   // Text description of problem
  subject: string;        // Subject area
  imageData?: string;     // Base64 encoded image (optional)
}
```

**Note:** Either `problemText` or `imageData` must be provided.

**Example (Text Problem):**

```typescript
const { data, error } = await supabase.functions.invoke('solve-problem', {
  body: {
    problemText: 'Solve for x: 2x + 5 = 15',
    subject: 'Mathematics',
  },
});
```

**Example (Image Problem):**

```typescript
const { data, error } = await supabase.functions.invoke('solve-problem', {
  body: {
    subject: 'Mathematics',
    imageData: 'data:image/png;base64,iVBORw0KGgoAAAANS...',
  },
});
```

**Example (Text + Image):**

```typescript
const { data, error } = await supabase.functions.invoke('solve-problem', {
  body: {
    problemText: 'Solve this equation shown in the image',
    subject: 'Mathematics',
    imageData: 'data:image/png;base64,iVBORw0KGgoAAAANS...',
  },
});
```

#### Response

```typescript
{
  steps: Array<{
    stepNumber: number;
    explanation: string;
    result: string;
  }>;
  finalAnswer: string;
  difficulty: 'easy' | 'medium' | 'hard';
  hints?: string[];
}
```

**Success Response (200):**

```json
{
  "steps": [
    {
      "stepNumber": 1,
      "explanation": "Subtract 5 from both sides to isolate the term with x",
      "result": "2x = 10"
    },
    {
      "stepNumber": 2,
      "explanation": "Divide both sides by 2 to solve for x",
      "result": "x = 5"
    }
  ],
  "finalAnswer": "x = 5",
  "difficulty": "easy",
  "hints": [
    "Remember to perform the same operation on both sides",
    "Check your answer by substituting back into the original equation"
  ]
}
```

#### Error Responses

**400 Bad Request:**
```json
{
  "error": "Must provide either problemText or imageData"
}
```

**429 Rate Limit Exceeded:**
```json
{
  "error": "Rate limit exceeded. Please try again in a moment."
}
```

**402 Payment Required:**
```json
{
  "error": "AI credits exhausted. Please add credits to your workspace."
}
```

**500 Internal Server Error:**
```json
{
  "error": "Failed to process problem"
}
```

---

## Database API

### Tables

#### 1. Profiles

Stores user profile information.

**Table:** `profiles`

**Columns:**
- `id` (uuid, primary key)
- `user_id` (uuid, unique, references auth.users)
- `full_name` (text, nullable)
- `avatar_url` (text, nullable)
- `grade_level` (text, nullable)
- `subjects_of_interest` (text[], nullable)
- `study_goals` (text, nullable)
- `created_at` (timestamp)
- `updated_at` (timestamp)

**Operations:**

**Select:**
```typescript
const { data, error } = await supabase
  .from('profiles')
  .select('*')
  .eq('user_id', userId)
  .single();
```

**Insert:**
```typescript
const { data, error } = await supabase
  .from('profiles')
  .insert({
    user_id: userId,
    full_name: 'John Doe',
    grade_level: '10th Grade',
  });
```

**Update:**
```typescript
const { data, error } = await supabase
  .from('profiles')
  .update({ full_name: 'Jane Doe' })
  .eq('user_id', userId);
```

---

#### 2. Study Resources

Manages study materials and resources.

**Table:** `study_resources`

**Columns:**
- `id` (uuid, primary key)
- `user_id` (uuid, references auth.users)
- `title` (text)
- `subject` (text)
- `resource_type` (text)
- `content` (jsonb)
- `is_public` (boolean, default: false)
- `created_at` (timestamp)
- `updated_at` (timestamp)

**Operations:**

**Select All:**
```typescript
const { data, error } = await supabase
  .from('study_resources')
  .select('*')
  .eq('user_id', userId)
  .order('created_at', { ascending: false });
```

**Select by Subject:**
```typescript
const { data, error } = await supabase
  .from('study_resources')
  .select('*')
  .eq('user_id', userId)
  .eq('subject', 'Mathematics');
```

**Insert:**
```typescript
const { data, error } = await supabase
  .from('study_resources')
  .insert({
    user_id: userId,
    title: 'Algebra Notes',
    subject: 'Mathematics',
    resource_type: 'notes',
    content: { text: 'Notes content here...' },
  });
```

**Update:**
```typescript
const { data, error } = await supabase
  .from('study_resources')
  .update({ 
    title: 'Updated Title',
    content: { text: 'Updated content...' }
  })
  .eq('id', resourceId)
  .eq('user_id', userId);
```

**Delete:**
```typescript
const { error } = await supabase
  .from('study_resources')
  .delete()
  .eq('id', resourceId)
  .eq('user_id', userId);
```

---

#### 3. Chat Sessions

Stores AI tutoring conversation sessions.

**Table:** `chat_sessions`

**Columns:**
- `id` (uuid, primary key)
- `user_id` (uuid, references auth.users)
- `subject` (text, nullable)
- `title` (text, default: 'New Chat')
- `created_at` (timestamp)
- `updated_at` (timestamp)

**Operations:**

**Select All Sessions:**
```typescript
const { data, error } = await supabase
  .from('chat_sessions')
  .select('*')
  .eq('user_id', userId)
  .order('updated_at', { ascending: false });
```

**Create Session:**
```typescript
const { data, error } = await supabase
  .from('chat_sessions')
  .insert({
    user_id: userId,
    subject: 'Biology',
    title: 'Photosynthesis Discussion',
  })
  .select()
  .single();
```

**Update Session:**
```typescript
const { error } = await supabase
  .from('chat_sessions')
  .update({ 
    title: 'Updated Title',
    updated_at: new Date().toISOString()
  })
  .eq('id', sessionId)
  .eq('user_id', userId);
```

**Delete Session:**
```typescript
const { error } = await supabase
  .from('chat_sessions')
  .delete()
  .eq('id', sessionId)
  .eq('user_id', userId);
```

---

#### 4. Chat Messages

Stores individual messages within chat sessions.

**Table:** `chat_messages`

**Columns:**
- `id` (uuid, primary key)
- `session_id` (uuid, references chat_sessions)
- `user_id` (uuid, references auth.users)
- `role` (text: 'user' | 'assistant')
- `content` (text)
- `created_at` (timestamp)

**Operations:**

**Select Messages for Session:**
```typescript
const { data, error } = await supabase
  .from('chat_messages')
  .select('*')
  .eq('session_id', sessionId)
  .order('created_at', { ascending: true });
```

**Insert Message:**
```typescript
const { data, error } = await supabase
  .from('chat_messages')
  .insert({
    session_id: sessionId,
    user_id: userId,
    role: 'user',
    content: 'My question here',
  });
```

---

#### 5. Problem Solving Sessions

Stores solved problem history.

**Table:** `problem_solving_sessions`

**Columns:**
- `id` (uuid, primary key)
- `user_id` (uuid, references auth.users)
- `title` (text)
- `subject` (text)
- `problem_text` (text, nullable)
- `problem_image_url` (text, nullable)
- `solution` (text, nullable)
- `steps` (jsonb, nullable)
- `difficulty` (text, nullable)
- `created_at` (timestamp)
- `updated_at` (timestamp)

**Operations:**

**Select All Sessions:**
```typescript
const { data, error } = await supabase
  .from('problem_solving_sessions')
  .select('*')
  .eq('user_id', userId)
  .order('created_at', { ascending: false });
```

**Create Session:**
```typescript
const { data, error } = await supabase
  .from('problem_solving_sessions')
  .insert({
    user_id: userId,
    title: 'Quadratic Equation',
    subject: 'Mathematics',
    problem_text: '2x² + 5x - 3 = 0',
    solution: JSON.stringify(solutionData),
    steps: solutionData.steps,
    difficulty: 'medium',
  });
```

**Delete Session:**
```typescript
const { error } = await supabase
  .from('problem_solving_sessions')
  .delete()
  .eq('id', sessionId)
  .eq('user_id', userId);
```

---

## Error Handling

### Error Response Format

All errors follow this structure:

```typescript
{
  error: string;        // Error message
  code?: string;        // Error code (optional)
  details?: any;        // Additional details (optional)
}
```

### Common Error Codes

**Authentication Errors:**
- `PGRST301`: RLS policy violation
- `auth/invalid-email`: Invalid email format
- `auth/weak-password`: Password too weak
- `auth/email-already-in-use`: Email already registered

**Database Errors:**
- `23505`: Unique constraint violation
- `23503`: Foreign key constraint violation
- `42P01`: Table doesn't exist

**Edge Function Errors:**
- `429`: Rate limit exceeded
- `402`: Payment required (credits exhausted)
- `500`: Internal server error

### Handling Errors

```typescript
const { data, error } = await supabase
  .from('table')
  .select('*');

if (error) {
  console.error('Database error:', error);
  
  // Check specific error codes
  if (error.code === 'PGRST301') {
    // Handle RLS policy error
    toast.error('Access denied');
  } else {
    // Handle generic error
    toast.error('An error occurred');
  }
}
```

---

## Rate Limits

### AI Functions Rate Limits

**Free Tier:**
- 50 requests per day
- 10 requests per minute

**Premium Tier:**
- Unlimited requests
- 100 requests per minute

### Database Rate Limits

**All Tiers:**
- 1000 requests per minute per user
- No daily limit

### Handling Rate Limits

```typescript
const { data, error } = await supabase.functions.invoke('ai-tutor', {
  body: { message, subject, sessionId },
});

if (error) {
  if (error.status === 429) {
    toast.error('Too many requests. Please wait a moment.');
  } else if (error.status === 402) {
    toast.error('AI credits exhausted. Please upgrade your plan.');
  }
}
```

---

## Pagination

### Basic Pagination

```typescript
const pageSize = 10;
const page = 0;

const { data, error } = await supabase
  .from('study_resources')
  .select('*')
  .range(page * pageSize, (page + 1) * pageSize - 1);
```

### Cursor-Based Pagination

```typescript
const { data, error } = await supabase
  .from('study_resources')
  .select('*')
  .gt('created_at', lastTimestamp)
  .order('created_at', { ascending: true })
  .limit(10);
```

---

## Real-time Subscriptions

### Subscribe to Table Changes

```typescript
const channel = supabase
  .channel('table-changes')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'study_resources',
      filter: `user_id=eq.${userId}`,
    },
    (payload) => {
      console.log('New resource created:', payload.new);
    }
  )
  .subscribe();

// Cleanup
supabase.removeChannel(channel);
```

### Subscribe to Multiple Events

```typescript
const channel = supabase
  .channel('all-changes')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'study_resources',
    },
    (payload) => {
      if (payload.eventType === 'INSERT') {
        // Handle insert
      } else if (payload.eventType === 'UPDATE') {
        // Handle update
      } else if (payload.eventType === 'DELETE') {
        // Handle delete
      }
    }
  )
  .subscribe();
```

---

## Best Practices

### 1. Always Handle Errors

```typescript
const { data, error } = await supabase.from('table').select('*');
if (error) {
  console.error('Error:', error);
  // Show user-friendly message
  return;
}
// Process data
```

### 2. Use TypeScript Types

```typescript
interface StudyResource {
  id: string;
  user_id: string;
  title: string;
  subject: string;
  content: any;
}

const { data, error } = await supabase
  .from('study_resources')
  .select('*')
  .returns<StudyResource[]>();
```

### 3. Optimize Queries

```typescript
// ❌ Bad - fetches all columns
const { data } = await supabase.from('profiles').select('*');

// ✅ Good - only fetch needed columns
const { data } = await supabase
  .from('profiles')
  .select('id, full_name, avatar_url');
```

### 4. Use RLS Policies

All queries automatically respect Row Level Security policies. Always design queries assuming RLS is enabled.

---

**API Version:** 1.0  
**Last Updated:** 2025  
**Support:** api-support@studysmart.com
