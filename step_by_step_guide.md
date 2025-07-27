# Step-by-Step Guide: Testing APIs with Thunder Client

## Prerequisites
- VS Code installed
- Python installed
- Your Flask API project ready

---

## Step 1: Install Thunder Client Extension

1. Open VS Code
2. Press `Ctrl+Shift+X` to open Extensions
3. Search for "Thunder Client"
4. Click "Install" on the Thunder Client extension by Ranga Vadhineni
5. Wait for installation to complete

---

## Step 2: Start Your Flask Server

1. Open a terminal in VS Code (`Ctrl+`` `)
2. Navigate to your backend directory:
   ```bash
   cd backend
   ```
3. Install required packages:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the Flask server:
   ```bash
   python app.py
   ```
5. Verify the server is running by seeing output like:
   ```
   * Running on http://127.0.0.1:5000
   ```

---

## Step 3: Open Thunder Client

1. Press `Ctrl+Shift+P` to open Command Palette
2. Type "Thunder Client"
3. Select "Thunder Client: New Request"
4. A new Thunder Client tab will open

---

## Step 4: Test Your First API Endpoint

### Test the Public Test Route

1. In the Thunder Client tab, you'll see:
   - **Method dropdown**: Select "GET"
   - **URL field**: Enter `http://localhost:5001/api/test`
   - **Headers section**: Leave empty for now
   - **Body section**: Not needed for GET requests

2. Click the "Send" button (or press `Ctrl+Enter`)

3. You should see a response like:
   ```json
   {
     "message": "API is working!"
   }
   ```

4. Check the status code (should be 200)

---

## Step 5: Test Another Public Endpoint

1. Change the URL to: `http://localhost:5001/api/passenger_data`
2. Keep the method as "GET"
3. Click "Send"
4. You should see passenger data in JSON format

---

## Step 6: Test Authentication - Register a User

1. Change the method to "POST"
2. Change the URL to: `http://localhost:5001/api/register`
3. In the Headers section, add:
   - **Name**: `Content-Type`
   - **Value**: `application/json`
4. In the Body section:
   - Select "JSON" tab
   - Enter this JSON:
   ```json
   {
     "email": "test@example.com",
     "password": "password123",
     "firstName": "John",
     "lastName": "Doe"
   }
   ```
5. Click "Send"
6. You should get a 201 status code with a success message

---

## Step 7: Test Authentication - Login

1. Change the URL to: `http://localhost:5001/api/login`
2. Keep the method as "POST"
3. Keep the same headers and body format
4. Change the body to:
   ```json
   {
     "email": "test@example.com",
     "password": "password123"
   }
   ```
5. Click "Send"
6. You should get a response with a JWT token:
   ```json
   {
     "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
   }
   ```

---

## Step 8: Copy the JWT Token

1. In the response, copy the entire `access_token` value
2. This token will be used for authenticated requests

---

## Step 9: Test a Protected Endpoint

1. Change the URL to: `http://localhost:5001/api/predict`
2. Keep the method as "POST"
3. In Headers, add:
   - **Name**: `Authorization`
   - **Value**: `Bearer YOUR_JWT_TOKEN_HERE` (replace with your actual token)
4. Keep the `Content-Type: application/json` header
5. In the Body section, enter:
   ```json
   {
     "data": [1, 2, 3, 4, 5]
   }
   ```
6. Click "Send"
7. You should get a successful response with prediction results

---

## Step 10: Create a Collection

1. In Thunder Client, click the "Collections" tab
2. Click "New Collection"
3. Name it "Flask API Tests"
4. Click "Create"

---

## Step 11: Save Your First Request

1. In your current request tab, click the "Save" button
2. Select your "Flask API Tests" collection
3. Name it "Test Route"
4. Click "Save"

---

## Step 12: Create Environment Variables

1. In Thunder Client, click the "Environments" tab
2. Click "New Environment"
3. Name it "Development"
4. Add these variables:
   - **Name**: `baseUrl`
   - **Value**: `http://localhost:5001`
   - **Name**: `jwtToken`
   - **Value**: (paste your JWT token here)
