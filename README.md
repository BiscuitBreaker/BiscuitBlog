# BiscuitBlog Express

A modern full-stack blog application built with Express.js backend and React frontend, featuring PostgreSQL database integration and authentication.

## 🚀 Features

- **Blog Management**: Create, edit, and publish blog posts with MDX-like content
- **Memories Timeline**: Rich content memories with images and descriptions
- **Authentication**: Google OAuth integration with email allowlist
- **Search & Tags**: Full-text search and tag-based organization
- **File Uploads**: Image upload with automatic optimization
- **Responsive Design**: Mobile-first design with dark theme
- **SEO Ready**: RSS feeds, sitemap, and meta tags

## 🛠 Tech Stack

### Backend
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **PostgreSQL** - Database
- **Drizzle ORM** - Database toolkit
- **Passport.js** - Authentication
- **Sharp** - Image processing
- **Multer** - File uploads

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **React Router** - Routing
- **React Query** - Data fetching
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations

## 📦 Project Structure

```
├── backend/              # Express.js API server
│   ├── src/
│   │   ├── routes/       # API routes
│   │   ├── db/          # Database schema & connection
│   │   ├── config/      # Configuration files
│   │   └── index.ts     # Server entry point
│   ├── uploads/         # File uploads directory
│   └── package.json
├── frontend/            # React application
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── hooks/       # Custom hooks
│   │   ├── services/    # API services
│   │   └── main.tsx     # App entry point
│   └── package.json
└── package.json         # Root package file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL database
- Google OAuth credentials (optional)

### Installation

1. **Clone and install dependencies:**
   ```bash
   git clone <your-repo>
   cd BiscuitBreaker-Express
   npm run install:all
   ```

2. **Set up backend environment:**
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env with your database URL and other settings
   ```

3. **Set up database:**
   ```bash
   # Create PostgreSQL database
   createdb biscuitblog
   
   # Run migrations
   npm run db:migrate
   ```

4. **Start development servers:**
   ```bash
   cd ..
   npm run dev
   ```

5. **Open your browser:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 🔧 Environment Variables

### Backend (.env)
```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/biscuitblog

# Server
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Session
SESSION_SECRET=your-super-secret-session-key

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Email allowlist (comma-separated)
ALLOWLIST=your-email@gmail.com,another@gmail.com
```

## 📝 API Endpoints

### Authentication
- `GET /api/auth/me` - Get current user
- `GET /api/auth/google` - Start Google OAuth
- `POST /api/auth/logout` - Logout

### Posts
- `GET /api/posts` - Get all published posts
- `GET /api/posts/:slug` - Get single post
- `POST /api/posts` - Create new post (auth required)

### Memories
- `GET /api/memories` - Get all memories
- `POST /api/memories` - Create new memory (auth required)

### Uploads
- `POST /api/uploads/image` - Upload and optimize image

## 🚀 Deployment

### Render.com
1. Connect your GitHub repository to Render
2. Create a PostgreSQL database service
3. Create a web service for the backend:
   - Build command: `cd backend && npm install && npm run build`
   - Start command: `cd backend && npm start`
   - Add environment variables
4. Create a static site for the frontend:
   - Build command: `cd frontend && npm install && npm run build`
   - Publish directory: `frontend/dist`

### Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - Development: `http://localhost:5000/api/auth/google/callback`
   - Production: `https://your-domain.com/api/auth/google/callback`

## 🔨 Development

### Available Scripts

**Root:**
- `npm run dev` - Start both frontend and backend
- `npm run build` - Build both applications
- `npm run install:all` - Install all dependencies

**Backend:**
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run db:generate` - Generate database migrations
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Drizzle Studio

**Frontend:**
- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Database Schema

The application uses the following main tables:
- `users` - User accounts and profiles
- `posts` - Blog posts with content and metadata
- `memories` - Timeline memories with images
- `tags` - Content tags
- `post_tags` - Many-to-many relationship between posts and tags

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Next.js team for the inspiration
- Drizzle ORM for excellent TypeScript support
- Tailwind CSS for the utility-first approach
- All the open source contributors who made this possible