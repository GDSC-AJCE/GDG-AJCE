# Backend CORS Configuration Guide

## Issue
The frontend is receiving CORS errors when trying to fetch data from the backend API at `https://gdg-ajce.onrender.com/api/leaderboard`.

## Solution Implemented

### 1. Created CorsConfig.java
A new CORS configuration file has been added at:
`server/src/main/java/com/gdg/backend/config/CorsConfig.java`

This configuration:
- Allows requests from any origin (using `allowedOriginPatterns`)
- Supports GET, POST, PUT, DELETE, and OPTIONS methods
- Allows common headers (Origin, Content-Type, Accept, Authorization)
- Enables credentials
- Sets appropriate cache time for preflight requests

### 2. Frontend Changes
The frontend has been updated to:
- Only call the `/api/leaderboard` endpoint (the only one that exists)
- Calculate stats, top performers, and weekly data from the leaderboard response
- Add proper error handling and loading states
- Log detailed information for debugging

## Next Steps - Backend Deployment

### To Deploy the CORS Fix:

1. **Verify the CorsConfig.java file is in the correct location:**
   ```
   server/src/main/java/com/gdg/backend/config/CorsConfig.java
   ```

2. **Rebuild and redeploy the backend:**
   ```bash
   cd server
   mvn clean package
   ```

3. **Deploy to Render:**
   - Push the changes to your GitHub repository
   - Render will automatically detect and deploy the changes
   - Or manually trigger a deployment from the Render dashboard

### Testing After Deployment:

1. Open your browser's developer console
2. Navigate to the leaderboard page
3. Check the console logs for:
   - Successful API calls
   - Response data
   - No CORS errors

### Expected Console Output:
```
Fetching leaderboard data from: https://gdg-ajce.onrender.com/api/leaderboard
Response status: 200
Response headers: {access-control-allow-origin: "*", ...}
Received data: [{...}, {...}, ...]
```

## Alternative: Quick CORS Fix with Application Properties

If the Java configuration doesn't work, you can also try adding to `application.properties`:

```properties
# CORS Configuration
spring.web.cors.allowed-origins=*
spring.web.cors.allowed-methods=GET,POST,PUT,DELETE,OPTIONS
spring.web.cors.allowed-headers=*
spring.web.cors.allow-credentials=true
```

## Production Security Note

⚠️ **Important for Production:**

The current configuration allows ALL origins (`*`). For production, you should restrict this to your specific frontend domain:

```java
// Instead of:
corsConfiguration.setAllowedOriginPatterns(Collections.singletonList("*"));

// Use:
corsConfiguration.setAllowedOrigins(Arrays.asList(
    "https://your-frontend-domain.com",
    "https://www.your-frontend-domain.com"
));
```

## Troubleshooting

### If CORS errors persist:

1. **Check if the backend is running:**
   ```bash
   curl https://gdg-ajce.onrender.com/api/leaderboard
   ```

2. **Verify CORS headers in response:**
   ```bash
   curl -I https://gdg-ajce.onrender.com/api/leaderboard
   ```
   Look for: `Access-Control-Allow-Origin: *`

3. **Check Render logs:**
   - Go to Render dashboard
   - View your service logs
   - Look for any startup errors or CORS-related issues

4. **Clear browser cache:**
   - CORS headers can be cached
   - Try in incognito mode or clear cache

### Common Issues:

1. **404 Errors:** Make sure the backend is deployed and running
2. **500 Errors:** Check backend logs for application errors
3. **Still CORS errors:** Ensure the CorsConfig is being loaded (check Spring Boot startup logs)

## Contact

If issues persist after deployment, check:
- Backend service status on Render
- Environment variables are properly set
- Google Sheets API credentials are valid
