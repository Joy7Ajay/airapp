# Testing APIs with Thunder Client

## What is Thunder Client?

Thunder Client is a lightweight API testing tool built into VS Code. It's similar to Postman but runs directly in your editor, making it perfect for testing APIs during development.

## Installation

1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X)
3. Search for "Thunder Client"
4. Install the extension by Ranga Vadhineni

## Getting Started

### 1. Open Thunder Client
- Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
- Type "Thunder Client" and select "Thunder Client: New Request"

### 2. Basic Request Structure
- **Method**: GET, POST, PUT, DELETE, etc.
- **URL**: Your API endpoint
- **Headers**: Authentication, content-type, etc.
- **Body**: Request data (for POST/PUT requests)

## Testing Your Flask API

Your API is running on Flask with the following base URL: `http://localhost:5000`

### Available Endpoints

#### 1. Authentication Endpoints

**Register User**
- Method: `POST`
- URL: `http://localhost:5000/api/register`
- Headers: `Content-Type: application/json`
- Body:
```json
{
  "email": "test@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Login**
- Method: `POST`
- URL: `http://localhost:5000/api/login`
- Headers: `Content-Type: application/json`
- Body:
```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

#### 2. ML/Analytics Endpoints (Require JWT Token)

**Predict Passengers**
- Method: `POST`
- URL: `http://localhost:5000/api/predict`
- Headers: 
  - `Content-Type: application/json`
  - `Authorization: Bearer YOUR_JWT_TOKEN`
- Body:
```json
{
  "data": [1, 2, 3, 4, 5]
}
```

**Detect Anomalies**
- Method: `POST`
- URL: `http://localhost:5000/api/detect_anomalies`
- Headers:
  - `Content-Type: application/json`
  - `Authorization: Bearer YOUR_JWT_TOKEN`
- Body:
```json
{
  "data": [1, 2, 3, 4, 5]
}
```

**Generate Insights**
- Method: `POST`
- URL: `http://localhost:5000/api/generate_insights`
- Headers:
  - `Content-Type: application/json`
  - `Authorization: Bearer YOUR_JWT_TOKEN`
- Body:
```json
{
  "text": "Your text data here"
}
```

**Count Passengers**
- Method: `POST`
- URL: `http://localhost:5000/api/count_passengers`
- Headers:
  - `Content-Type: application/json`
  - `Authorization: Bearer YOUR_JWT_TOKEN`
- Body: Form data with image file

#### 3. Data Management Endpoints

**Upload File**
- Method: `POST`
- URL: `http://localhost:5000/api/upload`
- Headers: `Content-Type: multipart/form-data`
- Body: Form data with file

**Import External Data**
- Method: `POST`
- URL: `http://localhost:5000/api/import/external`
- Headers:
  - `Content-Type: application/json`
  - `Authorization: Bearer YOUR_JWT_TOKEN`
- Body:
```json
{
  "source": "external_source",
  "parameters": {}
}
```

#### 4. Public Endpoints

**Test Route**
- Method: `GET`
- URL: `http://localhost:5000/api/test`

**Get Passenger Data**
- Method: `GET`
- URL: `http://localhost:5000/api/passenger_data`

#### 5. User Management Endpoints (Require JWT Token)

**Get Notifications**
- Method: `GET`
- URL: `http://localhost:5000/api/notifications`
- Headers: `Authorization: Bearer YOUR_JWT_TOKEN`

**Mark Notification Read**
- Method: `POST`
- URL: `http://localhost:5000/api/notifications/mark_read`
- Headers:
  - `Content-Type: application/json`
  - `Authorization: Bearer YOUR_JWT_TOKEN`
- Body:
```json
{
  "notification_id": 1
}
```

**Get User Preferences**
- Method: `GET`
- URL: `http://localhost:5000/api/preferences`
- Headers: `Authorization: Bearer YOUR_JWT_TOKEN`

**Set User Preferences**
- Method: `POST`
- URL: `http://localhost:5000/api/preferences`
- Headers:
  - `Content-Type: application/json`
  - `Authorization: Bearer YOUR_JWT_TOKEN`
- Body:
```json
{
  "theme": "dark",
  "notifications": true
}
```

**Request Report**
- Method: `POST`
- URL: `http://localhost:5000/api/reports/request`
- Headers:
  - `Content-Type: application/json`
  - `Authorization: Bearer YOUR_JWT_TOKEN`
- Body:
```json
{
  "report_type": "passenger_analysis",
  "parameters": {}
}
```

**Get Reports**
- Method: `GET`
- URL: `http://localhost:5000/api/reports`
- Headers: `Authorization: Bearer YOUR_JWT_TOKEN`

## Step-by-Step Testing Workflow

### 1. Start Your Flask Server
```bash
cd backend
python app.py
```

### 2. Test Public Endpoints First
1. Open Thunder Client
2. Test the `/api/test` endpoint (GET)
3. Test the `/api/passenger_data` endpoint (GET)

### 3. Test Authentication
1. Register a new user using `/api/register`
2. Login using `/api/login`
3. Copy the JWT token from the response

### 4. Test Protected Endpoints
1. Add the JWT token to the Authorization header
2. Test protected endpoints like `/api/predict`, `/api/notifications`, etc.

## Thunder Client Features

### Collections
- Create collections to organize your API requests
- Save common headers and variables
- Export/import collections

### Environment Variables
- Set base URL: `{{baseUrl}}`
- Set JWT token: `{{jwtToken}}`
- Use variables in requests: `{{baseUrl}}/api/test`

### Request History
- View all previous requests
- Re-run requests easily
- Compare responses

### Response Analysis
- View response status, headers, and body
- Format JSON responses
- Save responses for comparison

## Tips for Effective API Testing

1. **Start with Simple Requests**: Test GET endpoints first
2. **Check Status Codes**: Ensure you get expected responses (200, 201, 400, 401, etc.)
3. **Validate Response Format**: Check that JSON responses match expected structure
4. **Test Error Cases**: Try invalid data to ensure proper error handling
5. **Use Environment Variables**: Store tokens and base URLs for reuse
6. **Document Your Tests**: Add descriptions to your requests

## Common Issues and Solutions

### CORS Errors
- Ensure your Flask app has CORS properly configured
- Check that the frontend URL is in the allowed origins

### Authentication Issues
- Verify JWT token format: `Bearer <token>`
- Check token expiration
- Ensure token is included in Authorization header

### File Upload Issues
- Use `multipart/form-data` for file uploads
- Ensure file size is within limits
- Check file type restrictions

## Next Steps

1. Import the provided collection file
2. Set up environment variables
3. Start testing your endpoints systematically
4. Create additional test cases for edge scenarios 