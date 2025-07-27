#!/usr/bin/env python3
"""
Simple test script to verify Flask server can start without import errors.
"""

try:
    print("Testing imports...")
    from backend.app import app
    print("✅ All imports successful!")
    
    print("Testing Flask app creation...")
    with app.test_client() as client:
        print("✅ Flask app created successfully!")
        
        print("Testing basic endpoint...")
        response = client.get('/api/test')
        print(f"✅ Test endpoint response: {response.status_code}")
        
    print("\n🎉 Server is ready to start!")
    print("You can now run: python backend/app.py")
    
except ImportError as e:
    print(f"❌ Import error: {e}")
    print("Please check your dependencies and imports.")
except Exception as e:
    print(f"❌ Error: {e}")
    print("Please check your Flask app configuration.") 