5. Click "Save"

---

## Step 13: Use Environment Variables

1. Create a new request
2. In the URL field, enter: `{{baseUrl}}/api/test`
3. Notice how `{{baseUrl}}` gets replaced with your actual base URL
4. For authenticated requests, use `Bearer {{jwtToken}}` in the Authorization header

---

## Step 14: Test Different HTTP Methods

### GET Request
1. Method: GET
2. URL: `{{baseUrl}}/api/passenger_data`
3. No body needed

### POST Request with JSON
1. Method: POST
2. URL: `{{baseUrl}}/api/predict`
3. Headers: `Content-Type: application/json`
4. Body: JSON data

### POST Request with Form Data
1. Method: POST
2. URL: `{{baseUrl}}/api/upload`
3. Body tab: Select "Form"
4. Add form fields or file uploads

---

## Step 15: Test File Upload

1. Create a new request
2. Method: POST
3. URL: `{{baseUrl}}/api/upload`
4. In Body tab, select "Form"
5. Add a field:
   - **Name**: `file`
   - **Type**: File
   - **Value**: Click "Select File" and choose a CSV file
6. Click "Send"

---

## Step 16: Test Error Cases

### Test Invalid Login
1. Method: POST
2. URL: `{{baseUrl}}/api/login`
3. Body:
   ```json
   {
     "email": "wrong@email.com",
     "password": "wrongpassword"
   }
   ```
4. You should get a 401 status code

### Test Missing Required Fields
1. Method: POST
2. URL: `{{baseUrl}}/api/register`
3. Body:
   ```json
   {
     "email": "test@example.com"
   }
   ```
4. You should get a 400 status code

---

## Step 17: Organize Your Tests

1. In your collection, create folders:
   - "Authentication"
   - "Public Endpoints"
   - "Protected Endpoints"
   - "File Uploads"
   - "Error Testing"

2. Save requests in appropriate folders

---

## Step 18: Test All Your API Endpoints

Go through each endpoint in your Flask app:

### Authentication
- `/api/register` (POST)
- `/api/login` (POST)

### Public Endpoints
- `/api/test` (GET)
- `/api/passenger_data` (GET)

### Protected Endpoints (need JWT token)
- `/api/predict` (POST)
- `/api/detect_anomalies` (POST)
- `/api/generate_insights` (POST)
- `/api/count_passengers` (POST)
- `/api/notifications` (GET)
- `/api/preferences` (GET/POST)
- `/api/reports/request` (POST)
- `/api/reports` (GET)

### File Operations
- `/api/upload` (POST)
- `/api/import/external` (POST)

---

## Step 19: Check Response Details

For each request, check:
1. **Status Code**: 200, 201, 400, 401, 500, etc.
2. **Response Time**: How long the request took
3. **Response Headers**: Content-Type, etc.
4. **Response Body**: JSON format, error messages
5. **Response Size**: Data size

---

## Step 20: Save and Export

1. Save your collection
2. Export it for backup:
   - Click on your collection
   - Click "Export"
   - Choose format (JSON)
   - Save the file

---

## Troubleshooting Tips

### Server Not Starting
- Check if port 5000 is already in use
- Verify all requirements are installed
- Check for Python errors in terminal

### CORS Errors
- Ensure your Flask app has CORS configured
- Check that frontend URL is in allowed origins

### Authentication Errors
- Verify JWT token format: `Bearer <token>`
- Check if token has expired
- Ensure token is in Authorization header

### File Upload Issues
- Use `multipart/form-data` for files
- Check file size limits
- Verify file type restrictions

---

## Next Steps

1. Create automated tests using the collection
2. Set up different environments (Development, Staging, Production)
3. Add more comprehensive error testing
4. Document expected responses for each endpoint
5. Create test data sets for different scenarios

This step-by-step guide will help you manually test each aspect of your API and understand how Thunder Client works with your specific Flask application. 