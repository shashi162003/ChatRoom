# Deployment Guide

## Overview

This guide covers deploying the ChatRoom application to production using Render for the backend and Vercel for the frontend.

## Architecture

```
┌─────────────────┐    WebSocket    ┌─────────────────┐
│   Frontend      │◄──────────────►│    Backend      │
│   (Vercel)      │                │   (Render)      │
│                 │                │                 │
│ React + Vite    │                │ Node.js + WS    │
│ Tailwind CSS    │                │ TypeScript      │
└─────────────────┘                └─────────────────┘
```

## Backend Deployment (Render)

### Prerequisites
- GitHub repository
- Render account

### Step 1: Prepare Backend for Deployment

1. **Update package.json scripts**:
```json
{
  "scripts": {
    "build": "tsc -b",
    "start": "node dist/index.js",
    "dev": "tsc -b && node dist/index.js"
  }
}
```

2. **Environment Configuration**:
The backend automatically uses `process.env.PORT` for deployment.

### Step 2: Deploy to Render

1. **Create New Web Service**:
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New" → "Web Service"
   - Connect your GitHub repository

2. **Configure Service**:
   ```
   Name: chatroom-backend
   Environment: Node
   Region: Choose closest to your users
   Branch: main
   Root Directory: backend
   Build Command: npm install && npm run build
   Start Command: npm start
   ```

3. **Environment Variables**:
   ```
   NODE_ENV=production
   ```

4. **Advanced Settings**:
   ```
   Auto-Deploy: Yes
   Health Check Path: / (optional)
   ```

### Step 3: Verify Deployment

1. **Check Logs**:
   - Monitor deployment logs in Render dashboard
   - Look for "✅ ChatRoom WebSocket server running on port XXXX"

2. **Test WebSocket Connection**:
   ```javascript
   const ws = new WebSocket('wss://your-app-name.onrender.com');
   ws.onopen = () => console.log('Connected!');
   ```

## Frontend Deployment (Vercel)

### Prerequisites
- GitHub repository
- Vercel account

### Step 1: Prepare Frontend for Deployment

1. **Update WebSocket URL**:
   Create `.env.production` in frontend directory:
   ```
   VITE_WS_URL=wss://your-backend-url.onrender.com
   ```

2. **Verify Build Configuration**:
   ```typescript
   // vite.config.ts
   export default defineConfig({
     plugins: [react(), tailwindcss()],
     build: {
       outDir: 'dist',
       sourcemap: true
     }
   });
   ```

### Step 2: Deploy to Vercel

1. **Import Project**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import from GitHub

2. **Configure Project**:
   ```
   Framework Preset: Vite
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

3. **Environment Variables**:
   ```
   VITE_WS_URL=wss://your-backend-url.onrender.com
   ```

4. **Deploy**:
   - Click "Deploy"
   - Wait for build completion

### Step 3: Verify Deployment

1. **Test Application**:
   - Visit your Vercel URL
   - Create a room
   - Send messages
   - Test with multiple browser tabs

## Environment Configuration

### Backend Environment Variables
```bash
# Required
PORT=8080                    # Auto-assigned by Render

# Optional
NODE_ENV=production         # Set by Render
```

### Frontend Environment Variables
```bash
# Required for production
VITE_WS_URL=wss://your-backend-url.onrender.com

# Optional
NODE_ENV=production         # Set by Vercel
```

## Custom Domain Setup

### Backend (Render)
1. Go to your service settings
2. Click "Custom Domains"
3. Add your domain (e.g., `api.yourdomain.com`)
4. Configure DNS records as instructed

### Frontend (Vercel)
1. Go to project settings
2. Click "Domains"
3. Add your domain (e.g., `yourdomain.com`)
4. Configure DNS records as instructed

## SSL/TLS Configuration

Both Render and Vercel provide automatic SSL certificates:
- **Render**: Automatic SSL for `.onrender.com` domains and custom domains
- **Vercel**: Automatic SSL for `.vercel.app` domains and custom domains

## Monitoring and Logs

### Backend Monitoring (Render)
1. **Logs**: Real-time logs in Render dashboard
2. **Metrics**: CPU, memory, and network usage
3. **Health Checks**: Automatic service monitoring

### Frontend Monitoring (Vercel)
1. **Analytics**: Built-in web analytics
2. **Function Logs**: Serverless function monitoring
3. **Performance**: Core Web Vitals tracking

## Scaling

### Backend Scaling (Render)
- **Vertical Scaling**: Upgrade to higher-tier plans
- **Horizontal Scaling**: Multiple instances (Pro plans)
- **Auto-scaling**: Based on CPU/memory usage

### Frontend Scaling (Vercel)
- **Global CDN**: Automatic worldwide distribution
- **Edge Functions**: Serverless compute at the edge
- **Bandwidth**: Unlimited for most plans

## Troubleshooting

### Common Deployment Issues

1. **Backend Build Failures**:
   ```bash
   # Check TypeScript compilation
   npm run build
   
   # Verify dependencies
   npm install
   ```

2. **Frontend Build Failures**:
   ```bash
   # Check Vite build
   npm run build
   
   # Verify environment variables
   echo $VITE_WS_URL
   ```

3. **WebSocket Connection Issues**:
   - Verify backend URL is correct
   - Check if backend is running
   - Ensure WSS (not WS) for HTTPS sites

4. **CORS Issues**:
   WebSocket connections don't require CORS configuration.

### Debug Commands

```bash
# Test backend locally
cd backend && npm run dev

# Test frontend locally
cd frontend && npm run dev

# Build both for production
cd backend && npm run build
cd frontend && npm run build
```

## Performance Optimization

### Backend Optimization
- Use production Node.js version
- Enable gzip compression
- Implement connection pooling
- Add rate limiting

### Frontend Optimization
- Enable Vite build optimizations
- Use code splitting
- Optimize images and assets
- Implement service workers

## Security Considerations

### Backend Security
- Use environment variables for secrets
- Implement rate limiting
- Add input validation
- Use HTTPS/WSS only

### Frontend Security
- Sanitize user inputs
- Use environment variables for URLs
- Implement CSP headers
- Regular dependency updates

## Backup and Recovery

### Database Backup
Currently using in-memory storage. For production:
- Consider Redis for session storage
- Implement data persistence
- Regular backup procedures

### Code Backup
- GitHub repository serves as primary backup
- Tag releases for rollback capability
- Maintain staging environment

## Cost Optimization

### Render Costs
- **Free Tier**: Limited hours, good for testing
- **Starter**: $7/month, suitable for small apps
- **Standard**: $25/month, production ready

### Vercel Costs
- **Hobby**: Free for personal projects
- **Pro**: $20/month per user, commercial use
- **Enterprise**: Custom pricing

## Maintenance

### Regular Tasks
1. **Dependency Updates**: Monthly security updates
2. **Performance Monitoring**: Weekly performance checks
3. **Log Review**: Daily log analysis
4. **Backup Verification**: Weekly backup tests

### Update Process
1. Test changes locally
2. Deploy to staging environment
3. Run integration tests
4. Deploy to production
5. Monitor for issues
