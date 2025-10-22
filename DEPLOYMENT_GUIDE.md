# StudySmart Deployment Guide

Complete guide for deploying StudySmart to production.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Lovable Deployment](#lovable-deployment)
3. [Vercel Deployment](#vercel-deployment)
4. [Netlify Deployment](#netlify-deployment)
5. [Custom Server Deployment](#custom-server-deployment)
6. [Environment Configuration](#environment-configuration)
7. [Database Setup](#database-setup)
8. [Edge Functions Deployment](#edge-functions-deployment)
9. [Domain Configuration](#domain-configuration)
10. [SSL/HTTPS Setup](#sslhttps-setup)
11. [Monitoring & Analytics](#monitoring--analytics)
12. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before deploying, ensure you have:

- [ ] Supabase project created and configured
- [ ] Database migrations applied
- [ ] Edge functions tested locally
- [ ] Environment variables documented
- [ ] Production build tested locally
- [ ] Domain name (if using custom domain)

---

## Lovable Deployment

### Quick Deployment

Lovable provides the easiest deployment option.

**Steps:**

1. **Open Your Project**
   - Go to [Lovable Dashboard](https://lovable.dev/projects/fa82d010-c844-467f-957c-25331a9faf66)

2. **Click Publish**
   - Find the "Publish" button in the top-right
   - Click to start deployment

3. **Wait for Build**
   - Build process takes 2-5 minutes
   - Progress shown in real-time

4. **Access Your App**
   - App available at: `https://your-app.lovable.app`
   - Click "Open App" to view

### Custom Domain on Lovable

1. **Navigate to Settings**
   - Project → Settings → Domains

2. **Add Domain**
   - Click "Connect Domain"
   - Enter your domain name
   - Follow DNS configuration steps

3. **Configure DNS**
   - Add CNAME record to your DNS provider
   - Point to Lovable's servers
   - Wait for DNS propagation (5-60 minutes)

4. **Verify**
   - Lovable will verify domain ownership
   - SSL certificate auto-generated
   - Domain ready to use

**Requirements:**
- Paid Lovable plan required for custom domains
- Domain must be registered with a provider

---

## Vercel Deployment

### Initial Setup

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Login to Vercel**
```bash
vercel login
```

### Deploy from CLI

```bash
# Build the project
npm run build

# Deploy to Vercel
vercel --prod
```

### Deploy from GitHub

1. **Connect Repository**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New Project"
   - Import your GitHub repository

2. **Configure Build**
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **Environment Variables**
   Add these in Vercel dashboard:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_key
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - App available at vercel URL

### Continuous Deployment

Every push to main branch automatically deploys.

**Branch Deployments:**
- `main` → Production
- Other branches → Preview deployments

---

## Netlify Deployment

### Deploy from Git

1. **Connect to Netlify**
   - Go to [Netlify Dashboard](https://app.netlify.com/)
   - Click "Add new site"
   - Choose "Import an existing project"

2. **Connect Repository**
   - Select GitHub/GitLab/Bitbucket
   - Authorize Netlify
   - Select your repository

3. **Build Settings**
   ```
   Build command: npm run build
   Publish directory: dist
   ```

4. **Environment Variables**
   - Go to Site settings → Environment variables
   - Add:
     ```
     VITE_SUPABASE_URL=your_supabase_url
     VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_key
     ```

5. **Deploy**
   - Click "Deploy site"
   - Wait for build
   - Site live at netlify subdomain

### Deploy from CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Initialize
netlify init

# Deploy
netlify deploy --prod
```

### Custom Domain on Netlify

1. **Add Domain**
   - Site settings → Domain management
   - Add custom domain

2. **Configure DNS**
   - Add DNS records provided by Netlify
   - Or use Netlify DNS

3. **Enable HTTPS**
   - Automatically enabled
   - Free SSL certificate

---

## Custom Server Deployment

### Build for Production

```bash
# Create production build
npm run build

# Output in dist/ folder
```

### Nginx Configuration

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/studysmart/dist;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

### Apache Configuration

```apache
<VirtualHost *:80>
    ServerName yourdomain.com
    DocumentRoot /var/www/studysmart/dist

    <Directory /var/www/studysmart/dist>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
        
        # SPA routing
        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </Directory>
</VirtualHost>
```

### PM2 (Node.js Process Manager)

```bash
# Install PM2
npm install -g pm2

# Serve with PM2
pm2 serve dist/ 3000 --spa

# Save PM2 config
pm2 save

# Auto-start on reboot
pm2 startup
```

---

## Environment Configuration

### Production Environment Variables

Create `.env.production`:

```env
# Supabase
VITE_SUPABASE_URL=https://yourproject.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key

# Optional: Analytics
VITE_GA_TRACKING_ID=UA-XXXXXXXXX-X
VITE_SENTRY_DSN=https://xxx@sentry.io/xxx
```

### Environment Variable Management

**Security Best Practices:**
- Never commit `.env` files to Git
- Use platform-specific environment variable managers
- Rotate keys regularly
- Use different keys for development/production

**Accessing in Code:**
```typescript
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
```

---

## Database Setup

### Production Database

1. **Create Supabase Project**
   - Go to [Supabase Dashboard](https://app.supabase.com/)
   - Create new project
   - Choose region closest to users
   - Note down project URL and keys

2. **Apply Migrations**
```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link to project
supabase link --project-ref your-project-ref

# Push migrations
supabase db push
```

3. **Verify Schema**
   - Check tables created
   - Verify RLS policies
   - Test with sample queries

### Database Optimization

**Indexes:**
```sql
-- Add indexes for frequent queries
CREATE INDEX idx_resources_user_id ON study_resources(user_id);
CREATE INDEX idx_resources_subject ON study_resources(subject);
CREATE INDEX idx_sessions_user_id ON chat_sessions(user_id);
```

**Performance Settings:**
- Enable connection pooling
- Set appropriate timeout values
- Monitor query performance

---

## Edge Functions Deployment

### Deploy Functions

```bash
# Deploy all functions
supabase functions deploy

# Deploy specific function
supabase functions deploy ai-tutor
supabase functions deploy solve-problem
```

### Set Function Secrets

```bash
# Set Lovable API key
supabase secrets set LOVABLE_API_KEY=your_key_here

# Verify secrets
supabase secrets list
```

### Function Configuration

Update `supabase/config.toml`:

```toml
[functions.ai-tutor]
verify_jwt = true

[functions.solve-problem]
verify_jwt = true
```

### Monitor Functions

- Go to Supabase Dashboard
- Edge Functions → Select function
- View logs and metrics
- Monitor error rates

---

## Domain Configuration

### DNS Records

**For apex domain (example.com):**
```
A     @     192.0.2.1
AAAA  @     2001:db8::1
```

**For subdomain (www.example.com):**
```
CNAME www   your-app.lovable.app
```

**For custom subdomain (app.example.com):**
```
CNAME app   your-app.lovable.app
```

### DNS Providers

**Cloudflare:**
1. Add site to Cloudflare
2. Update nameservers at registrar
3. Add DNS records
4. Enable proxy (orange cloud)

**Namecheap:**
1. Domain List → Manage
2. Advanced DNS
3. Add records

**GoDaddy:**
1. My Products → DNS
2. Add records

### Propagation

DNS changes take 5 minutes to 48 hours to propagate globally.

Check propagation: https://dnschecker.org/

---

## SSL/HTTPS Setup

### Automatic SSL (Recommended)

**Lovable/Vercel/Netlify:**
- SSL automatically configured
- Free Let's Encrypt certificates
- Auto-renewal

### Manual SSL (Custom Server)

**Let's Encrypt with Certbot:**

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal
sudo certbot renew --dry-run
```

**Nginx HTTPS Configuration:**

```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # SSL settings
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # ... rest of config
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}
```

---

## Monitoring & Analytics

### Error Tracking

**Sentry Integration:**

```bash
npm install @sentry/react
```

```typescript
// main.tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
  tracesSampleRate: 1.0,
});
```

### Analytics

**Google Analytics:**

```html
<!-- index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_TRACKING_ID');
</script>
```

### Performance Monitoring

**Supabase Dashboard:**
- Database queries
- API response times
- Error rates

**Vercel/Netlify Analytics:**
- Page views
- Load times
- Geographic distribution

---

## Troubleshooting

### Build Failures

**Issue:** Build fails with TypeScript errors

**Solution:**
```bash
# Check TypeScript errors locally
npm run build

# Fix errors in code
# Ensure all types are correct
```

**Issue:** Missing environment variables

**Solution:**
- Verify all required env vars are set in deployment platform
- Check variable names match exactly

### Runtime Errors

**Issue:** Supabase connection fails

**Solution:**
- Verify SUPABASE_URL is correct
- Check SUPABASE_PUBLISHABLE_KEY is the anon key
- Ensure RLS policies allow access

**Issue:** Edge functions not working

**Solution:**
- Verify functions are deployed: `supabase functions list`
- Check function logs in Supabase dashboard
- Ensure secrets are set correctly

### Performance Issues

**Issue:** Slow page loads

**Solution:**
- Enable Gzip compression
- Optimize images
- Enable caching headers
- Use CDN

**Issue:** Database queries slow

**Solution:**
- Add indexes to frequently queried columns
- Optimize query complexity
- Enable connection pooling

### SSL Issues

**Issue:** SSL certificate not working

**Solution:**
- Wait for DNS propagation
- Verify DNS records are correct
- Check SSL configuration in platform

---

## Post-Deployment Checklist

- [ ] Test all pages and features
- [ ] Verify authentication works
- [ ] Test AI chat and problem solver
- [ ] Check all CRUD operations
- [ ] Test on mobile devices
- [ ] Verify SSL certificate
- [ ] Test custom domain (if applicable)
- [ ] Set up monitoring and alerts
- [ ] Configure backups
- [ ] Document deployment process
- [ ] Update team on deployment

---

## Rollback Procedure

### Vercel/Netlify

1. Go to Deployments
2. Find previous working deployment
3. Click "Promote to Production"

### Custom Server

```bash
# Keep previous build
mv dist dist-backup

# If issues occur
rm -rf dist
mv dist-backup dist
pm2 restart all
```

### Database Rollback

```bash
# Create backup before migration
pg_dump database_url > backup.sql

# Restore if needed
psql database_url < backup.sql
```

---

## Maintenance

### Regular Tasks

**Weekly:**
- Review error logs
- Check performance metrics
- Monitor disk space

**Monthly:**
- Update dependencies
- Review and rotate API keys
- Database maintenance (vacuum, analyze)

**Quarterly:**
- Security audit
- Load testing
- Backup verification

---

**Deployment Version:** 1.0  
**Last Updated:** 2025  
**Support:** devops@studysmart.com
