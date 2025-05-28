# Environment Setup

## Development Environment Variables

To run this project locally, you need to set up environment variables. Follow these steps:

### 1. Copy the environment template
\`\`\`bash
cp .env.example .env.local
\`\`\`

### 2. Configure Supabase
1. Go to [Supabase](https://supabase.com) and create a new project
2. Go to Settings > API in your Supabase dashboard
3. Copy the following values to your `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`: Your project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your anon/public key
   - `SUPABASE_SERVICE_ROLE_KEY`: Your service role key (keep this secret!)
   - `SUPABASE_JWT_SECRET`: Your JWT secret

### 3. Configure Email (SMTP)
For the contact form to work, configure SMTP settings:
- **Gmail**: Use your Gmail address and an app password
- **Other providers**: Use your SMTP server details

### 4. Configure reCAPTCHA (Optional)
To prevent spam on the contact form:
1. Go to [Google reCAPTCHA](https://www.google.com/recaptcha/)
2. Create a new site (v2 checkbox)
3. Add your domain
4. Copy the site key and secret key to your `.env.local`

### 5. Database Setup
Run the database migrations:
\`\`\`bash
# Run the SQL files in your Supabase SQL editor
# 1. supabase-schema.sql
# 2. database-schema-update.sql (for slug support)
# 3. database-optimizations.sql
\`\`\`

### 6. Start Development Server
\`\`\`bash
npm run dev
\`\`\`

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | Yes |
| `SMTP_HOST` | SMTP server hostname | Yes |
| `SMTP_PORT` | SMTP server port | Yes |
| `SMTP_USER` | SMTP username | Yes |
| `SMTP_PASSWORD` | SMTP password | Yes |
| `SMTP_FROM` | From email address | Yes |
| `SMTP_TO` | Contact form destination email | Yes |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | reCAPTCHA site key | No |
| `RECAPTCHA_SECRET_KEY` | reCAPTCHA secret key | No |
