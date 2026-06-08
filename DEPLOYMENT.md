# Deployment Guide

## Frontend Deployment (Next.js)

### Deploy to Render

1. **Push your code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Create a new Web Service on Render**
   - Connect your GitHub repository
   - Render will automatically detect the Next.js project
   - The `render.yaml` file will configure the build settings

3. **Environment Variables**
   - Set `NEXT_PUBLIC_API_URL` to your backend URL (after backend deployment)

### Manual Deployment Settings (if not using render.yaml)
- **Build Command**: `npm run build`
- **Start Command**: `npm start`
- **Node Version**: 18 or higher

## Backend Deployment (FastAPI)

### Deploy to Render

1. **Create a new Web Service on Render**
   - Connect your GitHub repository (or create a separate repo for backend)
   - Use the `backend/render.yaml` configuration

2. **Environment Variables**
   - `API_KEY`: Render will auto-generate a secure key
   - `ALLOWED_ORIGINS`: Your frontend URL (e.g., `https://your-frontend.onrender.com`)
   - `PORT`: 8000 (default)

3. **Manual Deployment Settings (if not using render.yaml)**
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Python Version**: 3.9 or higher

## Security Features Implemented

### Backend Security
- **API Key Authentication**: All endpoints require valid API key
- **Rate Limiting**: 10 requests per minute per IP
- **CORS Protection**: Only allowed origins can access the API
- **Security Headers**: XSS protection, content type options, frame options
- **HTTPS Enforcement**: Uncomment HTTPS middleware in production

### Frontend Security
- Environment variables for API URL
- No sensitive data in client-side code

## Post-Deployment Steps

1. **Get your Backend URL**
   - Copy the URL from your Render dashboard (e.g., `https://your-backend.onrender.com`)

2. **Get your API Key**
   - Find the auto-generated API key in Render dashboard
   - Or set your own in environment variables

3. **Update Frontend**
   - Set `NEXT_PUBLIC_API_URL` in Render dashboard to your backend URL
   - Redeploy frontend if needed

4. **Update Backend CORS**
   - Set `ALLOWED_ORIGINS` to your frontend URL
   - Redeploy backend if needed

## Testing

### Test Backend Health
```bash
curl https://your-backend.onrender.com/health
```

### Test Secure Endpoint
```bash
curl -X POST https://your-backend.onrender.com/extract \
  -H "X-API-Key: your_api_key_here" \
  -F "file=@test_image.jpg"
```

## Important Notes

- **Keep API Keys Secret**: Never commit API keys to GitHub
- **Update ALLOWED_ORIGINS**: Only add trusted frontend URLs
- **Monitor Rate Limits**: Adjust rate limits based on your needs
- **Use HTTPS**: Always use HTTPS in production
- **Regular Updates**: Keep dependencies updated for security patches
