# StudySmart Developer Guide

## Welcome, Developer! 👨‍💻

This guide will help you understand the StudySmart codebase, contribute effectively, and build new features.

---

## Table of Contents

1. [Development Environment Setup](#development-environment-setup)
2. [Project Structure](#project-structure)
3. [Architecture Overview](#architecture-overview)
4. [Code Standards](#code-standards)
5. [Component Development](#component-development)
6. [State Management](#state-management)
7. [API Integration](#api-integration)
8. [Database Operations](#database-operations)
9. [Edge Functions](#edge-functions)
10. [Testing](#testing)
11. [Debugging](#debugging)
12. [Contributing](#contributing)

---

## Development Environment Setup

### Prerequisites

Ensure you have these installed:

```bash
# Node.js (v18+)
node --version  # Should show v18.x.x or higher

# npm or yarn
npm --version   # Should show 8.x.x or higher

# Git
git --version   # Should show 2.x.x or higher
```

### Initial Setup

```bash
# 1. Clone the repository
git clone <repository-url>
cd studysmart

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your Supabase credentials

# 4. Start development server
npm run dev
```

### Environment Variables

Create a `.env` file in the root:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key

# Optional: Development
VITE_ENABLE_DEV_TOOLS=true
VITE_LOG_LEVEL=debug
```

### Development Tools

**Recommended VS Code Extensions:**
```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next",
    "usernamehw.errorlens"
  ]
}
```

**VS Code Settings:**
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

---

## Project Structure

### Directory Layout

```
studysmart/
├── public/                 # Static assets
│   ├── robots.txt
│   └── images/
├── src/
│   ├── assets/            # Images, fonts, etc.
│   ├── components/        # React components
│   │   ├── ui/           # shadcn/ui components
│   │   ├── ChatInterface.tsx
│   │   ├── ProblemSolver.tsx
│   │   └── ...
│   ├── pages/            # Route pages
│   │   ├── Index.tsx     # Landing page
│   │   ├── Dashboard.tsx # Main app
│   │   └── Auth.tsx      # Authentication
│   ├── hooks/            # Custom hooks
│   │   └── use-toast.ts
│   ├── lib/              # Utilities
│   │   └── utils.ts
│   ├── integrations/     # External services
│   │   └── supabase/
│   │       ├── client.ts
│   │       └── types.ts
│   ├── index.css         # Global styles
│   ├── App.tsx           # Root component
│   └── main.tsx          # Entry point
├── supabase/
│   ├── functions/        # Edge functions
│   │   ├── ai-tutor/
│   │   └── solve-problem/
│   ├── migrations/       # Database migrations
│   └── config.toml       # Supabase config
├── .env                  # Environment variables
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.ts
```

### File Naming Conventions

```
Components:     PascalCase      ChatInterface.tsx
Utilities:      camelCase       utils.ts
Hooks:          kebab-case      use-toast.ts
Styles:         kebab-case      button.module.css
Constants:      UPPER_SNAKE     API_ENDPOINTS.ts
Types:          PascalCase      UserProfile.ts
```

---

## Architecture Overview

### Frontend Architecture

```
┌─────────────────────────────────────────┐
│           React Application              │
│                                          │
│  ┌────────────────────────────────┐    │
│  │         Pages                   │    │
│  │  - Index (Landing)              │    │
│  │  - Dashboard (Main App)         │    │
│  │  - Auth (Login/Signup)          │    │
│  └────────────────────────────────┘    │
│                ↓                         │
│  ┌────────────────────────────────┐    │
│  │       Components                │    │
│  │  - ChatInterface                │    │
│  │  - ProblemSolver                │    │
│  │  - StudyResources               │    │
│  │  - etc.                         │    │
│  └────────────────────────────────┘    │
│                ↓                         │
│  ┌────────────────────────────────┐    │
│  │    Supabase Client              │    │
│  │  - Authentication               │    │
│  │  - Database queries             │    │
│  │  - Function invocations         │    │
│  └────────────────────────────────┘    │
└─────────────────────────────────────────┘
```

### Backend Architecture

```
┌─────────────────────────────────────────┐
│         Supabase Backend                 │
│                                          │
│  ┌────────────────────────────────┐    │
│  │      Edge Functions             │    │
│  │  - ai-tutor                     │    │
│  │  - solve-problem                │    │
│  └────────────────────────────────┘    │
│                ↓                         │
│  ┌────────────────────────────────┐    │
│  │    External Services            │    │
│  │  - Lovable AI Gateway           │    │
│  │  - Google Gemini                │    │
│  └────────────────────────────────┘    │
│                                          │
│  ┌────────────────────────────────┐    │
│  │      PostgreSQL Database        │    │
│  │  - Tables with RLS              │    │
│  │  - Functions & Triggers         │    │
│  └────────────────────────────────┘    │
└─────────────────────────────────────────┘
```

### Data Flow

```
User Action
    ↓
React Component
    ↓
Event Handler
    ↓
Supabase Client Method
    ↓
[Database Query OR Edge Function]
    ↓
    ├→ Database: RLS Check → Query → Response
    └→ Edge Function: Processing → AI API → Response
    ↓
Update Component State
    ↓
Re-render UI
```

---

## Code Standards

### TypeScript Standards

**Always use explicit types:**

```typescript
// ❌ Bad
const fetchUsers = async () => {
  const data = await supabase.from('profiles').select('*');
  return data;
};

// ✅ Good
interface UserProfile {
  id: string;
  user_id: string;
  full_name: string | null;
  avatar_url: string | null;
}

const fetchUsers = async (): Promise<UserProfile[]> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*');
  
  if (error) throw error;
  return data as UserProfile[];
};
```

**Use interfaces for object shapes:**

```typescript
// Component props
interface ChatInterfaceProps {
  userId: string;
  onMessageSent?: (message: string) => void;
}

// API responses
interface AIResponse {
  response: string;
  timestamp: number;
}
```

### React Standards

**Functional components with TypeScript:**

```typescript
import React, { useState, useEffect } from 'react';

interface MyComponentProps {
  title: string;
  onSave: (data: string) => void;
}

export const MyComponent: React.FC<MyComponentProps> = ({ 
  title, 
  onSave 
}) => {
  const [data, setData] = useState<string>('');

  useEffect(() => {
    // Effect logic
  }, []);

  return (
    <div>
      <h1>{title}</h1>
      {/* Component JSX */}
    </div>
  );
};
```

**Custom hooks:**

```typescript
// hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return { user, loading };
};
```

### Styling Standards

**Use Tailwind utility classes:**

```tsx
// ❌ Bad - inline styles
<div style={{ padding: '16px', backgroundColor: '#fff' }}>

// ✅ Good - Tailwind utilities
<div className="p-4 bg-white">
```

**Use semantic color tokens:**

```tsx
// ❌ Bad - direct colors
<Button className="bg-blue-500 text-white">

// ✅ Good - semantic tokens
<Button variant="default">
```

**Responsive design:**

```tsx
<div className="flex flex-col md:flex-row gap-4">
  <div className="w-full md:w-1/2">Left</div>
  <div className="w-full md:w-1/2">Right</div>
</div>
```

### Error Handling

**Always handle errors:**

```typescript
// ❌ Bad
const saveData = async (data: any) => {
  await supabase.from('table').insert(data);
};

// ✅ Good
const saveData = async (data: any) => {
  try {
    const { error } = await supabase
      .from('table')
      .insert(data);
    
    if (error) throw error;
    
    toast({
      title: "Success",
      description: "Data saved successfully",
    });
  } catch (error) {
    console.error('Error saving data:', error);
    toast({
      title: "Error",
      description: "Failed to save data",
      variant: "destructive",
    });
  }
};
```

---

## Component Development

### Component Template

```typescript
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface MyFeatureProps {
  userId: string;
  onComplete?: () => void;
}

export const MyFeature: React.FC<MyFeatureProps> = ({ 
  userId, 
  onComplete 
}) => {
  // State
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Effects
  useEffect(() => {
    loadData();
  }, [userId]);

  // Handlers
  const loadData = async () => {
    setLoading(true);
    try {
      // Load data logic
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async () => {
    try {
      // Action logic
      onComplete?.();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Action failed');
    }
  };

  // Render
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Feature</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Content */}
        <Button onClick={handleAction}>
          Do Something
        </Button>
      </CardContent>
    </Card>
  );
};
```

### Using shadcn/ui Components

```typescript
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const MyDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dialog Title</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Enter name" />
          </div>
          <Button>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
```

---

## State Management

### Local State (useState)

```typescript
const [count, setCount] = useState(0);
const [text, setText] = useState('');
const [isOpen, setIsOpen] = useState(false);
```

### Form State (react-hook-form)

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  subject: z.string().min(1, 'Subject is required'),
});

type FormData = z.infer<typeof schema>;

const MyForm = () => {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      subject: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    console.log(data);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* Form fields */}
    </form>
  );
};
```

### Server State (Supabase)

```typescript
const [data, setData] = useState<any[]>([]);

useEffect(() => {
  const fetchData = async () => {
    const { data, error } = await supabase
      .from('table')
      .select('*');
    
    if (data) setData(data);
  };
  
  fetchData();
}, []);
```

---

## API Integration

### Supabase Client Usage

```typescript
import { supabase } from '@/integrations/supabase/client';

// SELECT
const { data, error } = await supabase
  .from('study_resources')
  .select('*')
  .eq('user_id', userId)
  .order('created_at', { ascending: false });

// INSERT
const { data, error } = await supabase
  .from('study_resources')
  .insert({
    user_id: userId,
    title: 'My Resource',
    subject: 'Math',
  });

// UPDATE
const { data, error } = await supabase
  .from('study_resources')
  .update({ title: 'Updated Title' })
  .eq('id', resourceId);

// DELETE
const { data, error } = await supabase
  .from('study_resources')
  .delete()
  .eq('id', resourceId);
```

### Edge Function Invocation

```typescript
const { data, error } = await supabase.functions.invoke('ai-tutor', {
  body: {
    message: 'Explain photosynthesis',
    subject: 'Biology',
    sessionId: 'session-uuid',
  },
});

if (error) {
  console.error('Function error:', error);
  toast.error('AI request failed');
  return;
}

console.log('AI response:', data.response);
```

---

## Database Operations

### Query Patterns

**Filtering:**
```typescript
// Single condition
.eq('column', value)
.neq('column', value)
.gt('column', value)
.lt('column', value)

// Multiple conditions
.or('status.eq.active,status.eq.pending')
.and('age.gte.18,age.lte.65')
```

**Ordering:**
```typescript
.order('created_at', { ascending: false })
.order('title', { ascending: true })
```

**Pagination:**
```typescript
.range(0, 9)  // First 10 items
.range(10, 19)  // Next 10 items
```

**Joins:**
```typescript
.select(`
  *,
  profiles (
    full_name,
    avatar_url
  )
`)
```

### Real-time Subscriptions

```typescript
useEffect(() => {
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
        console.log('New resource:', payload.new);
        // Update local state
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, [userId]);
```

---

## Edge Functions

### Creating an Edge Function

**1. Create function directory:**
```bash
mkdir -p supabase/functions/my-function
touch supabase/functions/my-function/index.ts
```

**2. Function template:**
```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { param1, param2 } = await req.json();

    // Your logic here
    const result = processData(param1, param2);

    return new Response(
      JSON.stringify({ result }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
```

### Testing Edge Functions Locally

```bash
# Install Supabase CLI
npm install -g supabase

# Start local Supabase
supabase start

# Serve function locally
supabase functions serve my-function

# Test with curl
curl -X POST http://localhost:54321/functions/v1/my-function \
  -H "Content-Type: application/json" \
  -d '{"param1": "value1"}'
```

### Deploying Edge Functions

```bash
# Deploy single function
supabase functions deploy my-function

# Deploy all functions
supabase functions deploy
```

---

## Testing

### Unit Testing (Coming Soon)

```typescript
// __tests__/MyComponent.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { MyComponent } from '@/components/MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent userId="123" />);
    expect(screen.getByText('My Component')).toBeInTheDocument();
  });

  it('handles button click', () => {
    const handleClick = jest.fn();
    render(<MyComponent onClick={handleClick} />);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalled();
  });
});
```

### Integration Testing

```typescript
// Test Supabase operations
describe('Database operations', () => {
  it('creates a resource', async () => {
    const { data, error } = await supabase
      .from('study_resources')
      .insert({
        user_id: 'test-user',
        title: 'Test Resource',
        subject: 'Math',
      });

    expect(error).toBeNull();
    expect(data).toBeDefined();
  });
});
```

---

## Debugging

### Browser DevTools

**Console logging:**
```typescript
console.log('Data:', data);
console.error('Error:', error);
console.table(arrayOfObjects);
console.group('Group Name');
// ... nested logs
console.groupEnd();
```

**Network tab:**
- Monitor API requests
- Check request/response payloads
- Verify status codes

**React DevTools:**
- Inspect component tree
- View props and state
- Profile performance

### Supabase Logging

**Edge function logs:**
```typescript
console.log('Function started');
console.log('Input:', JSON.stringify(input));
console.error('Error details:', error);
```

**View logs in Supabase dashboard:**
- Go to Edge Functions
- Select your function
- Click "Logs" tab

### Common Issues

**Authentication errors:**
```typescript
// Check if user is authenticated
const { data: { session } } = await supabase.auth.getSession();
if (!session) {
  console.error('No active session');
}
```

**RLS policy errors:**
```typescript
// Test RLS policies
const { data, error } = await supabase
  .from('table')
  .select('*');

if (error?.code === 'PGRST301') {
  console.error('RLS policy blocking access');
}
```

---

## Contributing

### Workflow

1. **Create a branch:**
```bash
git checkout -b feature/my-feature
```

2. **Make changes:**
- Write code
- Follow code standards
- Add comments

3. **Test changes:**
```bash
npm run dev
# Manual testing
```

4. **Commit:**
```bash
git add .
git commit -m "feat: add my feature"
```

5. **Push:**
```bash
git push origin feature/my-feature
```

6. **Create Pull Request:**
- Go to GitHub
- Create PR from your branch
- Describe changes
- Request review

### Commit Message Format

```
type(scope): subject

body

footer
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance

**Examples:**
```
feat(chat): add message history
fix(auth): resolve login redirect issue
docs(readme): update installation instructions
```

### Code Review Checklist

- [ ] Code follows project standards
- [ ] TypeScript types are explicit
- [ ] Error handling is implemented
- [ ] UI is responsive
- [ ] Accessibility considered
- [ ] Comments added where needed
- [ ] No console.log in production
- [ ] Performance optimized

---

## Additional Resources

### Documentation Links

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)

### Project Resources

- **Repository**: [GitHub URL]
- **Deployment**: [Production URL]
- **Design System**: See `src/index.css` and `tailwind.config.ts`
- **API Docs**: See PROJECT_DOCUMENTATION.md

---

**Happy Coding! 🚀**

*For questions or help, reach out to the team on Discord or email dev@studysmart.com*

**Version:** 1.0  
**Last Updated:** 2025
